import { useEffect, useState } from "react";
import { getQuestProgress } from "../api/questApi";
import { LoadingScreen } from "../components/LoadingScreen";
import { CurrentLevel } from "./CurrentLevel";
import { useGame } from "./GameContext";
import type { GameProgress } from "./gameTypes";

export function GameLoader() {
  const { progress, setProgress } = useGame();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGame() {
      try {
        const apiProgress = await getQuestProgress();

        if (cancelled) {
          return;
        }

        const loadedProgress: GameProgress = {
          currentLevel: apiProgress.currentLevel,
          completedLevels: apiProgress.completedLevels,
          activationCodes: apiProgress.activationCodes ?? {},
        };

        setProgress(loadedProgress);
      } catch {
        if (!cancelled) {
          setError("No se ha podido cargar la partida.");
        }
      }
    }

    loadGame();

    return () => {
      cancelled = true;
    };
  }, [setProgress]);

  if (error) {
    return <LoadingScreen message={error} />;
  }

  if (!progress) {
    return <LoadingScreen message="Buscando señales de IRIS..." />;
  }

  return <CurrentLevel />;
}