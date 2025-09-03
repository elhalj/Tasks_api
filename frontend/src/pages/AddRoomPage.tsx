import CreateRoom from "../ui/room/CreateRoom";

const AddRoomPage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-3xl">
        <CreateRoom />
      </div>
    </div>
  );
};

export default AddRoomPage;
