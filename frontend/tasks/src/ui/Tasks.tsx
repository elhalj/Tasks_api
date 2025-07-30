import React, { useContext, useEffect } from 'react'
import { AuthContext, TaskContext } from '../context'
import { Link } from 'react-router-dom'

const Tasks = () => {
    const { tasks, getTasks, deleteTask } = useContext(TaskContext)
    const { user } = useContext(AuthContext)

    // Load tasks on component mount
    useEffect(() => {
        getTasks();
    }, [getTasks]);

    if (user && tasks.length === 0) {
        return <div className="text-center text-lg">Vous n'avez pas de taches</div>
    }

    

    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg w-96 h-96 mx-auto mt-4 overflow-y-scroll">
            {tasks.length > 0 ? tasks.map(task => (
                <div key={task._id} className="p-2 w-80 h-80 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out m-2">
                    <p className={`font-bold ${(task.completed === true) ? "line-through" : ""}`}>{task.title}</p>
                    <p className={`text-sm ${(task.completed === true) ? "line-through" : ""}`}>{task.description}</p>
                    <p className={(task.completed === false) ? "text-red-500" : "text-green-500"}>{task.completed ? 'Completé' : 'Non completé'}</p>
                    {task._id && (
                        <div className='flex gap-2'>
                            <Link to={`/dashboard/tasks/${task._id}/edit`}><p className="text-white p-2 bg-blue-400 rounded-md">Modifier</p></Link>
                            <button type='button' className='bg-red-400 text-white p-2 rounded-md' onClick={async () => {
                                if (task._id) {
                                   await  deleteTask(task._id)
                                }
                            }}>Supprimer</button>
                        </div>
                    )}
                </div>
            )) : <p className="text-center text-lg">Vous n'avez pas de taches</p>}
        </div>
    )
}

export default Tasks
