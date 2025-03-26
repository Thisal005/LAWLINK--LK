// components/TodoList.jsx
import React, { useState } from "react";
import useFetchTodos from "../hooks/useFetchTodos"; // We'll create this hook
import useCreateTodo from "../hooks/useCreateToDo"; // We'll create this hook
import TodoItem from "./dashboard/lawyer/ToDoItem";

const TodoList = () => {
  const [taskName, setTaskName] = useState("");
  const { todos, loading, fetchTodos } = useFetchTodos();
  const { loading: createLoading, createTodo } = useCreateTodo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const todo = await createTodo(taskName);
    if (todo) {
      setTaskName(""); // Clear input
      fetchTodos(); // Refresh the list
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg h-[670px] border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg cursor-pointer">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]"></span>
        </div>
        <h2 id="tasks-header" className="text-2xl font-semibold text-gray-800">
          TO-DO-LIST
        </h2>
      </div>
  
      <div className="h-[5px] bg-purple-500 w-117 rounded-full my-5 transition-all duration-300 hover:bg-purple-300 mb-10"></div>
  
      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Add a new task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          maxLength={100}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={createLoading}
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {createLoading ? "Adding..." : "Add Task"}
        </button>
      </form>
  
      {/* Task List */}
      <div
          className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide hover:scrollbar-default "
          aria-label="Task list"
        >
        {loading ? (
          <p className="text-gray-600">Loading to-do items...</p>
        ) : todos.length > 0 ? (
          todos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} onUpdate={fetchTodos} />
          ))
        ) : (
          <p className="text-gray-600">No to-do items found.</p>
        )}
      </div>
    </div>
  );
};

export default TodoList;