import axios from 'axios';

const MSG91_URL = process.env.MSG91_WHATSAPP_URL || 'https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/';
const SMS_FLOW_URL = process.env.MSG91_SMS_FLOW_URL || 'https://control.msg91.com/api/v5/flow';
const AUTH_KEY = process.env.MSG91_AUTHKEY || '';
const INTEGRATED_NUMBER = process.env.MSG91_INTEGRATED_NUMBER || '';
const INVITE_TEMPLATE_NAME = process.env.MSG91_INVITE_TEMPLATE || 'merchantinv';
const INVITE_NAMESPACE = process.env.MSG91_INVITE_NAMESPACE || 'b893736c_3468_4686_bdc8_462e51c78510';

export interface SendInviteResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send a WhatsApp message with onboarding invite link to a merchant
 */
export const sendInviteViaWhatsApp = async (
  mobileNumber: string,
  merchantName: string,
  inviteLink: string
): Promise<SendInviteResult> => {
  if (!AUTH_KEY || !INTEGRATED_NUMBER) {
    console.error('❌ MSG91 credentials not configured');
    return { success: false, error: 'MSG91 credentials not configured' };
  }

  // Format mobile number (ensure it starts with country code)
  let formattedNumber = mobileNumber.trim();
  if (!formattedNumber.startsWith('+')) {
    if (!formattedNumber.startsWith('91')) {
      formattedNumber = '91' + formattedNumber; // India country code
    }
    formattedNumber = '+' + formattedNumber;
  }

  const payload = {
    integrated_number: INTEGRATED_NUMBER,
    content_type: 'template',
    payload: {
      messaging_product: 'whatsapp',
      type: 'template',
      template: {
        name: INVITE_TEMPLATE_NAME,
        language: { code: 'en', policy: 'deterministic' },
        namespace: INVITE_NAMESPACE,
        to_and_components: [
          {
            to: [formattedNumber],
            components: {
              button_1: {
                subtype: 'url',
                type: 'text',
                value: inviteLink
              }
            }
          }
        ]
      }
    }
  };

  try {
    console.log(`📧 Sending WhatsApp invite to ${formattedNumber} (${merchantName})`);
    console.log('📋 Payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(MSG91_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'authkey': AUTH_KEY
      },
      timeout: 10000
    });

    console.log(`✅ WhatsApp response:`, JSON.stringify(response.data, null, 2));

    // Check for global errors in MSG91 response
    if (response.data?.hasError === true || response.data?.errors) {
      console.error('❌ MSG91 API Error in response:', response.data);
      return {
        success: false,
        error: `MSG91 Error: ${response.data.errors || JSON.stringify(response.data)}`
      };
    }

    if (response.data?.status !== 'success') {
      console.error('❌ MSG91 status not success:', response.data?.status);
      return {
        success: false,
        error: `MSG91 returned status: ${response.data?.status}`
      };
    }

    // Some responses include per-recipient statuses
    if (Array.isArray(response.data.response)) {
      const item = response.data.response[0];
      if (item && item.status && item.status !== 'success') {
        console.warn('⚠️ WhatsApp recipient status not success:', item);
        return { success: false, error: `recipient status: ${item.status}` };
      }
    }

    // Extract message ID from response
    const messageId = response.data?.request_id || response.data?.message_id || '';

    if (response.status === 200 || response.status === 201) {
      console.log(`✅ Message sent with ID: ${messageId || '(none returned)'}`);
      return {
        success: true,
        messageId: messageId || ''
      };
    }

    return {
      success: false,
      error: response.data?.message || `HTTP ${response.status}`
    };
  } catch (error: any) {
    console.error('❌ WhatsApp send error:', error?.message);
    if (error?.response?.data) {
      console.error('   MSG91 Response:', JSON.stringify(error.response.data, null, 2));
      console.error('   Status Code:', error.response.status);
    }
    const errorMsg = error.response?.data?.message || error.message || 'Failed to send WhatsApp';
    return { success: false, error: errorMsg };
  }
};

/**
 * Send an SMS flow message via MSG91 (fallback for WhatsApp)
 */
export const sendInviteViaSms = async (
  mobileNumber: string,
  inviteLink: string,
  merchantName?: string
): Promise<SendInviteResult> => {
  if (!AUTH_KEY) {
    console.error('❌ MSG91 auth key not set');
    return { success: false, error: 'MSG91 auth key missing' };
  }

  let formatted = mobileNumber.trim();
  if (!formatted.startsWith('91')) {
    formatted = '91' + formatted;
  }
  console.log(`📲 [SMS helper] formatted number: ${formatted}`);

  const body = {
    template_id: process.env.MSG91_SMS_TEMPLATE_ID || '694e236ec594fc01ba61af73',
    short_url: '1',
    realTimeResponse: '1',
    recipients: [
      {
        mobiles: formatted,
        VAR1: inviteLink,
        VAR2: merchantName || ''
      }
    ]
  };

  try {
    console.log(`📩 Sending SMS invite to ${formatted} (${merchantName})`);
    console.log('📋 SMS payload', JSON.stringify(body, null, 2));
    const resp = await axios.post(SMS_FLOW_URL, body, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authkey: AUTH_KEY
      },
      timeout: 10000
    });
    console.log('📋 SMS response', resp.data);

    if (resp.status >= 200 && resp.status < 300) {
      const messageId = resp.data.request_id || resp.data.message_id || '';
      return { success: true, messageId };
    }
    return {
      success: false,
      error: `HTTP ${resp.status} – ${JSON.stringify(resp.data)}`
    };
  } catch (err: any) {
    console.error('❌ SMS send error:', err.message);
    return { success: false, error: err.response?.data || err.message };
  }
};
