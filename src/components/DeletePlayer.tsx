import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";

type DeletePlayerProps = {
  matchId: string;
  userId: string;
  players: string[];
  onPlayerDeleted: () => void;
};
//estoy probando cosas props y useAuth
export const DeletePlayer = (props: DeletePlayerProps) => {
  const { accessToken } = useAuth();

  const { matchId, userId, players, onPlayerDeleted } = props;
  
  const [err, setErr] = useState<string | null>(null);

  //player para eliminar
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlayer(e.target.value);
  };

  const handleClick = async () => {
    if (!selectedPlayer) {
      setErr("selecciona un jugador primero");
      return;
    }
    try {
      const result = await fetch(
        `http://localhost:3000/matches/${matchId}/room/${selectedPlayer}`,
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
      if (data.message) return <p>Player deleted</p>;
      onPlayerDeleted();
      setSelectedPlayer("");
    } catch (err) {
      setErr("network error, unable to connect the server");
    }
  };

  const filteredNoUser = players.filter((p) => p !== userId);

  return (
    <>
      <select
        className="text-white bg-black"
        name={selectedPlayer}
        value={selectedPlayer}
        onChange={(e) => handleSelect(e)}
      >
        <option value="">Select Player to Delete</option>

        {filteredNoUser.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button onClick={handleClick}>Delete Player</button>
    </>
  );
};
