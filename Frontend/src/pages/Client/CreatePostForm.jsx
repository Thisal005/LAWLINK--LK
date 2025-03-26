// frontend/src/PostCaseForm.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import ClietnSidebar from "../../Components/dashboard/client/ClientSideBar";
import Header from "../../Components/dashboard/client/ClientHeader"; 
import { 
  FileText, 
  Briefcase, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Send, 
  Clock,
  Info,
  Shield,
  Book,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function PostCaseForm() {
  const { userData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    caseType: "",
    district: "",
    courtDate: "",
    description: "",
    clientId: userData?._id || "",
  });
  const [noCourtDate, setNoCourtDate] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [activeCaseCount, setActiveCaseCount] = useState(0); // Changed from pendingCasesCount
  const [showTips, setShowTips] = useState(true);

  // Case types data with categories
  const caseTypes = {
    "Criminal Law": [
      "Criminal Defense",
      "Drug Offenses",
      "DUI/DWI",
      "White Collar Crimes",
      "Assault & Battery",
      "Theft & Burglary"
    ],
    "Civil Law": [
      "Contract Disputes",
      "Property Law",
      "Personal Injury",
      "Medical Malpractice",
      "Professional Negligence",
      "Defamation"
    ],
    "Family Law": [
      "Divorce",
      "Child Custody",
      "Adoption",
      "Domestic Violence",
      "Child Support",
      "Alimony"
    ],
    "Corporate Law": [
      "Business Formation",
      "Mergers & Acquisitions",
      "Corporate Governance",
      "Securities Law",
      "Intellectual Property",
      "Employment Law"
    ],
    "Other Areas": [
      "Immigration",
      "Tax Law",
      "Bankruptcy",
      "Environmental Law",
      "Estate Planning",
      "Administrative Law"
    ]
  };

  // Districts by region
  const districts = {
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Ratnapura", "Kegalle"]
  };

  useEffect(() => {
    const fetchActiveCases = async () => {
      if (!userData?._id) return;
      try {
        const response = await fetch(`${backendUrl}/api/case/user/${userData._id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.success) {
          // Count cases that are either "pending" or "ongoing"
          const activeCases = data.data.filter(
            (caseItem) => caseItem.status === "pending" || caseItem.status === "ongoing"
          ).length;
          setActiveCaseCount(activeCases);
        } else {
          console.error("Error fetching active cases:", data.msg);
        }
      } catch (err) {
        console.error("Error fetching active cases:", err);
      }
    };
    fetchActiveCases();
  }, [userData, backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData?._id) {
      setError("You must be logged in to create a case.");
      toast.error("Please log in to post a case.");
      return;
    }
    if (!agreed) {
      setError("You must agree to post this case anonymously.");
      toast.error("Please agree to the anonymity terms.");
      return;
    }
    if (activeCaseCount >= 1) { // Changed from 3 to 1
      setError("You cannot submit more cases; you already have an active case.");
      toast.error("You cannot submit more cases; you already have an active case.");
      return;
    }

    setLoading(true);
    setError(null);

    const finalFormData = {
      ...formData,
      courtDate: noCourtDate ? "" : formData.courtDate,
    };

    try {
      const response = await fetch(`${backendUrl}/api/case/create-case`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to create case");
      }

      await response.json();
      toast.success("Your case is now live!");
      setActiveCaseCount((prev) => prev + 1); // Updated to reflect single case limit
      navigate("/client-dashboard");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <ClietnSidebar />
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        <Header displayName={userData?.fullName || "Client"} practiceAreas="Client" />
        
        <main className="flex-1 flex items-start justify-center p-6 pt-20 lg:pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl border border-gray-100 relative overflow-hidden"
          >
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-bl-full"></div>

            {/* Header Section */}
            <div className="mb-8 relative z-10">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 text-center">Post a Case Anonymously</h2>
              <p className="text-gray-600 text-center mt-2 max-w-2xl mx-auto">
                Connect with qualified attorneys discreetly. Your case remains anonymous until you engage a professional.
              </p>
            </div>

            {/* Case Limit Banner */}
            <div className={`mb-8 p-4 rounded-lg border ${activeCaseCount >= 1 ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${activeCaseCount >= 1 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {activeCaseCount >= 1 ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${activeCaseCount >= 1 ? 'text-red-700' : 'text-yellow-700'}`}>
                    {activeCaseCount >= 1 ? 'Active Case Limit Reached' : 'Active Case Status'}
                  </h3>
                  <p className={`text-xs mt-1 ${activeCaseCount >= 1 ? 'text-red-600' : 'text-yellow-600'}`}>
                    {activeCaseCount >= 1 
                      ? 'You already have an active case (pending or ongoing). Resolve it before posting a new one.'
                      : `You have ${activeCaseCount}/1 active cases. Limit: 1 active case at a time.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Info Indicators */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-3 border border-blue-100">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">14-Day Active Posting</span>
              </div>
              <div className="p-4 bg-green-50 rounded-lg flex items-center gap-3 border border-green-100">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">You Select Your Attorney</span>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg flex items-center gap-3 border border-amber-100">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Fully Anonymous</span>
              </div>
            </div>

            {/* Tips Section */}
            <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                onClick={() => setShowTips(!showTips)}
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Tips for Posting Your Case</h3>
                </div>
                <span className="text-blue-600 text-sm font-medium">{showTips ? "Hide" : "Show"}</span>
              </div>
              {showTips && (
                <div className="p-4 bg-white">
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Be specific</strong> about your legal issue, avoiding personal identifiers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Include key dates</strong> (e.g., incidents, deadlines, hearings).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>State your goals</strong> (e.g., compensation, defense, advice).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Do not include</strong> names, addresses, or contact details.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </motion.div>
            )}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-2"
              >
                <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm text-blue-700">Submitting your case...</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> Case Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Property Boundary Dispute"
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 placeholder-gray-400 text-sm"
                  disabled={loading || activeCaseCount >= 1} // Updated condition
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" /> Case Type
                  </label>
                  <select
                    name="caseType"
                    value={formData.caseType}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 text-sm"
                    disabled={loading || activeCaseCount >= 1} // Updated condition
                    required
                  >
                    <option value="">Select case type</option>
                    {Object.entries(caseTypes).map(([category, types]) => (
                      <optgroup key={category} label={category}>
                        {types.map((type) => (
                          <option key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                            {type}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" /> District
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 text-sm"
                    disabled={loading || activeCaseCount >= 1} // Updated condition
                    required
                  >
                    <option value="">Select district</option>
                    {Object.entries(districts).map(([province, provinceDistricts]) => (
                      <optgroup key={province} label={province}>
                        {provinceDistricts.map((district) => (
                          <option key={district} value={district.toLowerCase()}>
                            {district}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" /> Court Date 
                  <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="date"
                  name="courtDate"
                  value={formData.courtDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                  disabled={loading || noCourtDate || activeCaseCount >= 1} // Updated condition
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="noCourtDate"
                    checked={noCourtDate}
                    onChange={(e) => setNoCourtDate(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading || activeCaseCount >= 1} // Updated condition
                  />
                  <label htmlFor="noCourtDate" className="text-xs text-gray-600">No court date scheduled yet</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Book className="w-4 h-4 text-blue-600" /> Case Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide details of your case without including sensitive personal information..."
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 placeholder-gray-400 resize-none h-32 text-sm"
                  disabled={loading || activeCaseCount >= 1} // Updated condition
                  required
                />
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">Suggested Details:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Key dates (incidents, filings, deadlines)</li>
                    <li>Legal questions or concerns</li>
                    <li>Desired outcomes</li>
                    <li>Background info (no personal identifiers)</li>
                  </ul>
                </div>
              </div>

              {/* Agreement Section */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading || activeCaseCount >= 1} // Updated condition
                  />
                  <div>
                    <label htmlFor="agree" className="text-sm font-medium text-blue-700">Anonymous Posting Agreement</label>
                    <p className="text-xs text-blue-600 mt-1">
                      I confirm this post contains no sensitive personal information that could identify me or others involved.
                    </p>
                    <ul className="mt-3 space-y-2 text-xs text-blue-600">
                      <li className="flex items-center gap-2">
                        <Shield className="w-4 h-4 flex-shrink-0" />
                        Anonymous until you choose an attorney
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        Visible to attorneys for 14 days
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        Full control over attorney selection
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full p-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-md ${
                    loading || !agreed || activeCaseCount >= 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading || !agreed || activeCaseCount >= 1} // Updated condition
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Submitting..." : activeCaseCount >= 1 ? "Active Case Limit Reached" : "Post Case Anonymously"}
                </button>
                <p className="mt-3 text-center text-xs text-gray-500">
                  By posting, you agree to our{" "}
                  <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and{" "}
                  <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>
                </p>
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default PostCaseForm;