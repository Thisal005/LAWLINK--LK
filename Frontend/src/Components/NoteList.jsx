import React from "react";
import useFetchNotes from "../hooks/useFetchNotes"; 
import NoteCard from "./dashboard/client/LawyerNotes";

const NoteList = () => {
  const { notes, loading } = useFetchNotes();

  return (
    <div
      className="p-6 bg-white rounded-lg h-[550px] border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg cursor-pointer"
      aria-labelledby="notes-header"
    >
      {/* Header with Purple Dot Indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(147,51,234,0.3)]"></span>
        </div>
        <h2
          id="notes-header"
          className="text-xl font-semibold text-gray-800"
        >
          LAWYER NOTES
        </h2>
      </div>

      <div className="h-[5px] bg-purple-500 max-w-[500px] rounded-full my-4 transition-all duration-300 hover: hover:bg-purple-300"></div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-100 rounded-xl p-4"
              role="status"
              aria-label="Loading note"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : notes.length > 0 ? (
        <div
          className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide hover:scrollbar-default"
          aria-label="Notes list"
        >
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-8 bg-gray-50 rounded-xl"
          role="alert"
          aria-live="polite"
        >
          <p className="text-gray-600 text-sm">
            No notes found.
            <span className="block mt-2 text-xs text-gray-500">
              Notes will appear here once added.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default NoteList;