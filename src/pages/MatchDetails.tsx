import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { JoinMatchButton } from "../components/JoinMatchButton";
import { MatchesPage } from "./MatchesPage";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DeleteMatch } from "../components/DeleteMatch";


type MatchParams = {
  matchId: string;
};

type Match = {
  id: string;
  creator: string;
  level: string;
  location: string | null;
  maxPlayers: number;
  status: string;
  players: string[];
};

export const MatchDetails = () => {
  const { user, accessToken, isLoading: isAuthLoading } = useAuth();
  const { matchId } = useParams<MatchParams>();
  const location = useLocation();
  const navigate = useNavigate();
  const errorMessage = location.state?.error;

  const [match, setMatch] = useState<Match | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => {
      //timer es el identificador para que luego puedas cancelarlo con cleartimeout
      navigate(".", { state: {} });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const loadMatch = async () => {
    if (!matchId || !accessToken) return;
    try {
      setIsLoading(true);
      setErr(null);

      const result = await fetch(`http://localhost:3000/matches/${matchId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) {
        setErr("Error loaging data");
        return;
      }
      const data = await result.json();

      setMatch(data.match);
    } catch (err) {
      setErr("Error loading data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!matchId) {
      setErr("No match id provided");
      setIsLoading(false);
      return;
    }

    if (isAuthLoading) {
      return;
    }

    if (!accessToken) {
      setIsLoading(false);
      setErr("No access token available");
      return;
    }
    loadMatch();
  }, [matchId, accessToken, isAuthLoading]);

  if (isAuthLoading) return <p>Loading auth...</p>;

  if (isLoading) return <p>Loading match...</p>;

  if (err) return <p>{err}</p>;

  if (!match) return <p>No match data</p>;


  const isFull = match.players.length >= match.maxPlayers;
  const alreadyJoined = match.players.some((p) => p === user?.id);

  return (
    <>
      {errorMessage && <p className="bg-green-500 text-red">{errorMessage}</p>}

      <h2>Match Details - matchId: {matchId}</h2>
      <div className="flex gap-2 ">
        <JoinMatchButton
          matchId={match.id}
          level={match.level}
          status={match.status}
          isFull={isFull}
          alreadyJoined={alreadyJoined}
        />
        <Link to={`/matches/${match?.id}/update`}>Update Match</Link>
        
        <DeleteMatch creator={match.creator} />

        <Link to={`/matches/${match?.id}/room`}>Match Room</Link>
      </div>

      <p>MatchId: {match?.id}</p>
      <p>Creator: {match?.creator}</p>
      <p>Level: {match?.level}</p>
      
      <p>MaxPlayers:{match?.maxPlayers}</p>
      <p>Status: {match?.status}</p>
    </>
  );
};
