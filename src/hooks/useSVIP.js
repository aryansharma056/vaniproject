import { useState, useEffect } from "react";
import { fetchSVIPData } from "../data/svipData";
import { getTheme } from "../constants/svipThemes";

export const useSVIP = () => {
  const [activeLevel, setActiveLevel] = useState(1);
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchSVIPData();
        setData(result);
        setActiveLevel(result.currentLevel); // default to user's own level
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const currentLevelData = data?.levels?.find((l) => l.level === activeLevel);
  const theme            = getTheme(activeLevel);
  const privileges       = currentLevelData?.privileges ?? []; // ← comes straight from API now
  const isCurrentLevel   = activeLevel === data?.currentLevel;
  const pointsNeeded     = Math.max((currentLevelData?.pointsRequired ?? 0) - (data?.totalPoints ?? 0), 0);

  return {
    activeLevel,
    setActiveLevel,
    levels: data?.levels ?? [],
    currentLevelData,
    theme,
    privileges,
    isCurrentLevel,
    pointsNeeded,
    loading,
    error,
  };
};