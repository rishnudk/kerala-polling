export type PartyKey = "UDF" | "LDF" | "NDA" | "IND";

export const parties: Record<
  PartyKey,
  {
    name:     string;
    fullName: string;
    leader:   string;
    color:    string;
    light:    string;
  }
> = {
  UDF: {
    name:     "UDF",
    fullName: "United Democratic Front",
    leader:   "Congress-led alliance",
    color:    "#1E90FF",
    light:    "#EBF5FF",
  },
  LDF: {
    name:     "LDF",
    fullName: "Left Democratic Front",
    leader:   "CPI(M)-led alliance",
    color:    "#FF3B30",
    light:    "#FFF0EF",
  },
  NDA: {
    name:     "NDA",
    fullName: "National Democratic Alliance",
    leader:   "BJP-led alliance",
    color:    "#FF8C00",
    light:    "#FFF4E5",
  },
  IND: {
    name:     "IND",
    fullName: "Independent",
    leader:   "Other candidates",
    color:    "#6B7280",
    light:    "#F3F4F6",
  },
};

export const PARTIES = Object.entries(parties).map(([id, p]) => ({
  id,
  ...p,
}));