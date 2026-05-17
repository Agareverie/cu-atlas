import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
} from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { COLORS } from "@/theme/colors";
import { SHADOWS } from "@/theme/shadows";
import { LAYOUT } from "@/theme/layout";
import { TYPOGRAPHY } from "@/theme/typography";
import { Route } from "@/types/route";

const screenWidth = Dimensions.get("window").width;

export default function PopBusScreen() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [recentFrom, setRecentFrom] = useState<string[]>([]);
  const [recentTo, setRecentTo] = useState<string[]>([]);

  const [nearestMessage, setNearestMessage] = useState("");

  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    fetch(
      Platform.OS === "android"
        ? "http://10.0.2.2:3000/routes"
        : "http://localhost:3000/routes",
    )
      .then((res) => res.json())
      .then((data) => {
        setRoutes(data.routes);
      })
      .catch((err) => {
        setRoutes([]);
      });
  }, []);

  const allStations = Array.from(
    new Set(routes.flatMap((route) => route.stops)),
  );

  const fromSuggestions = allStations.filter(
    (station) =>
      station.toLowerCase().includes(fromLocation.toLowerCase()) &&
      fromLocation.length > 0,
  ).toSorted();

  const toSuggestions = allStations.filter(
    (station) =>
      station.toLowerCase().includes(toLocation.toLowerCase()) &&
      toLocation.length > 0,
  ).toSorted();

  const normalizeInput = (input: string) => {
    if (!input) {
      return "sala";
    }

    const lowerInput = input.toLowerCase();

    for (const station of allStations.toSorted()) {
      const lowerStation = station.toLowerCase();

      if (
        lowerStation.includes(lowerInput) ||
        lowerInput.includes(lowerStation)
      ) {
        setNearestMessage(`Nearest POP Bus station: ${station}`);

        return station;
      }
    }

    return input;
  };

  const findRoutes = () => {
    setLoading(true);
    setNearestMessage("");

    setTimeout(() => {
      const from = normalizeInput(fromLocation);
      const to = normalizeInput(toLocation);

      const matchedRoutes: any[] = [];

      for (const bus of routes) {
        const fromIndex = bus.stops.findIndex((stop) =>
          stop.toLowerCase() === from.toLowerCase(),
        );

        const toIndex = bus.stops.findIndex((stop) =>
          stop.toLowerCase() === to.toLowerCase(),
        );

        if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
          const stationsAway = Math.abs(toIndex - fromIndex);

          matchedRoutes.push({
            ...bus,
            stationsAway,
            from,
            to,
          });
        }
      }

      matchedRoutes.sort((a, b) => a.stationsAway - b.stationsAway);

      setResults(matchedRoutes);

      if (fromLocation) {
        setRecentFrom((prev) =>
          [fromLocation, ...prev.filter((item) => item !== fromLocation)].slice(
            0,
            5,
          ),
        );
      }

      if (toLocation) {
        setRecentTo((prev) =>
          [toLocation, ...prev.filter((item) => item !== toLocation)].slice(
            0,
            5,
          ),
        );
      }

      setLoading(false);
    }, 300);
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
          }}
          style={styles.busBackground}
        />

        <Text style={styles.title}>CU POP BUS</Text>

        <Text style={styles.subtitle}>Smart campus transportation system</Text>
      </View>

      <View style={styles.searchCard}>
        <View style={styles.inputGroup}>
          <IconSymbol name="pin" size={20} color="#ef4444" />

          <TextInput
            placeholder="From (default: Sala Phra Kieo)"
            value={fromLocation}
            onChangeText={setFromLocation}
            style={styles.input}
          />
        </View>

        {fromSuggestions.slice(0, 4).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestion}
            onPress={() => setFromLocation(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.inputGroup}>
          <IconSymbol name="flag" size={20} color="#3b82f6" />

          <TextInput
            placeholder="To station"
            value={toLocation}
            onChangeText={setToLocation}
            style={styles.input}
          />
        </View>

        {toSuggestions.slice(0, 4).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestion}
            onPress={() => setToLocation(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.button} onPress={findRoutes}>
          <Text style={styles.buttonText}>Find Routes</Text>
        </TouchableOpacity>
      </View>

      {recentFrom.length > 0 && (
        <View style={styles.recentBox}>
          <Text style={styles.recentTitle}>Recent From Searches</Text>

          <Text style={styles.recentText}>{recentFrom.join(" • ")}</Text>
        </View>
      )}

      {recentTo.length > 0 && (
        <View style={styles.recentBox}>
          <Text style={styles.recentTitle}>Recent To Searches</Text>

          <Text style={styles.recentText}>{recentTo.join(" • ")}</Text>
        </View>
      )}

      {nearestMessage !== "" && (
        <View style={styles.nearestBox}>
          <Text style={styles.nearestText}>{nearestMessage}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Available Routes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#111827" />
      ) : results.length === 0 ? (
        <View style={styles.emptyCard}>
          <IconSymbol name="bus" size={55} color="#d1d5db" />

          <Text style={styles.emptyText}>Search routes to begin</Text>
        </View>
      ) : (
        results.map((bus, index) => (
          <View key={index} style={styles.routeCard}>
            {index === 0 && (
              <Text style={styles.recommended}>Recommended Fastest Route</Text>
            )}

            <View style={[styles.routeBar, { backgroundColor: bus.color }]} />

            <Text style={styles.routeTitle}>Bus line {bus.route_number}</Text>

            <Text style={styles.routeStation}>
              {bus.stationsAway} stops from {bus.from} to {bus.to}
            </Text>

            <Text style={styles.routeStops}>
              {bus.stops.map((stop: string, idx: number) => {
                const isHighlighted = stop === bus.from || stop === bus.to;

                return (
                  <Text
                    key={idx}
                    style={{
                      fontWeight: isHighlighted ? "bold" : "normal",
                    }}
                  >
                    {stop}
                    {idx !== bus.stops.length - 1 && " → "}
                  </Text>
                );
              })}
            </Text>

            {!bus.available_at_saturday && (
              <Text style={styles.warning}>Not available on Saturday</Text>
            )}
          </View>
        ))
      )}

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal:
      screenWidth > 700 ? LAYOUT.screenPadding.wide : LAYOUT.screenPadding.base,
  },

  hero: {
    marginBottom: 30,
    backgroundColor: "#d9468f",
    paddingTop: 70,
    paddingBottom: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: "center",
    overflow: "hidden",
  },

  busBackground: {
    position: "absolute",
    width: 180,
    height: 180,
    opacity: 0.16,
    right: -20,
    top: 20,
  },

  title: {
    color: "white",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 1,
  },

  subtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.85)",
    ...TYPOGRAPHY.body,
  },

  sectionTitle: {
    marginBottom: 20,
    color: COLORS.primary,
    ...TYPOGRAPHY.sectionTitle,
  },

  searchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 22,
    marginBottom: 35,

    ...SHADOWS.card,
  },

  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    padding: 16,
    marginLeft: 10,
    ...TYPOGRAPHY.body,
  },

  suggestion: {
    backgroundColor: "#fdf2f8",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  button: {
    backgroundColor: "#d9468f",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },

  buttonText: {
    color: COLORS.white,
    ...TYPOGRAPHY.button,
  },

  recentBox: {
    backgroundColor: COLORS.white,
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,

    ...SHADOWS.card,
  },

  recentTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    color: COLORS.primary,
  },

  recentText: {
    color: COLORS.muted,
  },

  nearestBox: {
    backgroundColor: "#fdf2f8",
    padding: 16,
    borderRadius: 18,
    marginBottom: 18,
  },

  nearestText: {
    color: "#9d174d",
    fontWeight: "600",
  },

  emptyCard: {
    backgroundColor: COLORS.white,
    padding: 40,
    borderRadius: 28,
    alignItems: "center",

    ...SHADOWS.card,
  },

  emptyText: {
    marginTop: 18,
    color: COLORS.muted,
    ...TYPOGRAPHY.body,
  },

  routeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 22,
    marginBottom: 20,

    ...SHADOWS.card,
  },

  recommended: {
    color: "#16a34a",
    fontWeight: "bold",
    marginBottom: 10,
  },

  routeBar: {
    height: 8,
    borderRadius: 20,
    marginBottom: 18,
  },

  routeTitle: {
    color: COLORS.primary,
    ...TYPOGRAPHY.cardTitle,
  },

  routeStation: {
    color: COLORS.muted,
    marginTop: 5,
    marginBottom: 14,
    ...TYPOGRAPHY.caption,
  },

  routeStops: {
    color: COLORS.secondary,
    lineHeight: 26,
    ...TYPOGRAPHY.body,
  },

  warning: {
    marginTop: 14,
    color: "#dc2626",
    fontWeight: "600",
  },
});
