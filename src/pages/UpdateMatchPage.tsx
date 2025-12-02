import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type Match = {
  level: string;
  maxPlayers: number;
};

export const UpdateMatchPage = () => {
  const { matchId } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState<Match>({
    level: "low",
    maxPlayers: 0,
  });

  const loadMatches = async () => {
    try {
      const result = await fetch(`http://localhost:5000/matches/${matchId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!result.ok) {
        setErr("Server rejected the petition");
      }
      const data = await result.json();
      setForm(data.match);
      
    } catch (err) {
      setErr("Network error, unable to connect the server loading");
    }
  };

  useEffect(() => {
    loadMatches();
    console.log("a ver data.match", form)
  }, [matchId, accessToken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        level: form.level,
        maxPlayers: Number(form.maxPlayers),
      };

      console.log("a ver body:", body)

      const result = await fetch(
        `http://localhost:3000/matches/${matchId}/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!result.ok) {
        setErr("Server rejected the request");
      }
      const data = await result.json();
      navigate(`/matches/${matchId}`, {
        state: { message: "Match successfully updated" },
      });
    } catch (err) {
      setErr("network error, unable to connect server");
    }
  };



  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Level</label>
        <select name="level" value={form.level} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="middle">Middle</option>
          <option value="top">Top</option>
        </select>

        <label>MaxPlayers</label>
        <input
          name="maxPlayers"
          type="number"
          value={form.maxPlayers}
          onChange={handleChange}
        />

        <button type="submit">Update Match</button>
      </form>
    </>
  );
};
