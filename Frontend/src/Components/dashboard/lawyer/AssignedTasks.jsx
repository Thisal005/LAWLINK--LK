import React from "react";
import useFetchAssignedTasks from "../../../hooks/useFetchAssignedTask";
import LawyerTaskCard from "./LawyerTaskCard";

const AssignedTasks = ({ caseId }) => {
  const { tasks, loading: fetchLoading, fetchAssignedTasks } = useFetchAssignedTasks( caseId);

  return (
    <div
      className="p-6 bg-white rounded-lg h-[400px] border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg cursor-pointer"
      aria-labelledby="notes-header"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(147,51,234,0.3)]"></span>
        </div>
        <h2 id="notes-header" className="text-xl font-semibold text-gray-800">
          ASSIGNED TASKS FOR THIS CASE
        </h2>
      </div>

      <div className="h-[5px] bg-blue-500 w-120 rounded-full my-4 transition-all duration-300 hover:w-113 hover:blue-300"></div>

      {fetchLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-100 rounded-xl p-4"
              role="status"
              aria-label="Loading task"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <div
          className="space-y-4 h-[250px] overflow-y-auto pr-2 scrollbar-hide hover:scrollbar-default"
          aria-label="Task list"
        >
          {tasks.map((task) => (
            <LawyerTaskCard key={task._id} task={task} />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-8 bg-gray-50 rounded-xl h-[250px] flex flex-col items-center justify-center"
          role="alert"
          aria-live="polite"
        >
          <p className="text-gray-600 text-sm">
            No tasks assigned for this case.
            <span className="block mt-2 text-xs text-gray-500">
              Tasks will appear here once assigned.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignedTasks;