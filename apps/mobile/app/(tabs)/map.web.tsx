import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { COLORS } from "@/theme/colors";
import { TYPOGRAPHY } from "@/theme/typography";

export default function MapWebPage() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ThemedText style={styles.title}>Map Unavailable on Web</ThemedText>

        <ThemedText style={styles.description}>
          The interactive campus map is currently only supported on Android and
          iOS builds.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  card: {
    width: "100%",
    maxWidth: 500,

    backgroundColor: COLORS.surface,
    borderRadius: 28,

    paddingHorizontal: 28,
    paddingVertical: 32,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  title: {
    color: COLORS.primary,
    marginBottom: 12,

    ...TYPOGRAPHY.sectionTitle,
  },

  description: {
    color: COLORS.muted,
    lineHeight: 24,

    ...TYPOGRAPHY.body,
  },
});
