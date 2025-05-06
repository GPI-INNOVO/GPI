"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import styles from "../../styles/sectores.module.css";
import "leaflet/dist/leaflet.css";
import "leaflet.label/dist/leaflet.label.css";
import Tab_Sectores from "@/components/Rutas/Tab_Sector";
import { useRuta } from "../../app/adm/rutas/RutaProvider";
import { Menu } from "lucide-react";
// Carga dinámica de los componentes de react-leaflet sin SSR
const MapContainerWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayerWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const PolygonWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  { ssr: false }
);
let L: any; // Definimos L aquí para que solo se cargue en el cliente
export default function Map_Ruta() {
  const [isClient, setIsClient] = useState(false); // Verificar si estamos en el cliente
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);
  const [center, setCenter] = useState<[number, number]>([
    -33.045022005412754, -71.42055173713028,
  ]);
  const { ruta } = useRuta();
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      L = require("leaflet"); // Cargamos Leaflet solo en el cliente
    }
  }, []);
  useEffect(() => {
    if (ruta && ruta.perimetral.length > 0) {
      const perimetralPlano = ruta.perimetral[0] as unknown as [
        number,
        number
      ][]; // Transforma los datos del sector
      const nuevosMarkers = perimetralPlano.map(
        ([lat, lng]: [number, number]) => ({
          lat,
          lng,
        })
      );
      setMarkers(nuevosMarkers);
      setIsOpen(false);
    }
  }, [ruta]);

  if (!isClient) {
    return null; // Evitar renderizar en el servidor
  }

  return (
    <div className={styles.AdminDiv}>
      {isOpen ? (
        <div className={styles.overlayContainer}>
          <Tab_Sectores />
        </div>
      ) : (
        <button
          style={{
            position: "absolute",
            top: "10%",
            left: "3.3%",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.6)",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </button>
      )}

      <MapContainerWithNoSSR
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        preferCanvas={false}
      >
        <TileLayerWithNoSSR
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PolygonWithNoSSR
          positions={markers} // Pasa las coordenadas al polígono
          color="blue"
          fillColor="blue"
          fillOpacity={0.4} // Configura la opacidad del área rellenada
        />
      </MapContainerWithNoSSR>
    </div>
  );
}
