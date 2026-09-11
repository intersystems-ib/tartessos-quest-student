import { useTranslation } from "react-i18next";
import { GameFrame } from "../../components/GameFrame";
import { useGame } from "../../game/GameContext";
import level00Image from "../../assets/images/level00.png";
import styles from "./Level00Intro.module.css";

const LEVEL_ID = "level-00-intro" as const;
const NEXT_LEVEL_ID = "level-01-adventurer-registration" as const;

export function Level00Intro() {
  const { t } = useTranslation();
  const { completeLevel } = useGame();

  function handleStartExpedition() {
    completeLevel(LEVEL_ID, undefined, NEXT_LEVEL_ID);
  }

  return (
    <GameFrame>
      <div className={styles.scene}>
        <img
          src={level00Image}
          alt={t("levels.level00.imageAlt")}
          className={styles.sceneImage}
        />

        <div className={styles.sceneCaption}>
          {t("levels.level00.captionInitial")}
        </div>
      </div>

      <section className={styles.panel}>
        <h1>{t("levels.level00.title")}</h1>

        <p>{t("levels.level00.paragraph1")}</p>
        <p>{t("levels.level00.paragraph2")}</p>
        <p>{t("levels.level00.paragraph3")}</p>
        <p>{t("levels.level00.paragraph4")}</p>

        <button
          className={styles.primaryButton}
          onClick={handleStartExpedition}
        >
          {t("levels.level00.startButton")}
        </button>
      </section>
    </GameFrame>
  );
}