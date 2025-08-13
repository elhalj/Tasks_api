import { Link } from "react-router-dom"


const CreateRoom = () => {
  return (
      <div>
          <Link to="/dashboard">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Retour au dashboard
            </button>
          </Link>
          
      <h1 className="text-5xl font-bold mt-4 mb-12">Creer une salle</h1>
    </div>
  )
}

export default CreateRoom
