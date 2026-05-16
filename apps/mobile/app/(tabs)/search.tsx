import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { COLORS } from "@/theme/colors";
import { SHADOWS } from "@/theme/shadows";
import { LAYOUT } from "@/theme/layout";
import { TYPOGRAPHY } from "@/theme/typography";

const screenWidth = Dimensions.get("window").width;

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [buildings, setBuildings] = useState<
    {
      _id: string;
      code: string;
      name_en: string;
      name_th: string;
      pronunciation_th: string;
      faculty: string;
    }[]
  >([]);

  useEffect(() => {
    fetch(
      Platform.OS === "android"
        ? "http://10.0.2.2:3000/buildings"
        : "http://localhost:3000/buildings",
    )
      .then((res) => res.json())
      .then((data) => {
        setBuildings(data.buildings);
      })
      .catch((err) => {
        setBuildings([]);
      });
  }, []);

  const filtered =
    search.trim() === ""
      ? []
      : buildings.filter(
          (building) =>
            building.code.toLowerCase().includes(search.toLowerCase()) ||
            building.faculty.toLowerCase().includes(search.toLowerCase()) ||
            building.name_en.toLowerCase().includes(search.toLowerCase()),
        );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HERO */}

      <View style={styles.hero}>
        <Text style={styles.title}>Search</Text>

        <Text style={styles.subtitle}>Find a building given a keyword</Text>
      </View>

      {/* SEARCH BAR */}

      <View style={styles.searchCard}>
        <View style={styles.searchRow}>
          <IconSymbol name="magnifyingglass" size={22} color="#6b7280" />

          <TextInput
            placeholder="Search building, faculty or abbreviation"
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
        </View>
      </View>

      {/* RESULTS */}
      <Text style={styles.sectionTitle}>Buildings</Text>

      {search === "" ? (
        <View style={styles.emptyCard}>
          <IconSymbol name="magnifyingglass" size={55} color="#d1d5db" />

          <Text style={styles.emptyText}>Search buildings to begin</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyCard}>
          <IconSymbol name="nosign" size={55} color="#d1d5db" />

          <Text style={styles.emptyText}>No buildings match</Text>
        </View>
      ) : (
        filtered.map((building, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.codeBox}>
              <Text style={styles.code}>{building.code}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.buildingName}>{building.name_en}</Text>

              <Text style={styles.faculty}>{building.faculty}</Text>
            </View>
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

  searchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 18,
    marginBottom: 35,

    ...SHADOWS.card,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    marginLeft: 12,
    color: COLORS.muted,
    ...TYPOGRAPHY.body,
  },

  sectionTitle: {
    marginBottom: 20,
    color: COLORS.primary,
    ...TYPOGRAPHY.sectionTitle,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",

    ...SHADOWS.card,
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

  codeBox: {
    width: 70,
    height: 70,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  code: {
    color: COLORS.white,
    ...TYPOGRAPHY.button,
  },

  buildingName: {
    color: COLORS.primary,
    ...TYPOGRAPHY.cardTitle,
  },

  faculty: {
    marginTop: 4,
    color: COLORS.muted,
    ...TYPOGRAPHY.caption,
  },
});
