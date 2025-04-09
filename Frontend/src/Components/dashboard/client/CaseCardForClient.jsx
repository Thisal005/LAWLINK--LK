import React, { useState, useEffect, useContext } from "react";
import useFetchCase from "../../../hooks/useFetchCase";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../../Context/AppContext";

const CaseCard = ({ caseId }) => {
  const { caseData, loading } = useFetchCase(caseId);
  const { backendUrl, userData } = useContext(AppContext);
  const [offers, setOffers] = useState([]);
  const [offerLoading, setOfferLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      if (
        !caseId ||
        !userData?._id ||
        loading ||
        !caseData ||
        caseData.lawyerId ||
        ["closed", "completed"].includes(caseData.status)
      ) {
        setOffers([]);
        return;
      }

      setOfferLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/case/user/notifications`, {
          withCredentials: true,
        });
        const caseOffers = response.data.data
          .filter(
            (n) =>
              n.unread &&
              n.metadata?.caseId === caseId &&
              n.message.includes("A lawyer is interested")
          )
          .map((n) => ({
            notificationId: n._id,
            lawyerId: n.metadata.lawyerId,
            message: n.message,
          }));
        setOffers(caseOffers);
      } catch (error) {
        console.error("Error fetching offers:", error.response?.data || error.message);
        setOffers([]);
        toast.error("Failed to fetch offers");
      } finally {
        setOfferLoading(false);
      }
    };

    fetchOffers();
  }, [caseId, userData, backendUrl, loading, caseData]);

  const handleAcceptOffer = async (lawyerId) => {
    console.log("Accept offer clicked for lawyerId:", lawyerId);
    try {
      const response = await axios.patch(
        `${backendUrl}/api/case/accept-offer/${caseId}`,
        { lawyerId },
        { withCredentials: true }
      );
      if (response.data.success) {
        setOffers((prev) => prev.filter((o) => o.lawyerId !== lawyerId));
        toast.success("Lawyer assigned to your case!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error accepting offer:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to accept offer");
    }
  };

  const handleRejectOffer = async (notificationId) => {
    console.log("Reject offer clicked for notificationId:", notificationId);
    try {
      const response = await axios.post(
        `${backendUrl}/api/case/reject-offer/${notificationId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setOffers((prev) => prev.filter((o) => o.notificationId !== notificationId));
        toast.success("Offer rejected");
      }
    } catch (error) {
      console.error("Error rejecting offer:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to reject offer");
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading case details...</p>;
  }

  if (!caseData) {
    console.warn("CaseCard - No caseData for caseId:", caseId);
    return (
      <div className="bg-white border border-gray-200 p-6 rounded-2xl text-center">
        <p className="text-gray-600 mb-4">You don't have any cases yet.</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = "/post-case";
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
          style={{ zIndex: 1000, pointerEvents: "auto" }}
        >
          Post Your First Case
        </button>
      </div>
    );
  }

  const isPending = caseData.status === "pending" || !caseData.lawyerId;
  const isClosedOrCompleted = ["closed", "completed"].includes(caseData.status);

  const capitalizeStatus = (status) => {
    if (!status || typeof status !== "string") {
      return "Unknown";
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <article
      className={`group bg-white border border-gray-200 p-4 rounded-2xl transition-all duration-300 hover:shadow-lg relative z-50 ${
        isClosedOrCompleted ? "opacity-75" : "hover:border-blue-500 hover:bg-blue-50/10"
      }`}
      role="article"
      tabIndex="0"
      aria-label="Your case details"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xs uppercase tracking-wide text-gray-600 font-semibold">
            Your Case
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-500">
            {caseData.subject || "Unnamed Case"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Your Lawyer: {isClosedOrCompleted ? "Disconnected" : (isPending ? "TBA" : caseData.lawyerId?.fullName || "None")}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center relative"
          aria-hidden="true"
        >
          <span
            className={`w-4 h-4 rounded-full ${
              caseData.status === "ongoing"
                ? "bg-blue-500"
                : caseData.status === "pending"
                ? "bg-orange-500"
                : isClosedOrCompleted
                ? "bg-gray-500"
                : "bg-gray-500"
            } shadow-[0_0_12px_rgba(16,185,129,0.3)] absolute animate-ping`}
          ></span>
          <span
            className={`w-4 h-4 rounded-full ${
              caseData.status === "ongoing"
                ? "bg-blue-500"
                : caseData.status === "pending"
                ? "bg-orange-500"
                : isClosedOrCompleted
                ? "bg-gray-500"
                : "bg-gray-500"
            } shadow-[0_0_12px_rgba(16,185,129,0.3)] absolute`}
          ></span>
        </div>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm border-t border-gray-100 pt-4">
        <li className="flex items-center gap-2">
          <span className="text-gray-600">Case Subject:</span>
          <span className="font-semibold text-gray-900">
            {caseData.subject || "Unnamed Case"}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-gray-600">Case Type:</span>
          <span className="font-semibold text-gray-900">
            {caseData.caseType || "N/A"}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-gray-600">Status:</span>
          <span
            className={`font-semibold ${
              caseData.status === "ongoing"
                ? "text-blue-700"
                : caseData.status === "pending"
                ? "text-orange-700"
                : isClosedOrCompleted
                ? "text-gray-700"
                : "text-gray-700"
            }`}
          >
            {capitalizeStatus(caseData.status)}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-gray-600">Next Court Date:</span>
          <span className="font-semibold text-gray-900">
            {isPending || isClosedOrCompleted
              ? "TBA"
              : caseData.courtDate
              ? new Date(caseData.courtDate).toLocaleDateString()
              : "TBD"}
          </span>
        </li>
        {caseData.status === "pending" && (
          <li className="flex items-center gap-2">
            <span className="text-gray-600">Expires On:</span>
            <span className="font-semibold text-gray-900">
              {caseData.expiresAt
                ? new Date(caseData.expiresAt).toLocaleDateString()
                : "N/A"}
            </span>
          </li>
        )}
      </ul>
      {isPending && !isClosedOrCompleted && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-700">Offers</h4>
          {offerLoading ? (
            <p className="text-gray-600">Loading offers...</p>
          ) : offers.length > 0 ? (
            <ul className="space-y-2">
              {offers.map((offer) => (
                <li
                  key={offer.notificationId}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-800">
                    A lawyer has expressed interest in your case. Would you like to accept?
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptOffer(offer.lawyerId);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1 px-2 rounded transition-all"
                      style={{ zIndex: 1000, pointerEvents: "auto" }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRejectOffer(offer.notificationId);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded transition-all"
                      style={{ zIndex: 1000, pointerEvents: "auto" }}
                    >
                      No
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No offers yet.</p>
          )}
        </div>
      )}
    </article>
  );
};

export default CaseCard;