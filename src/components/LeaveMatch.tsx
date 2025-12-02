import type React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type LeaveMatchProps = {
  matchId: string;
};

export const LeaveMatch = (props: LeaveMatchProps) => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { matchId } = props;
  const handleClick = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/matches/${matchId}/room/leave`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!result.ok) {
        console.log("server rejected the request");
      }
      const data = await result.json();
      navigate("/matches");
    } catch (error) {
      console.log("network error");
    }
  };

  return (
    <button
      className="text-red bg-green hover:bg-red-600 cursor-pointer"
      onClick={handleClick}
    >
      Leave Match
    </button>
  );
};
