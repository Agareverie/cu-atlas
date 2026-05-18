import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Polygon, Polyline } from "react-native-maps";
import { Building } from "@/types/building";
import { Route } from "@/types/route";
import { facultyFillColor, facultyStrokeColor } from "@/utils/faculty-colors";
import { getCentroid } from "@/utils/map-coordinates";
import { SHADOWS } from "@/theme/shadows";

export default function MapPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://10.0.2.2:3000/buildings")
      .then((res) => res.json())
      .then((data) => setBuildings(data.buildings))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("http://10.0.2.2:3000/routes")
      .then((res) => res.json())
      .then((data) => setRoutes(data.routes))
      .catch(console.error);
  }, []);

  const activeRoute = routes.find((r) => r._id === selectedRoute) ?? null;

  return (
    <View style={{ flex: 1 }}>
      {/* Route selector */}
      <View
        style={{
          marginTop: 30,
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor: "white",
          borderRadius: 12,
          padding: 12,
          minWidth: 150,
          ...SHADOWS.card,
        }}
      >
        <Text style={{ fontWeight: "700", fontSize: 13, marginBottom: 8 }}>
          Bus Routes
        </Text>

        {/* None option */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
          onPress={() => setSelectedRoute(null)}
        >
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "#aaa",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selectedRoute === null && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#aaa",
                }}
              />
            )}
          </View>
          <Text style={{ fontSize: 13 }}>None</Text>
        </TouchableOpacity>

        {routes.map((route) => (
          <TouchableOpacity
            key={route._id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
            onPress={() => setSelectedRoute(route._id)}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: route.color,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selectedRoute === route._id && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: route.color,
                  }}
                />
              )}
            </View>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: route.color,
              }}
            />
            <Text style={{ fontSize: 13 }}>Bus Line {route.route_number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 13.7393,
          longitude: 100.532,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        pitchEnabled={false}
        rotateEnabled={false}
        showsBuildings={false}
        customMapStyle={[
          {
            featureType: "all",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ]}
      >
        {buildings.map((building) => {
          const [centerLatitude, centerLongitude] = getCentroid(
            building.geometry.coordinates[0],
          );

          return (
            <View key={`${building.code}-view`}>
              <Polygon
                key={`${building.code}-polygon`}
                fillColor={facultyFillColor(building)}
                strokeColor={facultyStrokeColor(building)}
                strokeWidth={2}
                coordinates={building.geometry.coordinates[0].map(
                  ([longitude, latitude]) => ({ latitude, longitude }),
                )}
              />
              <Marker
                coordinate={{
                  latitude: centerLatitude,
                  longitude: centerLongitude,
                }}
                key={`${building.code}-marker`}
                title={building.name_en}
                anchor={{ x: 0.5, y: 0.25 }}
              >
                <Text
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 4,
                    paddingVertical: 2.5,
                    includeFontPadding: false,
                    fontSize: 8,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    fontWeight: "800",
                  }}
                >
                  {building.code}
                </Text>
              </Marker>
            </View>
          );
        })}

        {activeRoute && (
          <Polyline
            coordinates={activeRoute.geometry.coordinates.map(
              ([longitude, latitude]) => ({
                latitude,
                longitude,
              }),
            )}
            strokeColor={activeRoute.color}
            strokeWidth={2}
          />
        )}
      </MapView>
    </View>
  );
}
