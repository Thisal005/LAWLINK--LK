import React, { useCallback } from "react";
import useFetchTasks from "../hooks/useFetchTask";
import TaskCard from "../Components/dashboard/client/Tasks";

const TaskList = ({ caseId }) => {
  const { tasks, loading, fetchTasks } = useFetchTasks(caseId);

  const handleTaskUpdate = useCallback(() => {
    fetchTasks(); 
  }, [fetchTasks]);

  return (
    <div
    className="p-6 bg-white rounded-lg h-[550px] border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg cursor-pointer"      aria-labelledby="tasks-header"
    >
      <div className="flex items-center gap-3 mb-6 ">
        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]"></span>
        </div>
        <h2
          id="tasks-header"
          className="text-2xl font-semibold text-gray-800"
        >
        TASKS FOR THIS CASE
        </h2>
      </div>

      <div className="h-[5px] bg-green-500 w-113 rounded-full my-5 transition-all duration-300 hover:bg-green-300 mb-10"></div>

      {loading ? (
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
          className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide hover:scrollbar-default"
          aria-label="Task list"
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={handleTaskUpdate}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-8 bg-gray-50 rounded-xl"
          role="alert"
          aria-live="polite"
        >
          <p className="text-gray-600 text-sm">
            No tasks found for this case.
            <span className="block mt-2 text-xs text-gray-500">
              Tasks will appear here once assigned.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;