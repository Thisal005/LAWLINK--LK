import React, { useState } from "react";
import useCreateTask from "../../../hooks/useCreateTask";
import useFetchAssignedTasks from "../../../hooks/useFetchAssignedTask";

const TaskForm = ({ caseId, clientId }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const { loading: createLoading, createTask } = useCreateTask();
  const { tasks, loading: fetchLoading, fetchAssignedTasks } =
    useFetchAssignedTasks(clientId, caseId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = await createTask(taskName, description, clientId, caseId);
    if (task) {
      setTaskName("");
      setDescription("");
      fetchAssignedTasks();
    }
  };

  return (
    <div
    className="p-6 bg-white rounded-lg h-[400px] border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg cursor-pointer"
    aria-labelledby="notes-header"
  >  <div className="absolute inset-0 opacity-20">
    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
  </div>

  <div className="relative z-10">
  <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(147,51,234,0.3)]"></span>
        </div>
        <h2 id="notes-header" className="text-xl font-semibold text-gray-800">
          ASSIGN A TASK
        </h2>
      </div>

      <div className="h-[5px] bg-green-500 w-113 rounded-full my-4 transition-all duration-300 hover:w-113 hover:green-300"></div>


    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 mt-6"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 resize-none"
        rows={2}
        required
      />
      <button
        type="submit"
        disabled={createLoading}
        className="w-full p-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-300 active:scale-95 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {createLoading ? "Assigning..." : "Assign Task"}
      </button>
    </form>

    
    
  </div>
</div>
  );
};

export default TaskForm;