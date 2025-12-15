import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { JoinLeagueButton } from "./JoinLeagueButton";
import { useNavigate } from "react-router-dom";

type League = {
  _id: string;
  leagueName: string;
  creator: string;
  maxPlayers: number;
  leaguePlayers: string[];
};

/* Uso useCallback por que loadLeague depende de accesstoken y puede que al principio venga undefined, y daria bug, mejor poner que dependa
de accesstoken para que se recargue la funcion si cambia y ya luego el useEffect dependa de loadLeagues, que tambien es activado al utilizar Join.*/

export const LeaguePage = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const loadLeagues = useCallback(async () => {
    setIsLoading(true);
    setErr(null);
    try {
      const result = await fetch("http://localhost:3000/leagues", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await result.json();
      if (!result.ok) {
        setErr(data.message ?? "Error fetching the leagues");
        return;
      }
      setLeagues(data.leagues);

      console.log("a ver data.league", data.leagues);
    } catch (err) {
      setErr("network error");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadLeagues();
  }, [loadLeagues]);

  return (
    <>
      <h2 className="py-2">2vs2 Leagues</h2>
      <p>Create or join leagues. Play. Compete. Rise.</p>
      <Link className="bg-green-600 py-1" to={"/league"}>
        Create new league
      </Link>
      <p className="font-bold">League List</p>
      <table>
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">Name</th>
            <th className="px-4 py-2 text-center">Creator</th>
            <th className="px-4 py-2 text-center">maxPlayers</th>
            <th className="px-4 py-2 text-center">Nº Players</th>
            <th className="px-4 py-2 text-center">Join League</th>
            <th className="px-4 py-2 text-center">Watch details</th>
          </tr>
        </thead>
        <tbody>
          {leagues?.map((m, i) => (
            <tr key={i}>
              <td className="px-4 py-2 text-center">{m.leagueName}</td>
              <td className="px-4 py-2 text-center">{m.creator}</td>
              <td className="px-4 py-2 text-center">{m.maxPlayers}</td>
              <td className="px-4 py-2 text-center">
                {m.leaguePlayers.length}
              </td>
              <td>
                <JoinLeagueButton leagueId={m._id} onJoined={loadLeagues} />
              </td>
              <td className="px-4 py-2 text-center">
                <Link to={`/league/${m._id}`}>Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
