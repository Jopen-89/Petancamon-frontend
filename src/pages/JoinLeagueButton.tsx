import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

type JoinLeagueButtonProps = {
  leagueId: string;
  onJoined?: () => void;
};

export const JoinLeagueButton = ({ leagueId, onJoined }: JoinLeagueButtonProps) => {
  const { accessToken } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const handleclick = async () => {
    console.log("a ver", leagueId);
    setIsLoading(true);
    try {
      const result = await fetch(
        `http://localhost:3000/league/${leagueId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await result.json();
      if (!result.ok) {
        setErr(data.message ?? "error joining the league");
        return 
      }
      onJoined?.()
      console.log("a ver message:", data.message);
    } catch (err) {
      setErr("network error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!err) return
    const timer = setTimeout(() => {
    setErr(null)
  }, 3000)

  return () => clearTimeout(timer);
}, [err])


  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {err && <p className="text-red-600">{err}</p>}
      <button
        onClick={handleclick}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? "Joining..." : "Join"}
      </button>
    </>
  );
};
