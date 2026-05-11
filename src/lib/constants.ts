export const SECTOR_LABELS: Record<string, string> = {
  HAREDI: "חרדי",
  DATI: "דתי",
  MASORTI: "מסורתי",
  HILONI: "חילוני",
  OTHER: "אחר",
};

export const GENDER_LABELS: Record<string, string> = {
  MALE: "גבר",
  FEMALE: "אישה",
};

export const MATCH_STATUS_LABELS: Record<string, string> = {
  SUGGESTED: "הוצע",
  REVIEWING: "בבדיקה",
  APPROVED: "אושר",
  DATING: "בפגישות",
  CLOSED: "נסגר",
};

export const MATCH_STATUS_ORDER = [
  "SUGGESTED",
  "REVIEWING",
  "APPROVED",
  "DATING",
  "CLOSED",
] as const;

export const MATCH_STATUS_COLORS: Record<string, string> = {
  SUGGESTED: "bg-gray-100 text-gray-700",
  REVIEWING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  DATING: "bg-green-100 text-green-800",
  CLOSED: "bg-red-100 text-red-700",
};
