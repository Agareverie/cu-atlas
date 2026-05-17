export type Route = {
  _id: string;
  route_number: number;
  available_at_saturday: boolean;
  color: string;
  stops: string[];
  geometry: {
    type: "LineString";

    coordinates: number[][];
  };
};
