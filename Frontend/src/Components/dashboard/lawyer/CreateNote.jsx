import React, { useState } from "react";
import useCreateNote from "../../../hooks/useCreateNote"; 

const NoteForm = ({ clientId, caseId }) => {
  const [content, setContent] = useState("");
  const { loading, createNote } = useCreateNote();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const note = await createNote(content, clientId, caseId);
    if (note) {
      setContent(""); 
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg h-[300px] border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg cursor-pointer">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]"></span>
        </div>
        <h2 id="tasks-header" className="text-2xl font-semibold text-gray-800">
          WRITE A NOTE
        </h2>
      </div>
  
      <div className="h-[5px] bg-red-500 w-117 rounded-full my-5 transition-all duration-300 hover:bg-red-300 mb-10"></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Write your note here (max 500 characters)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {loading ? "Submitting..." : "Submit Note"}
        </button>
      </form>
    </div>
  );
};

export default NoteForm;