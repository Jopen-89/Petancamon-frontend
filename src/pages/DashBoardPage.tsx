import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type Match = {
  id: string;
  date: string;
  creator: string;
  level: string;
  location: {
    courtName: string;
  };
  maxPlayers: number;
  status: string;
  players: string[];
};

export const DashBoardPage = () => {
  const navigate = useNavigate();

  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const { accessToken, user } = useAuth();

  const userId = user?.id;

  useEffect(() => {
    if (!user) return;
    const loadMatches = async () => {
      try {
        setIsLoading(true);
        const result = await fetch("http://localhost:3000/matches", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!result.ok) {
          setErr("Error fetching matches");
        }
        const data = await result.json();
        console.log(data.matches);
        setMatches(data.matches);
        setIsLoading(false);
      } catch (err) {
        setErr("network error");
      }
    };
    loadMatches();
  }, [userId]);

  if (isLoading) return <p>Loading...</p>;

  if (err) return <p>{err}</p>;

  if (!userId) return <Navigate to="login" replace />;

  //partidos en los que solo aparece el jugador
  const userMatches = matches.filter((p) => {
    
   return (p.players.includes(userId) && p.status === "scheduled")});

  const userPlayedMatches = userMatches.filter((p) => p.status === "validated");

  return (
    <>
      <h2>Dashboard</h2>

      <button
        className="bg-blue-500 hover: border-x-slate-800 py-2 px-2"
        onClick={() => navigate("/matches/create")}
      >
        Create Match
      </button>

      <p>Matches list</p>
      <table className="w[400px] full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Creator:</th>
            <th className="px-4 py-2 text-left">Level</th>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        {matches.slice(0, 5).map((m) => (
          <tbody>
            <tr key={m.id}>
              <td className="px-4 py-2">{m.date}</td>
              <td className="px-4 py-2">{m.creator}</td>
              <td className="px-4 py-2">{m.level}</td>
              <td className="px-4 py-2">{m.location?.courtName}</td>
              <td className="px-4 py-2">{m.status}</td>
            </tr>
          </tbody>
        ))}
      </table>

      <p>Next matches</p>
      <table className="w[400px] full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Creator:</th>
            <th className="px-4 py-2 text-left">Level</th>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>

        {userMatches.map((m) => (
          <tr key={m.id}>
            <td className="px-4 py-2">{m.date}</td>
            <td className="px-4 py-2">{m.creator}</td>
            <td className="px-4 py-2">{m.level}</td>
            <td className="px-4 py-2">{m.location?.courtName}</td>
            <td className="px-4 py-2">{m.status}</td>
          </tr>
        ))}
      </table>

      <p>Played matches</p>
      <table className="w[400px] full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Creator:</th>
            <th className="px-4 py-2 text-left">Level</th>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        {userPlayedMatches.map((m) => (
          <tr key={m.id}>
            <td className="px-4 py-2">{m.date}</td>
            <td className="px-4 py-2">{m.creator}</td>
            <td className="px-4 py-2">{m.level}</td>
            <td className="px-4 py-2">{m.location?.courtName}</td>
            <td className="px-4 py-2">{m.status}</td>
          </tr>
        ))}
      </table>
    </>
  );
};
