import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";

type Building = {
  code: string;
  name_en: string;
  faculty: string;
  geometry: {
    type: "Polygon";

    coordinates: number[][][];
  };
};

const FACULTY_COLOR_RGB: Record<string, number[]> = {
  Arts: [128, 128, 128], // Grey
  Engineering: [164, 49, 42], // Firebrick
  Other: [245, 194, 203], // Pink
};

const facultyFillColor = (building: Building) => {
  const rgbArray =
    FACULTY_COLOR_RGB[building.faculty] ?? FACULTY_COLOR_RGB["Other"];
  return `rgba(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]}, 0.25)`;
};

const facultyStrokeColor = (building: Building) => {
  const rgbArray =
    FACULTY_COLOR_RGB[building.faculty] ?? FACULTY_COLOR_RGB["Other"];
  return `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
};

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
        longitude: 100.534,
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
        const coordinates = building.geometry.coordinates[0].map(
          ([longitude, latitude]) => ({
            latitude,
            longitude,
          }),
        );

        const center = coordinates.reduce(
          (acc, coord) => ({
            latitude: acc.latitude + coord.latitude,
            longitude: acc.longitude + coord.longitude,
          }),
          { latitude: 0, longitude: 0 },
        );

        center.latitude /= coordinates.length;
        center.longitude /= coordinates.length;

        return (
          <View key={`${building.code}-view`}>
            <Polygon
              key={`${building.code}-polygon`}
              fillColor={facultyFillColor(building)}
              strokeColor={facultyStrokeColor(building)}
              strokeWidth={2}
              coordinates={coordinates}
            />

            <Marker
              coordinate={center}
              key={`${building.code}-marker`}
              title={building.name_en}
            >
              <Text
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  includeFontPadding: false,
                  fontSize: 9,
                  fontWeight: "400",
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
