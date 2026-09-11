export type LevelId =
  | "level-00-intro"
  | "level-01-adventurer-registration"
  | "level-02-excavation-tools"
  | "level-03-chamber-model"
  | "level-04-notebook"
  | "level-05-persistent-chambers"
  | "level-06-connected-model"
  | "level-07-sql-queries"
  | "level-08-class-queries"
  | "level-09-rest-api"
  | "level-10-embedded-python"
  | "level-11-discovery-chronicle";
  
export type GameProgress = {
  currentLevel: LevelId;
  completedLevels: LevelId[];
  activationCodes: Record<string, string>;
};

export type QuestApiProgressResponse = {
  currentLevel: LevelId;
  completedLevels: LevelId[];
  activationCodes?: Partial<Record<LevelId, string>>;
};