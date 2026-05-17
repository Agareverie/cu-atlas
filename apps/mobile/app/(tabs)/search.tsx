import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
  Image,
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(
      Platform.OS === "android"
        ? "http://10.0.2.2:3000/buildings"
        : "http://localhost:3000/buildings",
    )
      .then((res) => res.json())
      .then((data) => {
        setBuildings(data.buildings);
        setLoading(false);
      })
      .catch(() => {
        setBuildings([]);
        setLoading(false);
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
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
          }}
          style={styles.heroImage}
        />

        <Text style={styles.title}>BUILDING SEARCH</Text>

        <Text style={styles.subtitle}>
          Find any building across campus instantly
        </Text>
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
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* RESULTS */}
      <Text style={styles.sectionTitle}>Buildings</Text>

      {loading ? (
        <>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.skeletonCard}>
              <View style={styles.skeletonCode} />

              <View style={{ flex: 1 }}>
                <View style={styles.skeletonLineLarge} />
                <View style={styles.skeletonLineSmall} />
              </View>
            </View>
          ))}
        </>
      ) : search === "" ? (
        <View style={styles.emptyCard}>
          <IconSymbol name="magnifyingglass" size={55} color="#d1d5db" />

          <Text style={styles.emptyText}>Search buildings to begin</Text>

          <Text style={styles.emptySubtext}>
            Try searching ENG4, BRK, CHALE or faculty names
          </Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyCard}>
          <IconSymbol name="nosign" size={55} color="#d1d5db" />

          <Text style={styles.emptyText}>No buildings match</Text>

          <Text style={styles.emptySubtext}>
            Check spelling or try another keyword
          </Text>
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

  /* HERO */
  hero: {
    marginBottom: 50,
    backgroundColor: "#d9468f",
    paddingTop: 70,
    paddingBottom: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: "center",
    overflow: "hidden",
  },

  heroImage: {
    position: "absolute",
    width: 180,
    height: 180,
    opacity: 0.15,
    right: -20,
    top: 20,
  },

  title: {
    color: "white",
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 1,
  },

  subtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    paddingHorizontal: 20,
    ...TYPOGRAPHY.body,
  },

  /* SEARCH CARD */
  searchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 18,
    marginTop: -20,
    marginBottom: 25,
    ...SHADOWS.card,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 14,
    color: COLORS.primary,
    ...TYPOGRAPHY.body,
  },

  sectionTitle: {
    marginBottom: 20,
    color: COLORS.primary,
    ...TYPOGRAPHY.sectionTitle,
  },

  /* RESULT CARD */
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.card,
  },

  codeBox: {
    width: 70,
    height: 70,
    backgroundColor: "#d9468f",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  code: {
    color: COLORS.white,
    ...TYPOGRAPHY.button,
    fontWeight: "800",
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

  /* EMPTY STATES */
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
    textAlign: "center",
    ...TYPOGRAPHY.body,
  },

  emptySubtext: {
    marginTop: 10,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 22,
    ...TYPOGRAPHY.caption,
  },

  /* SKELETON LOADING */
  skeletonCard: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.card,
  },

  skeletonCode: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: "#e5e7eb",
    marginRight: 18,
  },

  skeletonLineLarge: {
    height: 18,
    width: "75%",
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    marginBottom: 12,
  },

  skeletonLineSmall: {
    height: 14,
    width: "45%",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
  },
});
