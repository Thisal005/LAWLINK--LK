import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Upload } from 'lucide-react';
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
    address: "",
    dateOfBirth: "",
    profilePicture: null,
  });
  const [tempProfilePicture, setTempProfilePicture] = useState(null);

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

  useEffect(() => {
    if (!userData?._id) {
      toast.error("Please log in to edit your settings.");
      navigate("/client-login");
    } else {
      setFormData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        contact: userData.contact || "",
        province: userData.province || "",
        address: userData.address || "",
        dateOfBirth: userData.dateOfBirth || "",
        profilePicture: null,
      });
      setTempProfilePicture(userData.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
      setLoading(false);
    }
  }, [userData, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files[0]) {
      setFormData((prev) => ({ ...prev, profilePicture: files[0] }));
      const reader = new FileReader();
      reader.onload = (e) => setTempProfilePicture(e.target.result);
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("province", formData.province);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("dateOfBirth", formData.dateOfBirth);
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
        navigate("/client-dashboard");
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
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-center gap-6 border-b border-gray-200 pb-6">
                <div className="relative">
                  <img
                    src={tempProfilePicture}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-100 shadow-sm"
                  />
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <Upload className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
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
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer text-sm font-semibold shadow-md"
                  >
                    <Upload className="w-4 h-4 text-white" />
                    <span className="text-white">Upload New Photo</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Province</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Enter your address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-300 text-sm font-semibold shadow-md"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/client-dashboard")}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 text-sm font-semibold"
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