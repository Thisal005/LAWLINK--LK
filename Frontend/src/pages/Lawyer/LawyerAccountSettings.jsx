// frontend/src/pages/Dashboard/Lawyer/Components/LawyerAccountSettings.jsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/dashboard/lawyer/LawyerSidebar";
import Header from "../../Components/dashboard/lawyer/LawyerHeader";
import axios from "axios";
import { Upload, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const ProfileSettings = ({ profilePicture, displayName, practiceAreas, onSave }) => {
  const navigate = useNavigate();
  const [tempProfilePicture, setTempProfilePicture] = useState(profilePicture);
  const [tempDisplayName, setTempDisplayName] = useState(displayName);
  const [tempPracticeAreas, setTempPracticeAreas] = useState(practiceAreas);
  const [qualificationPhotos, setQualificationPhotos] = useState([]);
  const [district, setDistrict] = useState(""); // New field
  const [caseType, setCaseType] = useState(""); // New field

  const districts = ["Colombo", "Gampaha", "Kandy", "Galle", "Jaffna"]; // Example list
  const caseTypes = ["Criminal Defense", "Civil Litigation", "Family Law", "Corporate Law", "Property Law"]; // Example list

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setTempProfilePicture(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setTempProfilePicture("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  };

  const handleQualificationPhotoUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
      setQualificationPhotos([...qualificationPhotos, ...newPhotos]);
    }
  };

  const handleRemoveQualificationPhoto = (index) => {
    setQualificationPhotos(qualificationPhotos.filter((_, i) => i !== index));
  };

  const handleSaveChanges = () => {
    if (!district || !caseType) {
      alert("Please select a district and case type.");
      return;
    }
    onSave({
      profilePicture: tempProfilePicture,
      displayName: tempDisplayName,
      practiceAreas: tempPracticeAreas,
      district,
      caseType,
    });
  };

  return (
    <div className="p-20 bg-gray-50 min-h-screen">
      {/* Application header */}
            <Header />
      
            {/* Sidebar with active tab set to "Dashboard" */}
            <Sidebar activeTab="Dashboard"/>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Account Settings</h1>
          <button
            onClick={() => navigate("/lawyer-dashboard")}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
        <hr className="border-gray-200" />

        <div className="flex items-center gap-6">
          <img
            src={tempProfilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-100"
          />
          <div className="space-y-2">
            <input
              type="file"
              id="profile-picture-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label
              htmlFor="profile-picture-upload"
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload new photo
            </label>
            <button
              onClick={handleRemovePhoto}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors block text-sm"
            >
              Remove photo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="How clients will see you"
              value={tempDisplayName}
              onChange={(e) => setTempDisplayName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Your legal name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
            <input
              type="tel"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="+94 XX XXX XXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Languages Known</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Languages you can communicate in"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Practice Courts</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter the courts you practice in"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={district !== ""} // Disable after selection
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Case Type</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              disabled={caseType !== ""} // Disable after selection
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleQualificationPhotoUpload}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <div className="mt-4 grid grid-cols-3 gap-4">
              {qualificationPhotos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Qualification ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveQualificationPhoto(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., Criminal Law, Corporate Law"
              value={tempPracticeAreas}
              onChange={(e) => setTempPracticeAreas(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Biography</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-32"
              placeholder="Tell clients about your experience and expertise..."
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;