// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { 
//   User, 
//   Building, 
//   CreditCard, 
//   FileText, 
//   CheckCircle, 
//   Shield 
// } from 'lucide-react';
// import { OnboardingData } from '@/pages/EnhancedMerchantOnboarding';

// interface ReviewSubmitProps {
//   data: OnboardingData;
//   onDataChange: (data: Partial<OnboardingData>) => void;
//   onSubmit: () => Promise<void>;
//   onPrev: () => void;
//   isSubmitting?: boolean;
// }

// export const ReviewSubmit: React.FC<ReviewSubmitProps> = ({
//   data,
//   onDataChange,
//   onSubmit,
//   onPrev,
//   isSubmitting = false,
// }) => {
//   const handleAgreementChange = (checked: boolean) => {
//     onDataChange({ agreementAccepted: checked });
//   };

//     const handleSubmit = async () => {
//         console.log('Documents state:', data.documents);
//         console.log('Has panCard?', !!data.documents?.panCard);
//         console.log('Has aadhaarCard?', !!data.documents?.aadhaarCard);
//         console.log('Has cancelledCheque?', !!data.documents?.cancelledCheque);

//         if (data.agreementAccepted && !isSubmitting) {
//             await onSubmit();
//         }
//     };

//   const getUploadedDocumentCount = () => {
//     const docs = data.documents;
//     return Object.values(docs).filter(doc => doc !== undefined).length;
//   };

//   return (
//     <div className="space-y-8">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-foreground mb-2">
//           Review & Submit
//         </h2>
//         <p className="text-muted-foreground">
//           Please review all your information before submitting
//         </p>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Personal & Business Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5 text-primary" />
//               Personal Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Full Name:</span>
//               <span className="font-medium">{data.fullName}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Mobile:</span>
//               <span className="font-medium">{data.mobileNumber}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Email:</span>
//               <span className="font-medium">{data.email}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">PAN:</span>
//               <span className="font-medium">{data.panNumber}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Aadhaar:</span>
//               <span className="font-medium">
//                 {data.aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/, '****-****-$3')}
//               </span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Building className="h-5 w-5 text-primary" />
//               Business Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Business Name:</span>
//               <span className="font-medium">{data.businessName}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">GST Number:</span>
//               <span className="font-medium">{data.gstNumber}</span>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Bank Details */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <CreditCard className="h-5 w-5 text-primary" />
//               Bank Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Bank Name:</span>
//               <span className="font-medium">{data.bankDetails.bankName}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Account Number:</span>
//               <span className="font-medium">
//                 ****{data.bankDetails.accountNumber.slice(-4)}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">IFSC Code:</span>
//               <span className="font-medium">{data.bankDetails.ifscCode}</span>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Verification Status */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5 text-primary" />
//               Verification Status
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-muted-foreground">KYC Verification:</span>
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="h-4 w-4 text-primary" />
//                 <span className="text-primary font-medium">Completed</span>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-muted-foreground">Video KYC:</span>
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="h-4 w-4 text-primary" />
//                 <span className="text-primary font-medium">Completed</span>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-muted-foreground">Location Verified:</span>
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="h-4 w-4 text-primary" />
//                 <span className="text-primary font-medium">Completed</span>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-muted-foreground">Documents:</span>
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="h-4 w-4 text-primary" />
//                 <span className="text-primary font-medium">
//                   {getUploadedDocumentCount()} Uploaded
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Terms and Conditions */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <FileText className="h-5 w-5 text-primary" />
//             Terms & Conditions
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="p-6 bg-muted/30 rounded-xl mb-4">
//             <h4 className="font-semibold text-foreground mb-3">Merchant Agreement Summary</h4>
//             <ul className="text-sm text-muted-foreground space-y-2">
//               <li>• I agree to SabbPe's Terms of Service and Privacy Policy</li>
//               <li>• I understand the transaction fees and settlement terms</li>
//               <li>• I authorize SabbPe to verify my business and bank details</li>
//               <li>• I confirm that all provided information is accurate and up-to-date</li>
//               <li>• I understand that false information may lead to account suspension</li>
//             </ul>
//           </div>

