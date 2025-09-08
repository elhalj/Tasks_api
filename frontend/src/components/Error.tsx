

const Errors = ({error}: {error: string}) => {
  return (
    <>
     <p className="bg-red-500 text-white text-sm p-3 rounded-lg shadow">
      {error}
    </p> 
    </>
  )
}

export default Errors
