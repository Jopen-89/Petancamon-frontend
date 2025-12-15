import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type League = {
  leagueName: string;
  creator: string;
  maxPlayers: number;
  leaguePlayers: string[];
  group1: string[];
  group2: string[];
  leagueMatches: string[];
};

export const LeagueDetailsPage = () => {
  const { leagueId } = useParams();
  const { accessToken } = useAuth();

  const [league, setLeague] = useState<League>({
    leagueName: "",
    creator: "",
    maxPlayers: 0,
    leaguePlayers: [],
    group1: [],
    group2: [],
    leagueMatches: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const loadMatchDetails = async () => {
    setIsLoading(true);
    setErr(null);
    try {
      const result = await fetch(`http://localhost:3000/league/${leagueId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await result.json();
      if (!result.ok) {
        setErr(data.message || "Error fetching data");
        return;
      }
      console.log("a ver data.leaguedetails", data.league);
      setLeague(data.league);
    } catch (err) {
      setErr("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMatchDetails();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (err) return <p>{err}</p>;

  return (
    <>
      <h2>League Details</h2>
      <table className="border-separate border-spacing-4 text-center">
        <thead>
          <tr>
            <th>LeagueName:</th>
            <th>Creator</th>
            <th>Nº Players</th>
            <th>Players group1</th>
            <th>Players group2</th>
            <th>Total de partidos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{league.leagueName}</td>
            <td>{league.creator}</td>
            <td>{league.maxPlayers}</td>
            <td>
              {league.group1.map((p, i) => (
                <p key={i} className="m-0">
                  {p}
                </p>
              ))}
            </td>
            <td>{league.group2.map((p, i) => (
                <p key={i} className="m-0">
                    {p}
                </p>
            ))}</td>
            <td>{league.leagueMatches.map((p, i) => (
                <p key={i} className="m-0">
                    {p}
                </p>
            ))}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
