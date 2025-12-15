import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Match } from "../pages/CreateMatchPage";

export interface MapCoords {
  lat: number;
  lng: number;
}

interface TestMapPageProps {
  matches: Match[];
  onSelectedCoords?: (coords: MapCoords) => void;
  onMapClick?: (lat: number, lng: number) => void;
  center?: { lat: number; lng: number };
  locationMode?: "existing" | "new";
}

export const TestMapPage = ({
  onSelectedCoords,
  matches,
  onMapClick,
  center,
  locationMode,
}: TestMapPageProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { accessToken } = useAuth();

  console.log("a ver matchesTEST", matches);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const markersRef = useRef<any[]>([]);

  const apiKey = import.meta.env.PUBLIC_GOOGLE_MAP_API as string;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const [selectedCoord, setSelectedCoord] = useState<MapCoords | null>(null);

  const anyWindow = window as any;

  //Cargar partido para localizaciones

  useEffect(() => {
    //1 si existe
    const existingScript = document.getElementById(
      "google-maps-script"
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (anyWindow.google && anyWindow.google.maps) {
        setIsLoaded(true);
      } else {
        existingScript.onload = () => {
          setIsLoaded(true);
          console.log("map working");
        };
      }
      return;
    }

    //2 si no existe el script
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    document.body.appendChild(script);
  }, [apiKey]);

  useEffect(() => {
    if (!isLoaded) return;
    if (mapInstanceRef.current) return;

    const mapElement = mapRef.current;
    if (!mapElement) return;

    const center = { lat: 40.416775, lng: -3.70379 };

    const position = {
      center,
      zoom: 14,
    };

    const map = new anyWindow.google.maps.Map(mapElement, position);

    mapInstanceRef.current = map;
  }, [isLoaded]);

  //CAMBIAR MARKERS

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (locationMode !== "new") return;

    const createOrMoveMarker = (lat: number, lng: number) => {
      if (markerRef.current) {
        markerRef.current.setMap(map);
        markerRef.current.setPosition({ lat, lng });
      } else {
        markerRef.current = new anyWindow.google.maps.Marker({
          position: { lat, lng },
          map: map,
          draggable: true,
        });
      }
    };

    //listener de click en el mapa
    const clickListener = map.addListener("click", (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      console.log("click", lat, lng);

      console.log("a ver clicklistener:", clickListener);

      setSelectedCoord({ lat, lng });

      // 2. Avisar al padre
      if (onSelectedCoords) onSelectedCoords({ lat, lng });
      if (onMapClick) onMapClick(lat, lng);

      // crear o mover el marker principal
      createOrMoveMarker(lat, lng);
    });
    console.log("markerRef.current", markerRef.current);

    // Cleanup: Limpiamos SOLO el listener al desmontar o si cambian las props
    return () => {
      anyWindow.google.maps.event.removeListener(clickListener);
    };
  }, [isLoaded, onSelectedCoords, onMapClick, locationMode]);

  //cargar markersRef con las localizaciones

  useEffect(() => {
    console.log("isloaded", isLoaded);
    console.log("matches:", matches);
    console.log("mapinstanceref", mapInstanceRef);

    // 1. Validaciones iniciales
    if (!isLoaded || !matches || !mapInstanceRef.current) {
      console.log("waiting for the map and data to load");
      return;
    }

    const google = anyWindow.google;

    // 2. LIMPIEZA: Borrar marcadores anteriores para no duplicarlos
    // Recorremos los que ya teníamos guardados y los quitamos del mapa
    if (markersRef.current) {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = []; // Vaciamos el array
    }

    const result = matches?.forEach((m) => {
      if (m.location?.coordinates) {
        console.log("m.location.coordinates:", m.location.coordinates);
        const lng = m.location.coordinates.lng;
        const lat = m.location.coordinates.lat;

        const position = {
          lat: Number(lat),
          lng: Number(lng),
        };

        console.log("a ver position", position);
        console.log("m.location.courtName", m.location.courtName);

        const newMarker = new anyWindow.google.maps.Marker({
          position: position,
          map: mapInstanceRef.current, // Aquí le dices a qué mapa pertenece
          title: m.location.courtName || "pista",
        });

        console.log("a ver newMarker", newMarker);

        if (markersRef.current) markersRef.current.push(newMarker);
      }
    });
  }, [isLoaded, matches]);

  //CAMBIAR EL CENTRO DEL MAPA EN MAPA EXISTENTE

  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(16);
    }
  }, [center]);

  if (!isLoaded) return <p>map is not loaded</p>;

  return <div ref={mapRef} className="w-full h-[400px]"></div>;
};
