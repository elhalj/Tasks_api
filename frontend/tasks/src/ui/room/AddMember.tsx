import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context";
import type { User } from "../../types/user";
import { useRoom } from "../../hook/useRoom";
import Loader from "../../components/Loader";

const AddMember = ({ roomId }: { roomId: string }) => {
  const { user, getAllUser } = useContext(AuthContext);
  const { addMember } = useRoom();
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (user.length === 0) {
        try {
          setLoading(true);
          await getAllUser();
          if (Array.isArray(user)) {
            setUsers(user);
          }
        } catch (error) {
          setErrors("Error to fetch user");
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadUser();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Add Member</h3>
      {errors && <div className="text-red-500 mb-2">{errors}</div>}
      <ul className="space-y-2">
        {users && users.length > 0 ? (
          users.map((u) => (
            <li key={u._id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <p className="font-medium">{u.userName}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <button
                type="button"
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
                onClick={() => u._id && addMember(roomId, u._id)}
              >
                Add
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No users available to add</li>
        )}
      </ul>
    </div>
  );
};

export default AddMember;
