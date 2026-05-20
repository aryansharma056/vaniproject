/**
 * useSVIP — Custom hook
 *
 * Manages active tab level, loading state, and data fetching.
 * Swap fetchSVIPData() body to connect to your real API.
 */
import { useState, useEffect } from "react";
import { fetchSVIPData, getPrivilegesForLevel } from "../data/svipData";
import { getTheme } from "../constants/svipThemes";

export const useSVIP = () => {
  const [activeLevel, setActiveLevel]   = useState(1);
  const [data, setData]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchSVIPData();
        setData(result);
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
  const privileges       = getPrivilegesForLevel(activeLevel);
  const isCurrentLevel   = activeLevel === data?.currentLevel;
  const pointsNeeded     = currentLevelData?.pointsRequired ?? 0;

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