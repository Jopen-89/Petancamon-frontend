import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type JoinMatchButtonProps = {
  matchId: string;
  level: string;
  status: string;
  isFull: boolean;
  alreadyJoined: boolean;
};

export const JoinMatchButton = (props: JoinMatchButtonProps) => {
  const { matchId, status, isFull, alreadyJoined } = props;
  const { user } = useAuth()
  const userLevel = user?.level
  const navigate = useNavigate();

  const { accessToken } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (alreadyJoined) {
    return <button disabled>you already joined</button>;
  }

  
  if (isFull) {
    return <button disabled>Match is full</button>;
  }

  if (status !== "scheduled") {
    return <button disabled>Match closed</button>;
  }

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const result = await fetch(
        `http://localhost:3000/matches/${matchId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!result.ok) {
        setErr("the server rejected the request"); //servidor responde pero con error
        return;
      }
      const data = await result.json();
      navigate(`/matches/${matchId}/room`, {state: {success: "You joined the match"}});
    } catch (err) {
      setErr("Network error, could not connect to the server");
    }

    setIsLoading(false);
  };

  return (
    <>
      <button disabled={isLoading} onClick={() => handleClick()}>
        {isLoading ? "Joining" : "Join Match"}

        {err && <p>{err}</p>}
      </button>
    </>
  );
};
