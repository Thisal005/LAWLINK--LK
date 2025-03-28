// frontend/src/ClientAccountSettings.jsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Upload, X } from 'lucide-react';
import ClientSidebar from "../../Components/dashboard/client/ClientSideBar";
import Header from "../../Components/dashboard/client/ClientHeader";

const ClientAccountSettings = () => {
  const { backendUrl, userData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    province: "",
    profilePicture: null,
    receiveNotifications: false,
    receiveEmailNotifications: false,
  });
  const [tempProfilePicture, setTempProfilePicture] = useState(null);

  // Sri Lanka's 9 provinces
  const provinces = [
    "Central",
    "Eastern",
    "North Central",
    "Northern",
    "North Western",
    "Sabaragamuwa",
    "Southern",
    "Uva",
    "Western",
  ];

  // Initialize form data from userData
  useEffect(() => {
    if (!userData?._id) {
      toast.error("Please log in to edit your settings.");
      navigate("/client-login"); // Adjust route as needed
    } else {
      setFormData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        contact: userData.contact || "",
        province: userData.province || "",
        profilePicture: null,
        receiveNotifications: userData.receiveNotifications || false,
        receiveEmailNotifications: userData.receiveEmailNotifications || false,
      });
      setTempProfilePicture(userData.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
      setLoading(false);
    }
  }, [userData, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "profilePicture" && files[0]) {
      setFormData((prev) => ({ ...prev, profilePicture: files[0] }));
      const reader = new FileReader();
      reader.onload = (e) => setTempProfilePicture(e.target.result);
      reader.readAsDataURL(files[0]);
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      toast.info(`${name === "receiveNotifications" ? "Notification" : "Email notification"} preference updated.`, {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Remove profile picture
  const handleRemovePhoto = () => {
    setTempProfilePicture("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
    setFormData((prev) => ({ ...prev, profilePicture: null }));
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("province", formData.province);
    formDataToSend.append("receiveNotifications", formData.receiveNotifications);
    formDataToSend.append("receiveEmailNotifications", formData.receiveEmailNotifications);
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }

    try {
      const response = await axios.put(`${backendUrl}/api/user/update`, formDataToSend, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setUserData(response.data.userData);
        toast.success("Profile updated successfully!");
        navigate("/client-dashboard"); // Adjust route as needed
      } else {
        toast.error(response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    );
  }

  const displayName = userData?.fullName || "Client";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ClientSidebar />
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        <Header displayName={displayName} practiceAreas="Client" />
        <div className="flex-1 p-6 mt-16 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Settings</h2>
            <p className="text-sm text-gray-600 mb-6">
              For your security, certain details are locked. Contact support to modify them.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <img 
                  src={tempProfilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-200"
                />
                <div className="space-y-2">
                  <input
                    type="file"
                    id="profile-picture-upload"
                    name="profilePicture"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="profile-picture-upload"
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </label>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input 
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notification Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="receiveNotifications"
                    checked={formData.receiveNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Receive Notifications
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="receiveEmailNotifications"
                    checked={formData.receiveEmailNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Receive Notifications via Email
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/client-dashboard")}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAccountSettings;