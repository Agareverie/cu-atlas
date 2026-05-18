import { useState, useEffect } from "react";
import { Building } from "@/types/building";
import { Route } from "@/types/route";
import { facultyFillColor, facultyStrokeColor } from "@/utils/faculty-colors";
import { getCentroid } from "@/utils/map-coordinates";
import "leaflet/dist/leaflet.css";
import Head from "expo-router/head";

export default function MapScreen() {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/buildings")
      .then((res) => res.json())
      .then((data) => setBuildings(data.buildings))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/routes")
      .then((res) => res.json())
      .then((data) => setRoutes(data.routes))
      .catch((err) => {
        setRoutes([]);
      });
  }, []);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(
      ([reactLeaflet]) => setMapComponents(reactLeaflet),
    );
  }, []);

  if (!MapComponents) return null;

  const { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup } =
    MapComponents;

  const activeRoute = routes.find((r) => r._id === selectedRoute) ?? null;
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

      {/* Route selector panel */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000,
          background: "white",
          borderRadius: 12,
          padding: "12px 16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          gap: 8,
          minWidth: 160,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
          Bus Routes
        </span>

        {/* None option */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          <input
            type="radio"
            name="route"
            checked={selectedRoute === null}
            onChange={() => setSelectedRoute(null)}
          />
          None
        </label>

        {routes.map((route) => (
          <label
            key={route._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            <input
              type="radio"
              name="route"
              checked={selectedRoute === route._id}
              onChange={() => setSelectedRoute(route._id)}
            />
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: route.color,
                flexShrink: 0,
              }}
            />
            Bus Line {route.route_number}
          </label>
        ))}
      </div>

      <MapContainer
        center={[13.736, 100.532]}
        zoom={16}
        style={{ width: "100%", height: "100vh" }}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />

        {/* Building polygons */}
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

        {/* Active route polyline */}
        {activeRoute && (
          <Polyline
            positions={activeRoute.geometry.coordinates.map(([lng, lat]) => [
              lat,
              lng,
            ])}
            pathOptions={{
              color: activeRoute.color,
              weight: 4,
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>
    </>
  );
}
