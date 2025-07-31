import React, { useContext } from 'react'
import Tasks from '../ui/Tasks'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Dashboard = () => {
  const {user, logout} = useContext(AuthContext)
  return (
    <div>
      <button type='button' onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>

      <p className="text-center my-4">
        <Link to="/dashboard/add/task" className="text-blue-500 underline">Ajouter une tache</Link>
      </p>
            <p className="text-center text-red-500 text-lg font-bold">{user && user.userName}</p>
      <Tasks/>
    </div>
  )
}

export default Dashboard
