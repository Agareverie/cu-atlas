import { Platform } from "react-native";

export const SHADOWS = {
  card: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.30)",
      },
    }),
  },

  soft: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.50)",
      },
    }),
  },
};
