import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActivationCode } from "../../components/ActivationCode";
import { GameFrame } from "../../components/GameFrame";
import { HelpModal } from "../../components/HelpModal";
import { validateExercise2 } from "../../api/questApi";
import { IrisApiError } from "../../api/irisClient";
import { useGame } from "../../game/GameContext";

import level02Image from "../../assets/images/level02.png";
import styles from "./Level02ExcavationTools.module.css";

import {
  getBackendErrorMessage,
  type BackendErrorPayload,
} from "../../api/backendErrors";

const LEVEL_ID = "level-02-excavation-tools" as const;
const NEXT_LEVEL_ID = "level-03-chamber-model" as const;

type ExcavationKit = {
  trowel?: number;
  hat?: number;
  flashlight?: number;
  batteries?: number;
};

export function Level02ExcavationTools() {
  const { t } = useTranslation();
  const { completeLevel, isLevelCompleted, progress } = useGame();

  const savedCode = progress?.activationCodes[LEVEL_ID] ?? null;
  const alreadyCompleted = isLevelCompleted(LEVEL_ID);

  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationCode, setValidationCode] = useState<string | null>(
    alreadyCompleted ? savedCode : null,
  );
  const [kit, setKit] = useState<ExcavationKit | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReviewKit() {
    setLoading(true);
    setError(null);

    try {
      const response = await validateExercise2();

      if (!response.success) {
        setError(
          getBackendErrorMessage(t, response.errorCode, "levels.level02.genericValidationError")  ||
            t("levels.level02.genericValidationError"),
        );
        return;
      }

      setValidationCode(response.validationCode);
      setKit(response.kit ?? null);

      completeLevel(LEVEL_ID, response.validationCode);
    } catch (error) {
      if (error instanceof IrisApiError) {
        const payload = error.payload as BackendErrorPayload | null;

        setError(
          getBackendErrorMessage(t, payload?.errorCode, "levels.level02.genericValidationError") ||
            t("levels.level02.genericValidationError"),
        );
        return;
      }

      setError(t("levels.level02.connectionError"));
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    completeLevel(LEVEL_ID, validationCode ?? undefined, NEXT_LEVEL_ID);
  }

  return (
    <GameFrame>
      <div className={styles.scene}>
        <img
          src={level02Image}
          alt={t("levels.level02.imageAlt")}
          className={styles.sceneImage}
        />

        <div className={styles.sceneCaption}>
          {validationCode
            ? t("levels.level02.captionCompleted")
            : t("levels.level02.captionInitial")}
        </div>
      </div>

      <section className={styles.panel}>
        {!validationCode ? (
          <>
            <h1>{t("levels.level02.title")}</h1>

            <p>{t("levels.level02.paragraph1")}</p>
            <p>{t("levels.level02.paragraph2")}</p>
            <p>{t("levels.level02.paragraph3")}</p>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={() => setHelpOpen(true)}
              >
                {t("levels.level02.helpButton")}
              </button>

              <button
                className={styles.primaryButton}
                onClick={handleReviewKit}
                disabled={loading}
              >
                {loading
                  ? t("levels.level02.reviewingButton")
                  : t("levels.level02.reviewButton")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successPanel}>
            <h1>{t("levels.level02.successTitle")}</h1>

            <p>{t("levels.level02.successMessage")}</p>

            {kit && (
              <ul className={styles.kitList}>
                <li>
                  {t("levels.level02.toolTrowel")}: {kit.trowel ?? 0}
                </li>
                <li>
                  {t("levels.level02.toolHat")}: {kit.hat ?? 0}
                </li>
                <li>
                  {t("levels.level02.toolFlashlight")}:{" "}
                  {kit.flashlight ?? 0}
                </li>
                <li>
                  {t("levels.level02.toolBatteries")}:{" "}
                  {kit.batteries ?? 0}
                </li>
              </ul>
            )}

            <ActivationCode
              label={t("levels.level02.activationCodeLabel")}
              code={validationCode}
            />
            <button
              className={styles.primaryButton}
              onClick={handleContinue}
            >
              {t("levels.level02.continueButton")}
            </button>
          </div>
        )}
      </section>

      {helpOpen && (
        <HelpModal
          title={t("levels.level02.helpTitle")}
          closeLabel={t("levels.level02.helpCloseButton")}
          onClose={() => setHelpOpen(false)}
        >
          <p>{t("levels.level02.helpIntro")}</p>

          <ol>
            <li>{t("levels.level02.helpStep1")}</li>
            <li>{t("levels.level02.helpStep2")}</li>
            <li>{t("levels.level02.helpStep3")}</li>
            <li>{t("levels.level02.helpStep4")}</li>
            <li>{t("levels.level02.helpStep5")}</li>
            <li>{t("levels.level02.helpStep6")}</li>
            <li>{t("levels.level02.helpStep7")}</li>
          </ol>

          <p>
            <strong>{t("levels.level02.helpExpectedTitle")}:</strong>{" "}
            {t("levels.level02.helpExpectedText")}
          </p>
        </HelpModal>
      )}
    </GameFrame>
  );
}