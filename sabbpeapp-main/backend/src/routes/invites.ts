import { Router, Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendInviteViaWhatsApp, sendInviteViaSms } from '../services/inviteService';
import { logger } from '../utils/logger';

const router = Router();

// Normalize frontend URL (adds protocol or colon before port if missing)
const normalizeFrontendUrl = (raw?: string) => {
    let url = raw || process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
    if (!url) return 'http://localhost:5173';
    if (!/^[a-zA-Z]+:\/\//.test(url)) url = 'http://' + url;
    url = url.replace(/:\/\/([^:\/]+)(\d{2,5})/, '://$1:$2');
    url = url.replace(/(localhost)(\d{2,5})/, '$1:$2');
    return url.replace(/\/$/, '');
};

const getAdminClient = () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
};

interface BulkInviteRequest {
    merchants: Array<{
        email: string;
        fullName: string;
        mobileNumber: string;
        businessName?: string;
    }>;
}

/**
 * POST /api/invites/bulk-send
 * 
 * Send onboarding invites to multiple merchants via WhatsApp
 * Each merchant gets a unique onboarding link they can click to start the flow
 * 
 * Request body:
 * {
 *   merchants: [
 *     { email, fullName, mobileNumber, businessName }
 *   ]
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   results: [
 *     { email, inviteToken, status, error? }
 *   ],
 *   sent: number,
 *   failed: number
 * }
 */
router.post(
    '/bulk-send',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log('🔵 [POST /invites/bulk-send] Request received');

            const { merchants } = req.body as BulkInviteRequest;

            if (!merchants || !Array.isArray(merchants) || merchants.length === 0) {
                res.status(400).json({
                    success: false,
                    error: { message: 'merchants array is required and must not be empty' }
                });
                return;
            }

            // Verify distributor via JWT
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
                res.status(401).json({ success: false, error: { message: 'Authorization required' } });
                return;
            }

            const callerJwt = authHeader.replace('Bearer ', '');
            const admin = getAdminClient();

            const { data: { user: distributor }, error: userError } = await admin.auth.getUser(callerJwt);
            if (userError || !distributor) {
                res.status(401).json({ success: false, error: { message: 'Invalid session' } });
                return;
            }

            // Verify user is a distributor
            const { data: roleData } = await admin
                .from('user_roles')
                .select('role')
                .eq('user_id', distributor.id)
                .maybeSingle();

            if (roleData?.role !== 'distributor') {
                res.status(403).json({ success: false, error: { message: 'Only distributors can send invites' } });
                return;
            }

            console.log(`📧 Sending ${merchants.length} invites for distributor ${distributor.id}`);

            const results: any[] = [];
            let sent = 0;
            let failed = 0;

            // Process each merchant
            for (const merchant of merchants) {
                try {
                    // Validate merchant data
                    if (!merchant.email || !merchant.fullName || !merchant.mobileNumber) {
                        results.push({
                            email: merchant.email || 'unknown',
                            status: 'failed',
                            error: 'Missing required fields: email, fullName, mobileNumber'
                        });
                        failed++;
                        continue;
                    }

                    // Generate unique invite token
                    const inviteToken = crypto.randomUUID();
                    const fullFrontendUrl = normalizeFrontendUrl(process.env.VITE_FRONTEND_URL);
                    const inviteLink = `${fullFrontendUrl}/invite/${inviteToken}`;

                    // Store invite in DB (don't set status yet - will be determined after WhatsApp send)
                    const { data: inviteData, error: inviteError } = await admin
                        .from('merchant_invitations')
                        .insert({
                            distributor_id: distributor.id,
                            merchant_email: merchant.email,
                            merchant_name: merchant.fullName,
                            merchant_mobile: merchant.mobileNumber,
                            business_name: merchant.businessName || null,
                            invitation_token: inviteToken,
                            invite_token: inviteToken,
                            invite_link: inviteLink,
                            status: 'sent',  // Set to 'sent' initially, will remain or be updated to 'failed_to_send'
                            sent_via: 'whatsapp', // default since we attempt WhatsApp first
                            sent_at: new Date().toISOString()
                        })
                        .select()
                        .single();

                    if (inviteError || !inviteData) {
                        console.error(`❌ Failed to store invite for ${merchant.email}:`, inviteError);
                        results.push({
                            email: merchant.email,
                            status: 'failed',
                            error: `Failed to create invite record: ${inviteError?.message}`
                        });
                        failed++;
                        continue;
                    }

                    // Try WhatsApp message first
                    let whatsappResult = await sendInviteViaWhatsApp(
                        merchant.mobileNumber,
                        merchant.fullName,
                        inviteLink
                    );

                    // if WA claim success but no ID returned, treat as failed so we can fallback
                    if (whatsappResult.success && !whatsappResult.messageId) {
                        console.warn(`⚠️ WhatsApp send returned no messageId; falling back to SMS for ${merchant.mobileNumber}`);
                        whatsappResult = { success: false, error: 'no messageId returned' };
                    }

                    if (whatsappResult.success) {
                        await admin
                            .from('merchant_invitations')
                            .update({
                                whatsapp_message_id: whatsappResult.messageId || null,
                                sent_via: 'whatsapp',
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', inviteData.id);

                        results.push({
                            email: merchant.email,
                            inviteToken,
                            status: 'sent',
                            via: 'whatsapp',
                            messageId: whatsappResult.messageId
                        });
                        sent++;

                        console.log(`✅ Invite sent to ${merchant.email} (${merchant.mobileNumber}) via WhatsApp`);
                    } else {
                        console.warn(`⚠️ WhatsApp failed for ${merchant.mobileNumber}:`, whatsappResult.error);
                        // fallback to SMS
                        const smsResult = await sendInviteViaSms(
                            merchant.mobileNumber,
                            inviteLink,
                            merchant.fullName
                        );

                        if (smsResult.success) {
                            await admin
                                .from('merchant_invitations')
                                .update({
                                    sent_via: 'sms',
                                    updated_at: new Date().toISOString()
                                })
                                .eq('id', inviteData.id);

                            results.push({
                                email: merchant.email,
                                inviteToken,
                                status: 'sent',
                                via: 'sms',
                                messageId: smsResult.messageId
                            });
                            sent++;

                            console.log(`✅ Invite sent to ${merchant.email} (${merchant.mobileNumber}) via SMS`);
                        } else {
                            console.error('❌ SMS fallback also failed:', smsResult);
                            await admin
                                .from('merchant_invitations')
                                .update({
                                    status: 'failed_to_send',
                                    send_error: whatsappResult.error + ' / ' + smsResult.error,
                                    updated_at: new Date().toISOString()
                                })
                                .eq('id', inviteData.id);

                            results.push({
                                email: merchant.email,
                                inviteToken,
                                status: 'failed_to_send',
                                error: whatsappResult.error
                            });
                            failed++;

                            console.error(`❌ Both WhatsApp and SMS failed for ${merchant.email}:`, whatsappResult.error, smsResult.error);
                        }
                    }
                } catch (err) {
                    console.error(`❌ Error processing merchant ${merchant.email}:`, err);
                    results.push({
                        email: merchant.email,
                        status: 'failed',
                        error: err instanceof Error ? err.message : String(err)
                    });
                    failed++;
                }
            }

            console.log(`\n📊 Invite Results: ${sent} sent, ${failed} failed`);

            res.status(200).json({
                success: true,
                results,
                sent,
                failed,
                total: merchants.length
            });
        } catch (error) {
            console.error('❌ Error in bulk-send:', error);
            next(error);
        }
    }
);

export default router;
