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
import { STATION_DISPLAY_NAME } from "@/utils/station-names";
import { Route, Station } from "@/types/route";

const screenWidth = Dimensions.get("window").width;

export default function PopBusScreen() {
  const [fromLocation, setFromLocation] = useState("");
  const [fromKey, setFromKey] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [toKey, setToKey] = useState("");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  const allStations = (
    Object.keys(STATION_DISPLAY_NAME) as Station[]
  ).sort();

  const fromSuggestions = allStations.filter(
    (station) =>
      fromLocation.length > 0 &&
      (station.toLowerCase().includes(fromLocation.toLowerCase()) ||
        (STATION_DISPLAY_NAME[station as Station] ?? "")
          .toLowerCase()
          .includes(fromLocation.toLowerCase())),
  );

  const toSuggestions = allStations.filter(
    (station) =>
      toLocation.length > 0 &&
      (station.toLowerCase().includes(toLocation.toLowerCase()) ||
        (STATION_DISPLAY_NAME[station as Station] ?? "")
          .toLowerCase()
          .includes(toLocation.toLowerCase())),
  );

  const normalizeInput = (input: string, key: string): Station => {
    if (!input && !key) return "sala";
    if (key) return key as Station; // if selected from dropdown, use key directly

    const lowerInput = input.toLowerCase();

    // 1. Exact key match
    const exactKey = allStations.find((s) => s === lowerInput);
    if (exactKey) return exactKey;

    // 2. Exact display name match (case insensitive)
    const exactName = allStations.find(
      (s) => (STATION_DISPLAY_NAME[s] ?? "").toLowerCase() === lowerInput,
    );
    if (exactName) return exactName;

    // 3. Display name starts with input
    const startsWithName = allStations.find((s) =>
      (STATION_DISPLAY_NAME[s] ?? "").toLowerCase().startsWith(lowerInput),
    );
    if (startsWithName) return startsWithName;

    // 4. Key starts with input
    const startsWithKey = allStations.find((s) => s.startsWith(lowerInput));
    if (startsWithKey) return startsWithKey;

    // 5. Substring fallback (last resort)
    const substring = allStations.find(
      (s) =>
        s.includes(lowerInput) ||
        (STATION_DISPLAY_NAME[s] ?? "").toLowerCase().includes(lowerInput),
    );
    if (substring) return substring;

    return input as Station;
  };

  const findRoutes = () => {
    setLoading(true);

    setTimeout(() => {
      const from = normalizeInput(fromLocation, fromKey);
      const to = normalizeInput(toLocation, toKey);
      const matchedRoutes: any[] = [];

      for (const bus of routes) {
        const fromIndex = bus.stops.indexOf(from as Station);
        const toIndex = bus.stops.indexOf(to as Station);

        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex)
          continue;

        // Circular forward distance: how many stops going forward (wrapping)
        const totalStops = bus.stops.length;
        const forwardStops =
          toIndex >= fromIndex
            ? toIndex - fromIndex
            : totalStops - fromIndex + toIndex;

        const forwardSequence: Station[] = [];
        for (let i = 0; i <= forwardStops; i++) {
          forwardSequence.push(bus.stops[(fromIndex + i) % totalStops]);
        }

        matchedRoutes.push({
          ...bus,
          stationsAway: forwardStops,
          from,
          to,
          via: null,
          sequence: forwardSequence,
        });
      }

      // If no direct routes found, try via Sala
      if (matchedRoutes.length === 0) {
        const sala = "sala" as Station;

        for (const leg1Bus of routes) {
          const fromIndex = leg1Bus.stops.indexOf(from as Station);
          const salaIndex1 = leg1Bus.stops.indexOf(sala);
          if (fromIndex === -1 || salaIndex1 === -1 || fromIndex === salaIndex1)
            continue;

          const leg1Stops =
            salaIndex1 >= fromIndex
              ? salaIndex1 - fromIndex
              : leg1Bus.stops.length - fromIndex + salaIndex1;

          for (const leg2Bus of routes) {
            const salaIndex2 = leg2Bus.stops.indexOf(sala);
            const toIndex = leg2Bus.stops.indexOf(to as Station);
            if (salaIndex2 === -1 || toIndex === -1 || salaIndex2 === toIndex)
              continue;

            const leg2Stops =
              toIndex >= salaIndex2
                ? toIndex - salaIndex2
                : leg2Bus.stops.length - salaIndex2 + toIndex;

            // Build leg 1 stop sequence
            const leg1Sequence: Station[] = [];
            for (let i = 0; i <= leg1Stops; i++) {
              leg1Sequence.push(
                leg1Bus.stops[(fromIndex + i) % leg1Bus.stops.length],
              );
            }

            // Build leg 2 stop sequence
            const leg2Sequence: Station[] = [];
            for (let i = 0; i <= leg2Stops; i++) {
              leg2Sequence.push(
                leg2Bus.stops[(salaIndex2 + i) % leg2Bus.stops.length],
              );
            }

            matchedRoutes.push({
              leg1: {
                ...leg1Bus,
                from,
                to: sala,
                stationsAway: leg1Stops,
                sequence: leg1Sequence,
              },
              leg2: {
                ...leg2Bus,
                from: sala,
                to,
                stationsAway: leg2Stops,
                sequence: leg2Sequence,
              },
              stationsAway: leg1Stops + leg2Stops,
              via: sala,
            });
          }
        }
      }

      matchedRoutes.sort((a, b) => a.stationsAway - b.stationsAway);
      setResults(matchedRoutes);
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
            onChangeText={(text) => {
              setFromLocation(text);
              setFromKey(""); // clear key when typing manually
            }}
            style={styles.input}
          />
        </View>

        {fromSuggestions.slice(0, 4).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestion}
            onPress={() => {
              setFromLocation(STATION_DISPLAY_NAME[item as Station] ?? item);
              setFromKey(item);
            }}
          >
            <Text>{STATION_DISPLAY_NAME[item as Station] ?? item}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.inputGroup}>
          <IconSymbol name="flag" size={20} color="#3b82f6" />

          <TextInput
            placeholder="To"
            value={toLocation}
            onChangeText={(text) => {
              setToLocation(text);
              setToKey("");
            }}
            style={styles.input}
          />
        </View>

        {toSuggestions.slice(0, 4).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestion}
            onPress={() => {
              setToLocation(STATION_DISPLAY_NAME[item as Station] ?? item);
              setToKey(item);
            }}
          >
            <Text>{STATION_DISPLAY_NAME[item as Station] ?? item}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.button} onPress={findRoutes}>
          <Text style={styles.buttonText}>Find Routes</Text>
        </TouchableOpacity>
      </View>

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

            {bus.via ? (
              // Two-leg journey via Sala
              <>
                <Text style={styles.routeTitle}>Via Sala Phra Kieo</Text>
                <Text style={styles.routeStation}>
                  {bus.stationsAway} total stops
                </Text>

                {/* Leg 1 */}
                <View
                  style={[styles.routeBar, { backgroundColor: bus.leg1.color }]}
                />
                <Text style={styles.routeTitle}>
                  Take Bus Line {bus.leg1.route_number}
                </Text>
                <Text style={styles.routeStation}>
                  {bus.leg1.stationsAway} stops from{" "}
                  {STATION_DISPLAY_NAME[bus.leg1.from as Station] ??
                    bus.leg1.from}{" "}
                  to{" "}
                  {STATION_DISPLAY_NAME[bus.leg1.to as Station] ?? bus.leg1.to}
                </Text>
                <Text style={{...styles.routeStops, paddingBottom: 15}}>
                  {bus.leg1.sequence.map((stop: Station, idx: number) => {
                    const isHighlighted =
                      stop === bus.leg1.from || stop === bus.leg1.to;
                    return (
                      <Text
                        key={idx}
                        style={{
                          fontWeight: isHighlighted ? "bold" : "normal",
                        }}
                      >
                        {STATION_DISPLAY_NAME[stop] ?? stop}
                        {idx !== bus.leg1.sequence.length - 1 && " → "}
                      </Text>
                    );
                  })}
                </Text>

                {/* Leg 2 */}
                <View
                  style={[styles.routeBar, { backgroundColor: bus.leg2.color }]}
                />
                <Text style={styles.routeTitle}>
                  Then take Bus Line {bus.leg2.route_number}
                </Text>
                <Text style={styles.routeStation}>
                  {bus.leg2.stationsAway} stops from{" "}
                  {STATION_DISPLAY_NAME[bus.leg2.from as Station] ??
                    bus.leg2.from}{" "}
                  to{" "}
                  {STATION_DISPLAY_NAME[bus.leg2.to as Station] ?? bus.leg2.to}
                </Text>
                <Text style={styles.routeStops}>
                  {bus.leg2.sequence.map((stop: Station, idx: number) => {
                    const isHighlighted =
                      stop === bus.leg2.from || stop === bus.leg2.to;
                    return (
                      <Text
                        key={idx}
                        style={{
                          fontWeight: isHighlighted ? "bold" : "normal",
                        }}
                      >
                        {STATION_DISPLAY_NAME[stop] ?? stop}
                        {idx !== bus.leg2.sequence.length - 1 && " → "}
                      </Text>
                    );
                  })}
                </Text>
              </>
            ) : (
              // Direct journey
              <>
                <View
                  style={[styles.routeBar, { backgroundColor: bus.color }]}
                />
                <Text style={styles.routeTitle}>
                  Bus Line {bus.route_number}
                </Text>
                <Text style={styles.routeStation}>
                  {bus.stationsAway} stops from{" "}
                  {STATION_DISPLAY_NAME[bus.from as Station] ?? bus.from} to{" "}
                  {STATION_DISPLAY_NAME[bus.to as Station] ?? bus.to}
                </Text>
                <Text style={styles.routeStops}>
                  {bus.sequence.map((stop: Station, idx: number) => {
                    const isHighlighted = stop === bus.from || stop === bus.to;
                    return (
                      <Text
                        key={idx}
                        style={{
                          fontWeight: isHighlighted ? "bold" : "normal",
                        }}
                      >
                        {STATION_DISPLAY_NAME[stop] ?? stop}
                        {idx !== bus.sequence.length - 1 && " → "}
                      </Text>
                    );
                  })}
                </Text>
              </>
            )}

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
