import { Level00Intro } from "../levels/Level00Intro";
import { Level01AdventurerRegistration } from "../levels/Level01AdventurerRegistration";
import { Level02ExcavationTools } from "../levels/Level02ExcavationTools";
import { Level03ChamberModel } from "../levels/Level03ChamberModel";
import { Level04Notebook } from "../levels/Level04Notebook";
import { Level05PersistentChambers } from "../levels/Level05PersistentChambers";
import { Level06ConnectedModel } from "../levels/Level06ConnectedModel";
import { Level07SqlQueries } from "../levels/Level07SqlQueries";
import { Level08ClassQueries } from "../levels/Level08ClassQueries";
import { Level09RestApi } from "../levels/Level09RestApi";
import { Level10EmbeddedPython } from "../levels/Level10EmbeddedPython";
import { Level11DiscoveryChronicle } from "../levels/Level11DiscoveryChronicle";
import { useGame } from "./GameContext";

export function CurrentLevel() {
  const { progress } = useGame();

  switch (progress?.currentLevel) {
    case "level-00-intro":
      return <Level00Intro />;

    case "level-01-adventurer-registration":
      return <Level01AdventurerRegistration />;

    case "level-02-excavation-tools":
      return <Level02ExcavationTools />;

    case "level-03-chamber-model":
      return <Level03ChamberModel />;

    case "level-04-notebook":
      return <Level04Notebook />;

    case "level-05-persistent-chambers":
      return <Level05PersistentChambers />;

    case "level-06-connected-model":
      return <Level06ConnectedModel />;

    case "level-07-sql-queries":
      return <Level07SqlQueries />;

    case "level-08-class-queries":
      return <Level08ClassQueries />;

    case "level-09-rest-api":
      return <Level09RestApi />;

    case "level-10-embedded-python":
      return <Level10EmbeddedPython />;

    case "level-11-discovery-chronicle":
      return <Level11DiscoveryChronicle />; 

    default:
      return <Level00Intro />;
  }
}