//           <div className="flex items-start space-x-3">
//             <Checkbox
//               id="agreement"
//               checked={data.agreementAccepted}
//               onCheckedChange={handleAgreementChange}
//               className="mt-1"
//             />
//             <Label 
//               htmlFor="agreement" 
//               className="text-sm text-foreground cursor-pointer leading-relaxed"
//             >
//               I have read and agree to all the terms and conditions, privacy policy, and 
//               merchant agreement. I confirm that all the information provided is accurate 
//               and I understand the responsibilities as a SabbPe merchant partner.
//             </Label>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Navigation */}
//       <div className="flex justify-between pt-6">
//         <Button
//           variant="outline"
//           onClick={onPrev}
//           className="px-8"
//         >
//           Back
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           disabled={!data.agreementAccepted || isSubmitting}
//           className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
//           style={{ background: 'var(--gradient-primary)' }}
//         >
//           {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
//         </Button>
//       </div>
//     </div>
//   );
// };





// import React, { useState, useEffect } from "react";
// import { useAuth } from "@/components/auth/AuthProvider";
// import { supabase } from "@/lib/supabase";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { User, Building, CreditCard, Shield } from "lucide-react";
// import { OnboardingData } from "@/pages/EnhancedMerchantOnboarding";

// interface ReviewSubmitProps {
//   data: OnboardingData;
//   onDataChange: (data: Partial<OnboardingData>) => void;
//   onSubmit: () => Promise<void>;
//   onPrev: () => void;
//   isSubmitting?: boolean;
// }

// interface Ticket {
//   id: string;
//   title: string;
//   status: string;
//   created_at: string;
// }

// export const ReviewSubmit: React.FC<ReviewSubmitProps> = ({
//   data,
//   onDataChange,
//   onSubmit,
//   onPrev,
//   isSubmitting = false,
// }) => {
//   const { user } = useAuth();
//   const merchantId = user?.id;

//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [ticketModalOpen, setTicketModalOpen] = useState(false);
//   const [raiseModalOpen, setRaiseModalOpen] = useState(false);
//   const [loadingTickets, setLoadingTickets] = useState(false);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ============================================
//      RAISE TICKET (REAL API CALL)
//   ============================================ */
//   const handleRaiseTicket = async () => {
//     if (!title || !description || !merchantId) return;

//     setLoading(true);

//     try {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       const response = await fetch(
//         "http://localhost:5000/api/tickets/merchant",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session?.access_token}`,
//           },
//           body: JSON.stringify({
//             //merchant_id: merchantId,
//              merchant_id: user.id,
//             title,
//             description,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const err = await response.json();
//         console.error("Ticket creation failed:", err);
//         return;
//       }

//       console.log("Ticket created successfully");

//       setTitle("");
//       setDescription("");
//       setRaiseModalOpen(false);

//       fetchTickets();
//     } catch (error) {
//       console.error("Raise ticket error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ============================================
//      FETCH MERCHANT TICKETS
//   ============================================ */
//   const fetchTickets = async () => {
//     if (!merchantId) return;

//     try {
//       setLoadingTickets(true);

//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       const response = await fetch(
//         `http://localhost:5000/api/tickets/merchant/${merchantId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${session?.access_token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         console.error("Failed to fetch tickets");
//         return;
//       }

//       const result = await response.json();
//       setTickets(result || []);
//     } catch (error) {
//       console.error("Fetch tickets error:", error);
//     } finally {
//       setLoadingTickets(false);
//     }
//   };

//   useEffect(() => {
//     if (ticketModalOpen) {
//       fetchTickets();
//     }
//   }, [ticketModalOpen]);

//   const handleAgreementChange = (checked: boolean | "indeterminate") => {
//     onDataChange({ agreementAccepted: checked === true });
//   };

//   const getUploadedDocumentCount = () => {
//     const docs = data.documents ?? {};
//     return Object.values(docs).filter(Boolean).length;
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="text-center">
//         <h2 className="text-3xl font-bold">Review & Submit</h2>
//         <p className="text-muted-foreground">
//           Please review all your information before submitting
//         </p>
//       </div>

