export type PartyKey = "UDF" | "LDF" | "NDA" | "IND";

export const parties: Record<
  PartyKey,
  {
    name: string;
    color: string;
    fullName: string;
  }
> = {
  UDF: {
    name: "UDF",
    fullName: "United Democratic Front",
    color: "#1E90FF", // blue
  },
  LDF: {
    name: "LDF",
    fullName: "Left Democratic Front",
    color: "#FF3B30", // red
  },
  NDA: {
    name: "NDA",
    fullName: "National Democratic Alliance",
    color: "#FF8C00", // orange
  },
  IND: {
    name: "IND",
    fullName: "Independent",
    color: "#6B7280", // gray
  },
};