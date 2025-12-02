import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

type DeleteMatchProps = {
  creator: string;
};

export const DeleteMatch = (props: DeleteMatchProps) => {
  const { creator } = props;
  const { matchId } = useParams();
  const { accessToken, user } = useAuth();
  if (!user) return null;
  const { id: userId } = user;
  const navigate = useNavigate();

  const [err, setErr] = useState<string | null>(null);




  const handleClick = async () => {
    if (creator !== userId) {
      setErr("You are not the owner");
      return;
    }

    try {
      const result = await fetch(
        `http://localhost:3000/matches/${matchId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!result.ok) {
        setErr("Server rejected the request");
      }
      const data = await result.json();
      navigate("/matches", { state: { success: "Match successfully deleted" } });
    } catch (err) {
      setErr("network error, unable to connect the server");
    }
  };

  return (
    <>
      {err && <p className="text-white bg-green-500">{err}</p>}

      <button
        className="bg-red-500 text-white hover:bg-red-700"
        onClick={handleClick}
      >
        Delete Match
      </button>
    </>
  );
};
