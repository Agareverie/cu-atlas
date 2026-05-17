import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { Building } from "@/types/building";
import { facultyFillColor, facultyStrokeColor } from "@/utils/faculty-colors";
import { getCentroid } from "@/utils/map-coordinates";

export default function MapPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);

  useEffect(() => {
    fetch("http://10.0.2.2:3000/buildings")
      .then((res) => res.json())
      .then((data) => {
        setBuildings(data.buildings);
      })
      .catch(console.error);
  }, []);

  return (
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
                ([longitude, latitude]) => ({
                  latitude,
                  longitude,
                }),
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
                  paddingHorizontal: 5,
                  paddingVertical: 4,
                  includeFontPadding: false,
                  fontSize: 8,
                  borderRadius: 3,
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
    </MapView>
  );
}
