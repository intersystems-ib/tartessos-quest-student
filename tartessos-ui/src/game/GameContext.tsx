import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { GameProgress, LevelId } from "./gameTypes";

type GameContextValue = {
  progress: GameProgress | null;
  setProgress: (progress: GameProgress) => void;
  completeLevel: (
    levelId: LevelId,
    activationCode?: string,
    nextLevelId?: LevelId,
  ) => void;
  isLevelCompleted: (levelId: LevelId) => boolean;
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<GameProgress | null>(null);

  function completeLevel(
    levelId: LevelId,
    activationCode?: string,
    nextLevelId?: LevelId,
  ) {
    setProgress((current) => {
      if (!current) {
        return current;
      }

      const completedLevels = current.completedLevels.includes(levelId)
        ? current.completedLevels
        : [...current.completedLevels, levelId];

      return {
        ...current,
        currentLevel: nextLevelId ?? current.currentLevel,
        completedLevels,
        activationCodes: activationCode
          ? {
              ...current.activationCodes,
              [levelId]: activationCode,
            }
          : current.activationCodes,
      };
    });
  }

  function isLevelCompleted(levelId: LevelId) {
    return progress?.completedLevels.includes(levelId) ?? false;
  }

  const value = useMemo(
    () => ({
      progress,
      setProgress,
      completeLevel,
      isLevelCompleted,
    }),
    [progress],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }

  return context;
}