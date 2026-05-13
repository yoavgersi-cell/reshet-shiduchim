export const SECTOR_LABELS: Record<string, string> = {
  HAREDI: "חרדי",
  DATI: "דתי-לאומי",
  MASORTI: "מסורתי",
  HILONI: "חילוני",
  OTHER: "אחר",
};

export const GENDER_LABELS: Record<string, string> = {
  MALE: "גבר",
  FEMALE: "אישה",
};

export const ETHNICITY_LABELS: Record<string, string> = {
  ASHKENAZI: "אשכנזי",
  SEPHARDI: "ספרדי",
  YEMENITE: "תימני",
  MIZRAHI: "מזרחי",
  OTHER: "אחר",
};

export const MARITAL_STATUS_LABELS: Record<string, string> = {
  SINGLE: "רווק/ה",
  DIVORCED: "גרוש/ה",
  WIDOWED: "אלמן/ה",
};

export const KASHRUT_LABELS: Record<string, string> = {
  MEHADRIN: "מהדרין",
  HALAK: "חלק",
  REGULAR: "רגיל",
};

export const HEAD_COVERING_LABELS: Record<string, string> = {
  MITPACHAT: "מטפחת",
  PEYAH: "פאה",
  KOVA: "כובע",
  NONE: "לא",
};

export const LEARNING_STATUS_LABELS: Record<string, string> = {
  LEARNING: "לומד בכולל",
  WORKING: "עובד",
  BOTH: "לומד ועובד",
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
