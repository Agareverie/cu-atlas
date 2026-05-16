import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { COLORS } from "@/theme/colors";
import { SHADOWS } from "@/theme/shadows";
import { LAYOUT } from "@/theme/layout";
import { TYPOGRAPHY } from "@/theme/typography";

const screenWidth = Dimensions.get("window").width;

export default function PopBusScreen() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const busRoutes = [
    {
      line: "Bus Line 1",
      color: "#ef4444",
      stations: 13,
      stops: [
        "Sala Phra Kieo",
        "BRK",
        "Arts",
        "Political Science",
        "Engineering",
        "ENG 1",
        "ENG 2",
        "Chamchuri 9",
      ],
    },

    {
      line: "Bus Line 2",
      color: "#3b82f6",
      stations: 8,
      stops: [
        "Sala Phra Kieo",
        "Economics",
        "MTBLD",
        "Science",
        "Engineering",
        "BRK",
      ],
    },

    {
      line: "Bus Line 3",
      color: "#22c55e",
      stations: 10,
      stops: ["Science", "Arts", "Engineering", "CHALE", "BRK", "Samyan"],
    },

    {
      line: "Bus Line 4",
      color: "#f59e0b",
      stations: 11,
      stops: ["CU Center", "Engineering", "MTBLD", "BRK", "CHALE"],
    },
  ];

  const findRoutes = () => {
    setLoading(true);

    setTimeout(() => {
      const filtered = busRoutes.filter((bus) => {
        const hasFrom = bus.stops.some((stop) =>
          stop.toLowerCase().includes(fromLocation.toLowerCase()),
        );

        const hasTo = bus.stops.some((stop) =>
          stop.toLowerCase().includes(toLocation.toLowerCase()),
        );

        return (fromLocation === "" || hasFrom) && (toLocation === "" || hasTo);
      });

      setResults(filtered);

      setLoading(false);
    }, 1000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.title}>CU Pop Bus</Text>

        <Text style={styles.subtitle}>Smart campus transportation system</Text>
      </View>

      {/* SEARCH CARD */}

      <View style={styles.searchCard}>
        <View style={styles.inputGroup}>
          <IconSymbol name="pin" size={20} color="#ef4444" />

          <TextInput
            placeholder="From"
            value={fromLocation}
            onChangeText={setFromLocation}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <IconSymbol name="flag" size={20} color="#3b82f6" />

          <TextInput
            placeholder="To"
            value={toLocation}
            onChangeText={setToLocation}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={findRoutes}>
          <Text style={styles.buttonText}>Find Routes</Text>
        </TouchableOpacity>
      </View>

      {/* RESULTS */}

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
            <View style={[styles.routeBar, { backgroundColor: bus.color }]} />

            <Text style={styles.routeTitle}>{bus.line}</Text>

            <Text style={styles.routeStation}>{bus.stations} stations</Text>

            <Text style={styles.routeStops}>{bus.stops.join(" → ")}</Text>
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
    marginTop: 60,
    marginBottom: 30,
  },

  title: {
    color: COLORS.primary,
    ...TYPOGRAPHY.hero,
  },

  subtitle: {
    marginTop: 8,
    color: COLORS.muted,
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
    marginBottom: 18,
  },

  input: {
    flex: 1,
    padding: 16,
    marginLeft: 10,
    ...TYPOGRAPHY.body,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: COLORS.white,
    ...TYPOGRAPHY.button,
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
    lineHeight: 24,
    ...TYPOGRAPHY.body,
  },
});
