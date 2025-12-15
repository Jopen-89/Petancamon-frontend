import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { data, useNavigate, type MiddlewareFunction } from "react-router-dom";
import { TestMapPage } from "../components/TestMapPage";
import { ToogleMaps } from "../components/ToggleMaps";

type Level = "low" | "middle" | "top";

type Form = {
  selectedLocationId: string;
  courtName: string;
  addressOriginal: string;
  coordinates: [number, number] | null;
  level: Level;
  date: string;
  maxPlayers: number;
};

interface Location {
  id: string;
  courtName: string;
  adressOriginal: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface MapCoords {
  lat: number;
  lng: number;
}

export type Match = {
  location: {
    id: string;
    courtName: string;
    adressOriginal: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
};

type LocationMode = "existing" | "new";

export const CreateMatchPage = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<Form>({
    selectedLocationId: "",
    courtName: "",
    addressOriginal: "",
    coordinates: null as [number, number] | null,
    level: "low",
    date: "",
    maxPlayers: 2,
  });

  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [matches, setMatches] = useState<Match[]>([]);

  const [isLoadingMat, setIsLoadingMat] = useState<boolean>(false);

  const [locationMode, setLocationMode] = useState<"existing" | "new">(
    "existing"
  );

  //cambiar centro del mapa (AJUSTAR EL MAPA CON LA ELECCION DE COURTNAME)
  const [mapCenter, setMapCenter] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);

  const anyWindow = window as any;

  //las coords que le pasa el hijo

  //el evento de tipo React.ChangeEvent..

  const handleMapCoords = (coords: MapCoords) => {
    setForm((prev) => ({ ...prev, coords: [coords.lng, coords.lat] }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    //coords case

    if (name === "lng" || name === "lat") {
      const num = Number(value);

      setForm((prev) => {
        const current: [number, number] = prev.coordinates || [0, 0];

        const updated: [number, number] =
          name === "lng" ? [num, current[1]] : [current[0], num];

        return {
          ...prev,
          coords: updated,
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
            coords: form.coordinates
              ? { lat: form.coordinates[1], lng: form.coordinates[0] }
              : undefined,
          }),
        });
        if (!result.ok) {
          setErr("Error sending data");
        }
        const data = await result.json();
        console.log(data);
        navigate(`/matches/${data.match.id}`);
      } catch (err) {
        setErr("Error creating the match");
      } finally {
        setIsLoading(false);
      }
    };
    loadMatch();
  };

  //conseguir localizaciones /primero mapa

  useEffect(() => {
    const LoadMatch = async () => {
      setIsLoadingMat(true);
      try {
        const result = await fetch("http://localhost:3000/matches", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!result.ok) {
          setErr("error fetching match");
          setIsLoadingMat(false);
          return;
        }
        const data = await result.json();
        setMatches(data.matches);
        console.log("a ver data", data.matches);
      } catch (err) {
        setErr("network conection error");
      } finally {
        setIsLoadingMat(false);
      }
    };
    LoadMatch();
  }, []);

  const uniqueLocations: Location[] = matches.reduce<Location[]>(
    (acc, current) => {
      console.log("procesando match:", current);

      if (!current.location) {
        console.warn("este match no tiene location", current);
        return acc;
      }

      const isDuplicate = acc.find(
        (item) => item.courtName === current.location?.courtName
      );
      if (!isDuplicate && current.location) {
        acc.push(current.location);
      }
      return acc;
    },
    []
  );
  //aqui se aplica regla solid, se pasa id para que handle pueda seguir aunque cambie el render
  const handleSelectExistingLocation = (locId: string) => {
    const loc = uniqueLocations.find((l) => l.id === locId);
    if (!loc) return;

    setForm((prev) => ({
      ...prev,
      courtName: loc.courtName,
      coordinates: [loc.coordinates.lng, loc.coordinates.lat],
    }));

    if (loc && loc.coordinates) {
      setMapCenter({
        lat: loc.coordinates.lat,
        lng: loc.coordinates.lng,
      });
    }
  };

  //voy a duplicar logica (luego arreglo)

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setForm((prev) => ({
      ...prev,
      coords: [lng, lat],
    }));
  }, []);

  if (isLoading) return <p>Loading...</p>;

  //le paso al hijo -> onSelectedCoords{(coords) => setCoords(coords)}
  //puedo llamarla dentro del hijo

  return (
    <>
      <h2>Create Match</h2>
      <div>
        <form
          className="flex flex-col bg-white text-black px-4 py-2"
          onSubmit={handleSubmit}
        >
          <label className="bg-green-500">*FALTA* Match name</label>

          <label>Level</label>
          <select
            className="border border-black p-2 rounded"
            name="level"
            value={form.level}
            onChange={handleChange}
          >
            <option value="low">Low</option>
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

          <label>CourtName</label>
          <input
            name="courtName"
            type="text"
            value={form.courtName}
            onChange={handleChange}
            className="border border-black p-2 rounded"
          />

          {/*TOGGLE: que modo usar*/}
          <div className="my-4">
            {" "}
            {/* Le damos un poco de margen */}
            <ToogleMaps
              value={locationMode}
              onChange={(mode) => setLocationMode(mode)}
            />
          </div>

          {/* TOGGLE 1: PISTA EXISTENTE */}

          {locationMode === "existing" && (
            <div className="border p-3 mb-4">
              <h3 className="font-semibold mb-2">
                Selecciona una pista existente
              </h3>

              <ul className="mb-3">
                {uniqueLocations.map((loc, index) => (
                  <li key={loc.id ? String(loc.id) : index}>
                    <button
                      type="button"
                      className="underline text-blue-600"
                      onClick={() => handleSelectExistingLocation(loc.id)}
                    >
                      {loc.courtName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* MODO 2: PISTA NUEVA */}
          {locationMode === "new" && (
            <div className="border p-3 mb-4">
              <h3 className="font-semibold mb-2">Crear una pista nueva</h3>

              <label className="block mb-2">
                Nombre de la pista
                <input
                  className="block border px-2 py-1 w-full text-black"
                  type="text"
                  value={form.courtName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, courtName: e.target.value }))
                  }
                  placeholder="Ej: Pistas del Retiro - Pista 3"
                />
              </label>
            </div>
          )}

          {/*MAPA PARA AMBOS MODOS*/}
          <div className="flex">
            <TestMapPage
              onSelectedCoords={handleMapCoords}
              matches={matches} // en "new" lo dejas vacío
              onMapClick={handleMapClick}
              center={mapCenter}
              locationMode={locationMode}
            />
          </div>

          {/*mostrar resultado elegido*/}
          {form.coordinates && (
            <p className="text-sm mt-2">
              Coordenadas seleccionadas:
              <strong>
                {form.coordinates[1]}, {form.coordinates[0]}
              </strong>
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white font-bold p-3 rounded mt-4 hover:bg-blue-700 transition"
          >
            Save Match
          </button>
        </form>
      </div>
    </>
  );
};
