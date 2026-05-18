import { useState, useEffect } from "react";
import { Building } from "@/types/building";
import { facultyFillColor, facultyStrokeColor } from "@/utils/faculty-colors";
import { getCentroid } from "@/utils/map-coordinates";
import "leaflet/dist/leaflet.css";
import Head from "expo-router/head";

export default function MapScreen() {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/buildings")
      .then((res) => res.json())
      .then((data) => setBuildings(data.buildings))
      .catch(console.error);
  }, []);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(
      ([reactLeaflet]) => setMapComponents(reactLeaflet),
    );
  }, []);

  if (!MapComponents) return null;

  const { MapContainer, TileLayer, Polygon, Marker, Popup } = MapComponents;

  const codeIcon = (code: string) =>
    window.L.divIcon({
      className: "",
      html: `<div style="
        position: absolute;
        transform: translate(-50%, -50%);
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 1px 5px;
        font-size: 11px;
        font-weight: 600;
        color: black;
        white-space: nowrap;
      ">${code}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

  return (
    <>
      <Head>
        <title>Map — CU Atlas</title>
      </Head>

      <MapContainer
        center={[13.736, 100.532]}
        zoom={20}
        style={{ width: "100%", height: "100vh" }}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        {buildings.map((building) => {
          const centroid = getCentroid(building.geometry.coordinates[0]);

          return (
            <>
              {building.geometry.coordinates.map((ring, i) => (
                <Polygon
                  key={`${building._id}-${i}`}
                  positions={ring.map(([lng, lat]) => [lat, lng])}
                  interactive={false}
                  pathOptions={{
                    color: facultyStrokeColor(building),
                    fillColor: facultyFillColor(building),
                    fillOpacity: 1,
                    weight: 2,
                  }}
                />
              ))}

              <Marker
                key={`code-${building._id}`}
                position={centroid}
                icon={codeIcon(building.code)}
                interactive={true}
              >
                <Popup closeButton={false}>{building.name_en}</Popup>
              </Marker>
            </>
          );
        })}
      </MapContainer>
    </>
  );
}
