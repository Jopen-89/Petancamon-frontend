import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.success;

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      navigate(".", { state: {} });
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, navigate]);

  return (
    <>
      <div>
        {successMessage && (
          <p className="text-green-600 font-semibold">{successMessage}</p>
        )}
      </div>
      <h2 className="flex justify-center">Bienvenido a Petancamon</h2>
      <Link to={"/profile"}>Go to Profile</Link>
    </>
  );
};
