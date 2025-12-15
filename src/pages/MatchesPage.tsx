import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { JoinMatchButton } from "../components/JoinMatchButton";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type Match = {
  id: string;
  creator: string;
  level: string;
  location: any;
  maxPlayers: number;
  status: string;
};

export const MatchesPage = () => {
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [err, setErr] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  const deleteMessage = location.state?.success;

  useEffect(() => {
    if (!deleteMessage) {
      return;
    }
    const timer = setTimeout(() => {
      navigate(".", { state: "" });
    }, 3000);
  });

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!accessToken) {
      // Opcional: aquí podrías redirigir a /login
      setErr("No hay token, no cargo matches");
      setIsLoading(false);
      return;
    }

    const loadMatches = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:3000/matches", {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error loading matches");
        }

        const data = await res.json();

        setMatches(data.matches);
        setErr(null);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadMatches();
  }, [accessToken, isAuthLoading]);

  if (isAuthLoading) return <p>Loading auth...</p>;

  if (isLoading) return <p>Loading matches...</p>;

  if (err) return <p>{err}</p>;

  const MatchesAvailable = matches.length === 0;

  return (
    <>
      <header>
        <h2 className="bg-green-500 text-black">Matches List</h2>
        <Link
          to="/matches/new"
          className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-400"
        >
          + Create Match
        </Link>
      </header>

      {deleteMessage && (
        <p className="bg-yellow-500 text-black">{deleteMessage}</p>
      )}

      <div className="space-y-2">
        {matches.length === 0 ? (
          <p className="text-white">No matches available</p>
        ) : (
          matches.map((m) => (
            <div className="bg-white text-black" key={m.id}>
              <Link to={`/matches/${m.id}`}>
                <ul>Match (details)</ul>
                <li>Creator: {m.creator}</li>
                <li>Level: {m.level}</li>
                <li>Location: {m.location?.courtName}</li>
                <li>Status: {m.status}</li>
                <li>maxPlayers: {m.maxPlayers}</li>
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
};
