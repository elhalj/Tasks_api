import React from "react";
import CreateTask from "../ui/CreateTask";
import { Link } from "react-router-dom";

const AddTask = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg p-8 shadow-md w-96">
        <Link
          to="/dashboard"
          className="text-start mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Retour au dashboard
        </Link>
        <CreateTask />
      </div>
    </div>
  );
};

export default AddTask;
