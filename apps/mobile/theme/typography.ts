import { TextStyle } from "react-native";

export const TYPOGRAPHY: Record<string, TextStyle> = {
  display: {
    fontSize: 58,
    fontWeight: "700",
    lineHeight: 64,
  },

  hero: {
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 48,
  },

  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 38,
  },

  h2: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 26,
  },

  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },

  secondary: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
  },

  caption: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
  },

  italic: {
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 18,
  },
};