import type React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type Form = {
  leagueName: string;
  maxPlayers: string;
};

export const CreateLeaguePage = () => {
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<Form>({
    leagueName: "",
    maxPlayers: "10",
  });
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      return;
    }
    const { id: userId } = user;

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("a ver form:", form);

    const body = { ...form, maxPlayers: Number(form.maxPlayers) };
    setIsLoading(true);
    try {
      const result = await fetch("http://localhost:3000/league", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
      const data = await result.json();
      if (!result.ok) {
        setErr(data.message ?? "Error loading the league");
        return;
      }
      console.log("a ver data", data.league);
      console.log("a ver message", data.message);
      navigate("/leagues");
    } catch (err) {
      setErr("network error, unable to connect the server");
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = form.leagueName.trim() !== "" && Number(form.maxPlayers) > 0;

  if (IsLoading) return <p>Loading...</p>;
  if (err) return <p>{err}</p>;

  return (
    <>
      <h2>Create 2vs2 League</h2>
      <form
        className="flex flex-col bg-white text-black px-4 py-2"
        onSubmit={handlesubmit}
      >
        <label>League Name</label>
        <input
          className="border border-black p-2 rounded"
          name="leagueName"
          type="text"
          value={form.leagueName}
          onChange={handleChange}
        />

        <label>MaxPlayers</label>
        <input
          className="border border-black p-2 rounded"
          type="number"
          name="maxPlayers"
          value={form.maxPlayers}
          onChange={handleChange}
        />
        <button
          disabled={!isValid}
          className="bg-blue-600 text-white font-bold p-3 rounded mt-4 hover:bg-blue-700 transition"
        >
          Save League
        </button>
      </form>
    </>
  );
};
