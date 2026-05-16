import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";

type Building = {
  code: string;
  name_en: string;

  geometry: {
    type: "Polygon";

    coordinates: number[][][];
  };
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
              fillColor="rgba(0, 120, 255, 0.25)"
              strokeColor="#0078ff"
              strokeWidth={2}
              coordinates={coordinates}
            />

            <Marker coordinate={center} key={`${building.code}-marker`}>
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
