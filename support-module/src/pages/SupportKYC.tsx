// import React, { useEffect, useState } from "react";
// import { useSupportAuth } from "../context/SupportAuthContext";

// const SupportKYC: React.FC = () => {
//   const { token } = useSupportAuth();
//   const [kycTickets, setKycTickets] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchKYCTickets();
//   }, []);

//   const fetchKYCTickets = async () => {
//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/tickets?module=kyc",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();
//       setKycTickets(data.tickets || []);
//     } catch (err) {
//       console.error("Failed to fetch KYC tickets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const base = "px-3 py-1 rounded-full text-xs font-semibold uppercase";
//     switch (status) {
//       case "pending":
//         return `${base} bg-yellow-100 text-yellow-700`;
//       case "approved":
//         return `${base} bg-green-100 text-green-700`;
//       case "rejected":
//         return `${base} bg-red-100 text-red-700`;
//       default:
//         return `${base} bg-gray-100 text-gray-700`;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-gray-500">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-6">KYC Verification</h1>

//       {kycTickets.length === 0 ? (
//         <div className="bg-white rounded-xl shadow-sm p-8 text-center">
//           <p className="text-gray-500">No KYC tickets found</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
//               <tr>
//                 <th className="p-4 text-left">Ticket ID</th>
//                 <th className="p-4 text-left">Merchant Name</th>
//                 <th className="p-4 text-left">Email</th>
//                 <th className="p-4 text-left">Status</th>
//                 <th className="p-4 text-left">Created At</th>
//               </tr>
//             </thead>

//             <tbody>
//               {kycTickets.map((ticket) => (
//                 <tr key={ticket.id} className="border-b hover:bg-gray-50">
//                   <td className="p-4 font-mono text-xs">{ticket.id}</td>
//                   <td className="p-4">{ticket.merchant_name || "N/A"}</td>
//                   <td className="p-4">{ticket.email || "N/A"}</td>
//                   <td className="p-4">
//                     <span className={getStatusBadge(ticket.status)}>
//                       {ticket.status}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     {ticket.created_at
//                       ? new Date(ticket.created_at).toLocaleDateString()
//                       : "N/A"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SupportKYC;

import React, { useEffect, useState } from "react";
import { useSupportAuth } from "../context/SupportAuthContext";
import { useNavigate } from "react-router-dom";

interface Merchant {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  approval_status: string;
}

const SupportKYC = () => {
  const { token } = useSupportAuth();
  const navigate = useNavigate();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssignedKYC();
  }, []);

  const fetchAssignedKYC = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/tickets/support/assigned-kyc",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assigned merchants");
      }

      const data = await response.json();
      setMerchants(Array.isArray(data) ? data : []);

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">
        Assigned KYC Reviews
      </h1>

      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        {merchants.length === 0 ? (
          <div className="p-6 text-gray-500">
            No assigned merchants
          </div>
        ) : (
          merchants.map((merchant) => (
            <div
              key={merchant.id}
              className="p-4 border-b flex justify-between items-center hover:bg-indigo-50"
            >
              <div>
                <div className="font-semibold">
                  {merchant.full_name}
                </div>
                <div className="text-sm text-gray-500">
                  {merchant.email}
                </div>
                <div className="text-xs mt-1">
                  Status: {merchant.approval_status}
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(`/merchant-review/${merchant.user_id}`)
                }
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              >
                Review
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default SupportKYC;