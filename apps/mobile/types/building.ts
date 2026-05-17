export type Building = {
  _id: string;
  code: string;
  name_en: string;
  name_th: string;
  pronunciation_th: string;
  faculty: string;
  geometry: {
    type: "Polygon";

    coordinates: number[][][];
  };
};
