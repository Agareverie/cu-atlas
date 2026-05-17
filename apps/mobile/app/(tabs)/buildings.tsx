import { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";

import { Collapsible } from "@/components/ui/collapsible";
import { ThemedText } from "@/components/themed-text";
import { COLORS } from "@/theme/colors";
import { SHADOWS } from "@/theme/shadows";
import { LAYOUT } from "@/theme/layout";
import { TYPOGRAPHY } from "@/theme/typography";

type Building = {
  _id: string;
  code: string;
  name_en: string;
  name_th: string;
  pronunciation_th: string;
  faculty: string;
};

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const [buildings, setBuildings] = useState<Building[]>([]);

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
      .catch(console.error);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* HERO */}
      <View style={styles.hero}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/854/854876.png",
          }}
          style={styles.heroImage}
        />


        <Text style={styles.title}>BUILDINGS LIST</Text>

        <Text style={styles.subtitle}>
          Understand what each building code means
        </Text>
      </View>
      {buildings.map((building) => (
        <View key={building._id} style={styles.card}>
          <Collapsible title={building.code}>
            <View style={styles.cardContent}>
              <ThemedText type="defaultSemiBold" style={styles.englishName}>
                {building.name_en}
              </ThemedText>

              <ThemedText style={styles.thaiName}>
                {building.name_th}
              </ThemedText>

              <Text style={styles.pronunciation}>
                ({building.pronunciation_th})
              </Text>

              <ThemedText style={styles.faculty}>
                {building.faculty === "BASCii"
                  ? "School of Integrated Innovation"
                  : building.faculty === "Other"
                    ? "Other"
                    : `Faculty of ${building.faculty}`}
              </ThemedText>
            </View>
          </Collapsible>
        </View>
      ))}
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

  content: {
    gap: 16,
    paddingBottom: 32,
  },

  /* HERO */
  hero: {
    marginBottom: 15,
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

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },

  cardContent: {
    marginTop: 12,
    gap: 4,
  },

  englishName: {
    fontSize: 20,
    color: COLORS.primary,
  },

  thaiName: {
    fontSize: 18,
    color: COLORS.secondary,
  },

  pronunciation: {
    fontStyle: "italic",
    color: COLORS.muted,
  },

  faculty: {
    marginTop: 6,
    color: COLORS.secondary,
  },
});
