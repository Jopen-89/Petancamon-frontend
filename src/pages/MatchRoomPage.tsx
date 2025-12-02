import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LeaveMatch } from "../components/LeaveMatch";
import { DeletePlayer } from "../components/DeletePlayer";
import { Link } from "react-router-dom";

type Match = {
  id: string;
  creator: string;
  level: string;
  location: string | null;
  maxPlayers: number;
  status: string;
  players: string[];
};



export const MatchRoomPage = () => {
  const { matchId } = useParams();
  const { accessToken, isLoading: isAuthLoading, user } = useAuth();
  if (!user) return <p>no existe user</p>;

  const { id: userId } = user;
  const location = useLocation();
  const successMessage = location.state?.success;

  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  

  const loadMatch = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetch(
        `http://localhost:3000/matches/${matchId}/room`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!result.ok) {
        console.log("Server rejected the request");
      }
      const data = await result.json();
      console.log("a ver si sale location:", data.match);
      setMatch(data.match);
    } catch (err) {
      console.log("network error, unable connect to the server");
    } finally {
      setIsLoading(false);
    }
  }, [matchId, accessToken]);

  useEffect(() => {
    loadMatch();
    console.log("a ver match.creator:", match?.creator)
  }, [loadMatch]);

  if (isAuthLoading) return <p>Loading Auth....</p>;

  if (isLoading) return <p>Loading...</p>;

  if (err) return <p>{err}</p>;

  if (!match) return <p>Match not found</p>;

  if (!matchId) {
    return <p>No match id</p>;
  }


  return (
    <>
      <h2>
        {successMessage && (
          <p className="bg-green-500 text-white">{successMessage}</p>
        )}
      </h2>
      <h2>Match room</h2>
      <div className="flex flex-col items-start">
        <LeaveMatch matchId={matchId} />
        <DeletePlayer
          matchId={matchId}
          userId={userId}
          players={match.players}
          onPlayerDeleted={loadMatch}
        />
      </div>
       <Link to={`/matches/${matchId}/room/confirmation`}>Player Confirmation</Link>

      {
        <div className="text-black bg-white">
          <p>{match?.id}</p>
          <p>{match?.creator}</p>
          <p>{match?.level}</p>
          <p>{match?.location}</p>
          <p>{match?.players}</p>
          <p>{match?.maxPlayers}</p>
          <p>{match?.status}</p>
        </div>
      }
    </>
  );
};
