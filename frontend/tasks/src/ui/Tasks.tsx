import React, { useContext } from 'react'
import { AuthContext, TaskContext } from '../context'

const Tasks = () => {
    const { tasks } = useContext(TaskContext)
    const { user } = useContext(AuthContext)

    if (user && tasks.length === 0) {
        return <div className="text-center text-lg">Vous n'avez pas de taches</div>
    }

    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg w-96 h-96 mx-auto mt-4">
            {tasks.length > 0 ? tasks.map(task => (
                <div key={task._id} className="p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out">
                    <p className="font-bold">{task.title}</p>
                    <p className="text-sm">{task.description}</p>
                    <p className={(task.completed === false) ? "text-red-500" : "text-green-500"}>{task.completed ? 'Completé' : 'Non completé'}</p>
                </div>
            )) : <p className="text-center text-lg">Vous n'avez pas de taches</p>}
        </div>
    )
}

export default Tasks
