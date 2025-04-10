import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/dashboard/lawyer/LawyerSidebar";
import Header from "../../Components/dashboard/lawyer/LawyerHeader";
import { Upload, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const ProfileSettings = ({ profilePicture, displayName, practiceAreas, onSave }) => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const defaultProfilePicture = "../../../assets/images/profilepic.jpg";

  const [tempProfilePicture, setTempProfilePicture] = useState(profilePicture || defaultProfilePicture);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [tempDisplayName, setTempDisplayName] = useState(displayName || "");
  const [tempPracticeAreas, setTempPracticeAreas] = useState(practiceAreas || "");
  const [qualificationPhotos, setQualificationPhotos] = useState([]);
  const [qualificationFiles, setQualificationFiles] = useState([]);
  const [district, setDistrict] = useState("");
  const [caseType, setCaseType] = useState("");
  const [professionalBio, setProfessionalBio] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Add state to prevent multiple clicks

  const districts = ["Colombo", "Gampaha", "Kandy", "Galle", "Jaffna"];
  const caseTypes = ["Criminal Defense", "Civil Litigation", "Family Law", "Corporate Law", "Property Law"];

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempProfilePicture(e.target.result);
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQualificationPhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newPhotos = files.map((file) => URL.createObjectURL(file));
      setQualificationPhotos([...qualificationPhotos, ...newPhotos]);
      setQualificationFiles([...qualificationFiles, ...files]);
    }
  };

  const handleRemoveQualificationPhoto = (index) => {
    setQualificationPhotos(qualificationPhotos.filter((_, i) => i !== index));
    setQualificationFiles(qualificationFiles.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    // Prevent multiple clicks
    if (isSaving) return;
    setIsSaving(true);

    // Simulate a successful save operation without calling the backend
    const mockResponse = {
      data: {
        success: true,
        message: "Profile updated successfully",
        UserData: {
          _id: "mock-lawyer-id",
          fullName: fullName || "Mock Full Name",
          email: email || "mock@example.com",
          contactNumber: contactNumber || "1234567890",
          displayName: tempDisplayName || "Mock Display Name",
          practiceAreas: tempPracticeAreas || "Mock Practice Areas",
          district: district || "mock-district",
          caseType: caseType || "mock-case-type",
          qualificationPhotos: qualificationPhotos || [],
          professionalBio: professionalBio || "Mock professional bio",
          profilePicture: tempProfilePicture || defaultProfilePicture,
          isVerified: true,
          publicKey: "mock-public-key",
          privateKey: "mock-private-key",
          lawyerID: "mock-lawyer-id",
          documentForVerification: "mock-document",
        },
      },
    };

    // Simulate a delay to mimic an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Use the mock response
    const response = mockResponse;

    // Display the success message and wait for it to be visible before navigating
    toast.success("Profile saved successfully!");
    navigate("/lawyer-dashboard")
    
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab="Dashboard" />

      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex-1 p-6 mt-16 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
              <button
                onClick={() => navigate("/lawyer-dashboard")}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>

            {/* Profile Picture Section */}
            <div className="flex items-center gap-6 border-b border-gray-200 pb-6 mb-6">
              <div className="relative">
                {imageLoading && (
                  <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Loading...</span>
                  </div>
                )}
                <img
                  src={tempProfilePicture}
                  alt="Profile"
                  className={`w-28 h-28 rounded-full object-cover ring-4 ring-blue-100 shadow-sm ${imageLoading ? "hidden" : "block"}`}
                  onLoad={handleImageLoad}
                  onError={() => {
                    setTempProfilePicture(defaultProfilePicture);
                    setImageLoading(false);
                  }}
                />
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <Upload className="w-5 h-5" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  id="profile-picture-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="profile-picture-upload"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer text-sm font-semibold shadow-md"
                >
                  <Upload className="w-4 h-4 text-white" />
                  <span className="text-white">Upload New Photo</span>
                </label>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="How clients will see you"
                  value={tempDisplayName}
                  onChange={(e) => setTempDisplayName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Your legal name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="+94 XX XXX XXXX"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  <option value="">Select a district</option>
                  {districts.map((d) => (
                    <option key={d} value={d.toLowerCase()}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Case Type</label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                >
                  <option value="">Select a case type</option>
                  {caseTypes.map((ct) => (
                    <option key={ct} value={ct.toLowerCase().replace(/\s+/g, "-")}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="e.g., Criminal Law, Corporate Law"
                  value={tempPracticeAreas}
                  onChange={(e) => setTempPracticeAreas(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Qualifications</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleQualificationPhotoUpload}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {qualificationPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Qualification ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        onClick={() => handleRemoveQualificationPhoto(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Biography</label>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 h-32 resize-none"
                  placeholder="Tell clients about your experience and expertise..."
                  value={professionalBio}
                  onChange={(e) => setProfessionalBio(e.target.value)}
                />
              </div>
            </div>

            {/* Buttons Section */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                onClick={() => navigate("/lawyer-dashboard")}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving} // Disable the button while saving
                className={`px-6 py-3 rounded-lg text-sm font-semibold shadow-md transition-all duration-300 ${
                  isSaving
                    ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;