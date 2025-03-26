import React from "react";

const NoteCard = ({ note }) => {
  return (
    <div
      className="bg-white text-gray-900 rounded-xl shadow-lg p-6 mb-4 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl group"
      role="article"
      aria-labelledby={`note-content-${note._id}`}
    >
      {/* Dynamic background gradient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full filter blur-2xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full filter blur-2xl opacity-50 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Note Content */}
        <p
          id={`note-content-${note._id}`}
          className="text-gray-800 group-hover:text-blue-700 transition-colors duration-200"
        >
          {note.content}
        </p>

        {/* Metadata */}
        <div className="mt-4 text-sm text-gray-600">
          <p>
            From:{" "}
            <span className="font-semibold text-gray-900">
              {note.lawyerId.fullName}
            </span>{" "}
            |{" "}
            <span className="text-gray-500">
              {new Date(note.createdAt).toLocaleString()}
            </span>
          </p>
          {note.caseId && (
            <p className="mt-1">
              Case:{" "}
              <span className="font-semibold text-gray-900">
                {note.caseId.caseName}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;