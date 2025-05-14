import { cities } from "@/data/cities";

export const getCityString = (city: string) => {
  if (!city) return "не указан";

  return cities.find((c) => c.value === city)?.label || "не указан";
};
