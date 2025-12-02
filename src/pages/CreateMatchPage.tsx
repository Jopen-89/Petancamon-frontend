import React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { data, useNavigate } from "react-router-dom";

type Level = "low" | "middle" | "top";

type Form = {
  selectedLocationId: string;
  courtName: string | null;
  addressOriginal: string;
  coords: [number, number] | null;
  level: string;
  date: string;
  maxPlayers: number;
};

export const CreateMatchPage = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    selectedLocationId: "",
    courtName: "",
    addressOriginal: "",
    coords: null,
    level: "low",
    date: "",
    maxPlayers: "2",
  });

  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //el evento de tipo React.ChangeEvent..

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    //coords case

    if (name === "lng" || name === "lat") {
      const num = Number(value);

      setForm((prev) => {
        const current = prev.coords || [0, 0];

        const updated = name === "lng" ? [num, current[1]] : [current[0], num];

        return {
          ...prev,
          [name]: value,
        };
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //evita que el form recargue la pagina
    console.log("enviando datos:", form);
    setIsLoading(true);

    const loadMatch = async () => {
      try {
        const result = await fetch("http://localhost:3000/matches", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...form,
            date: new Date(form.date), //convierto string -> date aqui
            maxPlayers: Number(form.maxPlayers),
            coords: form.coords
              ? { lat: form.coords[1], lng: form.coords[0]}
              : undefined
          }), 
        });
        if (!result.ok) {
          setErr("Error sending data");
        }
        const data = await result.json()
        console.log(data)
        navigate(`/matches/${data.match.id}`)
      } catch (err) {
        setErr("Error creating the match");
      } finally {
        setIsLoading(false);
      }
    };
    loadMatch();
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <h2>Create Match</h2>
      <div>
        <form
          className="flex flex-col bg-white text-black"
          onSubmit={handleSubmit}
        >
          <label>CourtName</label>
          <input
            name="courtName"
            type="text"
            value={form.courtName}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />

          <label>Level</label>
          <select
            className="border border-black p-2 rounded"
            name="level"
            value={form.level}
            onChange={handleChange}
          >
            <option className="border border-black p-2 rounded" value="low">
              low
            </option>
            <option value="middle">Middle</option>
            <option value="top">Top</option>
          </select>

          <label>maxPlayers</label>
          <input
            name="maxPlayers"
            type="number"
            value={form.maxPlayers}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />

          <label>Date</label>
          <input
            className="border border-black p-2 rounded"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <label>SelectedLocationId</label>
          <input
            name="selectedLocationId"
            type="text"
            value={form.selectedLocationId}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />

          <label>AddressOriginal</label>
          <input
            name="addressOriginal"
            type="text"
            value={form.addressOriginal}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />
          <p>Coords</p>
          <label>Longitude</label>
          <input
            name="lng"
            type="number"
            value={form.coords ? form.coords[0] : ""}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />

          <label>Latitude</label>
          <input
            name="lat"
            type="number"
            value={form.coords ? form.coords[1] : ""}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />
          <button type="submit">Save</button>
        </form>
      </div>
    </>
  );
};
