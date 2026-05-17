import { Building } from "@/types/building";

const FACULTY_COLOR_RGB: Record<string, number[]> = {
  Engineering: [164, 49, 42], // Firebrick
  Arts: [128, 128, 128], // Grey
  Science: [206, 191, 26], // Yellow
  Architecture: [152, 53, 48], // Brown
  Economics: [249, 217, 73], // Gold
  "Political Science": [0, 0, 0], // Black
  "Sports Science": [239, 134, 51], // Orange
  Other: [245, 194, 203], // Pink
};

export const facultyFillColor = (building: Building) => {
  const rgbArray =
    FACULTY_COLOR_RGB[building.faculty] ?? FACULTY_COLOR_RGB["Other"];
  return `rgba(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]}, 0.25)`;
};

export const facultyStrokeColor = (building: Building) => {
  const rgbArray =
    FACULTY_COLOR_RGB[building.faculty] ?? FACULTY_COLOR_RGB["Other"];
  return `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
};