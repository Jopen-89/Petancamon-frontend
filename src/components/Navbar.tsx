import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

export const Navbar = () => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <nav className="flex gap-6 text-white">
      <Link to="/">Home</Link>
      <Link to="/signup">Signup</Link>

      {accessToken && (
        <>
          <Link to="/matches">Matches</Link>
          <Link to="/matches/new"></Link>
        </>
      )}

      {!accessToken ? (
        <Link to="/login">Login</Link>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
};
