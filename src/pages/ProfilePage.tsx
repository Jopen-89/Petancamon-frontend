import { useAuth } from "../context/AuthContext";

export const ProfilePage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  console.log("a ver user:", user);

  return (
    <>
      <div className="flex flex-col text-white">
        <h2>My Profile</h2>
        <hr />
        <p>Username: {user?.username}</p>
        <p>Level: {user?.level}</p>
      </div>
    </>
  );
};
