import React from 'react'
import CreateTask from '../ui/CreateTask'
import { Link } from 'react-router-dom'

const AddTask = () => {
  return (
      <div className="bg-gray-100 w-[600px] h-[600px] flex flex-col items-center justify-center">
          <Link to="/dashboard" className="text-start mb-4 bg-gray-400 text-white p-1 rounded-md underline">
            Retour au dashboard
          </Link>
      <CreateTask/>
    </div>
  )
}

export default AddTask
