export type Route = {
  _id: string;
  route_number: number;
  available_at_saturday: boolean;
  color: string;
  stops: Station[];
  geometry: {
    type: "LineString";

    coordinates: number[][];
  };
};

export type Station =
  | "sala"
  | "faculty_poli_sci"
  | "faculty_econ"
  | "faculty_sci"
  | "faculty_edu"
  | "faculty_law"
  | "faculty_med"
  | "faculty_vet_sci"
  | "faculty_pharm_sci"
  | "faculty_ahs"
  | "faculty_arch"
  | "faculty_arts"
  | "faculty_eng"
  | "school_pathumwan"
  | "school_triamudom"
  | "school_satitchula_elementary"
  | "school_satitchula_secondary"
  | "chalerm_phao_junction"
  | "lido"
  | "chamchuri_9"
  | "chula_stadium"
  | "dhamma_center"
  | "bldg_witthayaphatthana"
  | "bts_national_stadium"
  | "chulapat_13"
  | "chale"
  | "student_dormitory"
  | "office_university"
  | "u_center"
  | "samyan_market"
  | "im_park"
  | "cu_ihouse";