//       {/* Info Cards */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Personal Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div>Full Name: {data.fullName}</div>
//             <div>Mobile: {data.mobileNumber}</div>
//             <div>Email: {data.email}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Building className="h-5 w-5" />
//               Business Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div>Business Name: {data.businessName}</div>
//             <div>GST: {data.gstNumber}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <CreditCard className="h-5 w-5" />
//               Bank Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div>Bank: {data.bankDetails?.bankName}</div>
//             <div>
//               Account: ****{data.bankDetails?.accountNumber?.slice(-4)}
//             </div>
//             <div>IFSC: {data.bankDetails?.ifscCode}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5" />
//               Verification Status
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             Documents Uploaded: {getUploadedDocumentCount()}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Terms */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-start space-x-3">
//             <Checkbox
//               checked={data.agreementAccepted}
//               onCheckedChange={handleAgreementChange}
//             />
//             <Label>I agree to the terms and conditions.</Label>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Buttons */}
//       <div className="flex gap-4">
//         <Button onClick={() => setRaiseModalOpen(true)}>
//           Raise Support Ticket
//         </Button>

//         <Button onClick={() => setTicketModalOpen(true)}>
//           View My Tickets
//         </Button>
//       </div>

//       {/* Raise Ticket Modal */}
//       {raiseModalOpen && (
//         <div className="p-6 bg-white border rounded-xl shadow-lg">
//           <h3 className="text-lg font-semibold mb-4">
//             Raise Support Ticket
//           </h3>

//           <input
//             type="text"
//             placeholder="Issue title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full border px-3 py-2 rounded mb-3"
//           />

//           <textarea
//             placeholder="Describe your issue..."
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full border px-3 py-2 rounded mb-3"
//           />

//           <div className="flex gap-3">
//             <Button onClick={handleRaiseTicket} disabled={loading}>
//               {loading ? "Submitting..." : "Submit Ticket"}
//             </Button>

//             <Button variant="outline" onClick={() => setRaiseModalOpen(false)}>
//               Cancel
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* View Tickets Modal */}
//       {ticketModalOpen && (
//         <div className="p-6 bg-white border rounded-xl shadow-lg mt-6">
//           <h3 className="text-lg font-semibold mb-4">
//             My Support Tickets
//           </h3>

//           {loadingTickets ? (
//             <div>Loading...</div>
//           ) : tickets.length === 0 ? (
//             <div>No tickets raised yet.</div>
//           ) : (
//             <div className="space-y-3">
//               {tickets.map((ticket) => (
//                 <div
//                   key={ticket.id}
//                   className="p-4 border rounded-lg"
//                 >
//                   <div className="font-semibold">{ticket.title}</div>
//                   <div className="text-sm text-gray-500">
//                     Status: {ticket.status}
//                   </div>
//                   <div className="text-xs text-gray-400">
//                     ID: {ticket.id}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <Button
//             className="mt-4"
//             variant="outline"
//             onClick={() => setTicketModalOpen(false)}
//           >
//             Close
//           </Button>
//         </div>
//       )}

//       {/* Navigation */}
//       <div className="flex justify-between pt-6">
//         <Button variant="outline" onClick={onPrev}>
//           Back
//         </Button>

//         <Button
//           onClick={onSubmit}
//           disabled={!data.agreementAccepted || isSubmitting}
//         >
//           {isSubmitting ? "Submitting..." : "Submit for Verification"}
//         </Button>
//       </div>
//     </div>
//   );
// };



import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { User, Building, CreditCard, FileText, CheckCircle, Shield } from 'lucide-react';
import { OnboardingData } from '@/pages/EnhancedMerchantOnboarding';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

interface ReviewSubmitProps {
  data: OnboardingData;
  onDataChange: (data: Partial<OnboardingData>) => void;
  onSubmit: () => Promise<void>;
  onPrev: () => void;
  isSubmitting?: boolean;
}

