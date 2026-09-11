import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActivationCode } from "../../components/ActivationCode";
import { GameFrame } from "../../components/GameFrame";
import { HelpModal } from "../../components/HelpModal";
import { validateExercise3 } from "../../api/questApi";
import { IrisApiError } from "../../api/irisClient";
import { useGame } from "../../game/GameContext";

import level03Image from "../../assets/images/level03.png";
import styles from "./Level03ChamberModel.module.css";

import {
  getBackendErrorMessage,
  type BackendErrorPayload,
} from "../../api/backendErrors";

const LEVEL_ID = "level-03-chamber-model" as const;
const NEXT_LEVEL_ID = "level-04-notebook" as const;

export function Level03ChamberModel() {
  const { t } = useTranslation();
  const { completeLevel, isLevelCompleted, progress } = useGame();

  const savedCode = progress?.activationCodes[LEVEL_ID] ?? null;
  const alreadyCompleted = isLevelCompleted(LEVEL_ID);

  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationCode, setValidationCode] = useState<string | null>(
    alreadyCompleted ? savedCode : null,
  );
  const [error, setError] = useState<string | null>(null);

  async function handleReviewMap() {
    setLoading(true);
    setError(null);

    try {
      const response = await validateExercise3();

      if (!response.success) {
        setError(
          getBackendErrorMessage(t, response.errorCode, "levels.level03.genericValidationError") ||
            t("levels.level03.genericValidationError"),
        );
        return;
      }

      setValidationCode(response.validationCode);

      completeLevel(LEVEL_ID, response.validationCode);
    } catch (error) {
      if (error instanceof IrisApiError) {
        const payload = error.payload as BackendErrorPayload | null;

        setError(
          getBackendErrorMessage(t, payload?.errorCode, "levels.level03.genericValidationError") ||
            t("levels.level03.genericValidationError"),
        );
        return;
      }

      setError(t("levels.level03.connectionError"));
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
          src={level03Image}
          alt={t("levels.level03.imageAlt")}
          className={styles.sceneImage}
        />

        <div className={styles.sceneCaption}>
          {validationCode
            ? t("levels.level03.captionCompleted")
            : t("levels.level03.captionInitial")}
        </div>
      </div>

      <section className={styles.panel}>
        {!validationCode ? (
          <>
            <h1>{t("levels.level03.title")}</h1>

            <p>{t("levels.level03.paragraph1")}</p>
            <p>{t("levels.level03.paragraph2")}</p>
            <p>{t("levels.level03.paragraph3")}</p>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={() => setHelpOpen(true)}
              >
                {t("levels.level03.helpButton")}
              </button>

              <button
                className={styles.primaryButton}
                onClick={handleReviewMap}
                disabled={loading}
              >
                {loading
                  ? t("levels.level03.reviewingButton")
                  : t("levels.level03.reviewButton")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successPanel}>
            <h1>{t("levels.level03.successTitle")}</h1>

            <p>{t("levels.level03.successMessage")}</p>

            <div className={styles.modelSummary}>
                <p>{t("levels.level03.recognizedChambersIntro")}</p>

                <ul className={styles.classList}>
                    <li>{t("levels.level03.chamberTypeCorridor")}</li>
                    <li>{t("levels.level03.chamberTypeHall")}</li>
                    <li>{t("levels.level03.chamberTypeMortuary")}</li>
                    <li>{t("levels.level03.chamberTypeStorage")}</li>
                </ul>
            </div>

            <ActivationCode
              label={t("levels.level03.activationCodeLabel")}
              code={validationCode}
            />
            <button
                className={styles.primaryButton}
                onClick={handleContinue}
                >
                {t("levels.level03.continueButton")}
            </button>
          </div>
        )}
      </section>

      {helpOpen && (
        <HelpModal
          title={t("levels.level03.helpTitle")}
          closeLabel={t("levels.level03.helpCloseButton")}
          onClose={() => setHelpOpen(false)}
        >
          <p>{t("levels.level03.helpIntro")}</p>

          <ol>
            <li>{t("levels.level03.helpStep1")}</li>
            <li>{t("levels.level03.helpStep2")}</li>
            <li>{t("levels.level03.helpStep3")}</li>
            <li>{t("levels.level03.helpStep4")}</li>
            <li>{t("levels.level03.helpStep5")}</li>
            <li>{t("levels.level03.helpStep6")}</li>
            <li>{t("levels.level03.helpStep7")}</li>
            <li>{t("levels.level03.helpStep8")}</li>
            <li>{t("levels.level03.helpStep9")}</li>
          </ol>

          <p>
            <strong>{t("levels.level03.helpExpectedTitle")}:</strong>{" "}
            {t("levels.level03.helpExpectedText")}
          </p>
        </HelpModal>
      )}
    </GameFrame>
  );
}