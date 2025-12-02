import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

type MatchRoomGuard = {
  children: ReactNode;
};

type Player = {
  id: string;
};

type Match = {
  players: string[];
};

export const MatchRoomGuard = ({ children }: MatchRoomGuard) => {
  const { matchId } = useParams();
  const { user, accessToken } = useAuth();

  const [match, setMatch] = useState<Match | null>(null);

  if (!user) {
    return <Navigate to={`/matches/${matchId}`} />;
  }

  const { id: userId } = user;
  console.log("a ver userId:", userId);

  const loadMatch = async () => {
    try {
      const result = await fetch(`http://localhost:3000/matches/${matchId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await result.json();
      setMatch(data.match);
      console.log(data.match);
    } catch (err) {
      console.log("network error");
    }
  };

  useEffect(() => {
    loadMatch();
  }, []);

  if (!match) {
    return <p>Loading match...</p>
  }

  console.log("a ver match.players", match?.players);
  if (!match?.players.some((p) => p === userId)) {
    return (
      <>
        <Navigate
          to={`/matches/${matchId}`}
          state={{ error: "You are not in the match" }}
          replace
        />
      </>
    );
  }
  return children;
};
