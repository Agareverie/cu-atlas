import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Collapsible } from "@/components/ui/collapsible";
import { ThemedText } from "@/components/themed-text";

const COLORS = {
  background: "#f5f7fb",
  surface: "#ffffff",
  text: "#111827",
  secondaryText: "#374151",
  mutedText: "#6b7280",
  border: "#e5e7eb",
};

type Building = {
  _id: string;
  code: string;
  name_en: string;
  name_th: string;
  pronunciation_th: string;
  faculty: string;
};

export default function HomeScreen() {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={{ ...styles.heading, marginTop: 40 }}>
        List of Buildings
      </Text>

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
  },

  content: {
    padding: 20,
    gap: 16,
  },

  heading: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  cardContent: {
    marginTop: 12,
    gap: 4,
  },

  englishName: {
    fontSize: 20,
    color: COLORS.text,
  },

  thaiName: {
    fontSize: 18,
    color: COLORS.secondaryText,
  },

  pronunciation: {
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.mutedText,
  },

  faculty: {
    marginTop: 6,
    color: COLORS.secondaryText,
  },
});
