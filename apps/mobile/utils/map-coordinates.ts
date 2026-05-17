export const getCentroid = (coords: number[][]): [number, number] => {
  const lats = coords.map(([, lat]) => lat);
  const lngs = coords.map(([lng]) => lng);
  return [
    (Math.min(...lats) + Math.max(...lats)) / 2,
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
  ];
};