interface Ticket {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

export const ReviewSubmit: React.FC<ReviewSubmitProps> = ({
  data,
  onDataChange,
  onSubmit,
  onPrev,
  isSubmitting = false,
}) => {
  const { user } = useAuth();
  const merchantId = user?.id;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [raiseModalOpen, setRaiseModalOpen] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAgreementChange = (checked: boolean | 'indeterminate') => {
    onDataChange({ agreementAccepted: checked === true });
  };

  const getUploadedDocumentCount = () => {
    const docs = data.documents ?? {};
    return Object.values(docs).filter(Boolean).length;
  };

  /* ============================================
     RAISE TICKET
  ============================================ */
  const handleRaiseTicket = async () => {
    if (!title || !description || !merchantId) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('http://localhost:5000/api/tickets/merchant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          merchant_id: merchantId,
          title,
          description,
        }),
      });

      if (!response.ok) {
        console.error('Ticket creation failed');
        return;
      }

      setTitle('');
      setDescription('');
      setRaiseModalOpen(false);
      fetchTickets();
    } catch (error) {
      console.error('Raise ticket error:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ============================================
     FETCH MERCHANT TICKETS
  ============================================ */
  const fetchTickets = async () => {
    if (!merchantId) return;
    setLoadingTickets(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`http://localhost:5000/api/tickets/merchant/${merchantId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (!response.ok) {
        console.error('Failed to fetch tickets');
        return;
      }

      const result = await response.json();
      setTickets(result || []);
    } catch (error) {
      console.error('Fetch tickets error:', error);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (ticketModalOpen) fetchTickets();
  }, [ticketModalOpen]);

  /* ============================================
     SUBMIT FOR VERIFICATION
  ============================================ */
  const handleSubmit = async () => {
    if (data.agreementAccepted && !isSubmitting) {
      await onSubmit();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Review & Submit</h2>
        <p className="text-muted-foreground">
          Please review all your information before submitting
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Full Name:</span> <span className="font-medium">{data.fullName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Mobile:</span> <span className="font-medium">{data.mobileNumber}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="font-medium">{data.email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">PAN:</span> <span className="font-medium">{data.panNumber}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Aadhaar:</span> <span className="font-medium">{data.aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/, '****-****-$3')}</span></div>
          </CardContent>
        </Card>

        {/* Business Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" /> Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Business Name:</span> <span className="font-medium">{data.businessName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST Number:</span> <span className="font-medium">{data.gstNumber}</span></div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Bank Name:</span> <span className="font-medium">{data.bankDetails.bankName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Account Number:</span> <span className="font-medium">****{data.bankDetails.accountNumber.slice(-4)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">IFSC Code:</span> <span className="font-medium">{data.bankDetails.ifscCode}</span></div>
          </CardContent>
        </Card>

        {/* Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Documents:</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">{getUploadedDocumentCount()} Uploaded</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-3">
            <Checkbox id="agreement" checked={data.agreementAccepted} onCheckedChange={handleAgreementChange} className="mt-1" />
            <Label htmlFor="agreement" className="text-sm text-foreground cursor-pointer leading-relaxed">
              I have read and agree to all terms and confirm that all information provided is accurate.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Buttons */}
      <div className="flex gap-4">
        <Button onClick={() => setRaiseModalOpen(true)}>Raise Support Ticket</Button>
        <Button onClick={() => setTicketModalOpen(true)}>View My Tickets</Button>
      </div>

      {/* Raise Ticket Modal */}
      {raiseModalOpen && (
        <div className="p-6 bg-white border rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Raise Support Ticket</h3>
          <input type="text" placeholder="Issue title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded mb-3" />
          <textarea placeholder="Describe your issue..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded mb-3" />
          <div className="flex gap-3">
            <Button onClick={handleRaiseTicket} disabled={loading}>{loading ? 'Submitting...' : 'Submit Ticket'}</Button>
            <Button variant="outline" onClick={() => setRaiseModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* View Tickets Modal */}
      {ticketModalOpen && (
        <div className="p-6 bg-white border rounded-xl shadow-lg mt-6">
          <h3 className="text-lg font-semibold mb-4">My Support Tickets</h3>
          {loadingTickets ? (
            <div>Loading...</div>
          ) : tickets.length === 0 ? (
            <div>No tickets raised yet.</div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 border rounded-lg">
                  <div className="font-semibold">{ticket.title}</div>
                  <div className="text-sm text-gray-500">Status: {ticket.status}</div>
                  <div className="text-xs text-gray-400">ID: {ticket.id}</div>
                </div>
              ))}
            </div>
          )}
          <Button className="mt-4" variant="outline" onClick={() => setTicketModalOpen(false)}>Close</Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={handleSubmit} disabled={!data.agreementAccepted || isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
        </Button>
      </div>
    </div>
  );
};