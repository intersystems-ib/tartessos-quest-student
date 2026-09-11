import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActivationCode } from "../../components/ActivationCode";
import { GameFrame } from "../../components/GameFrame";
import { HelpModal } from "../../components/HelpModal";
import { validateExercise1 } from "../../api/questApi";
import { useGame } from "../../game/GameContext";
import { IrisApiError } from "../../api/irisClient";
import {
  getBackendErrorMessage,
  type BackendErrorPayload,
} from "../../api/backendErrors";

import level01Image from "../../assets/images/level01.png";
import styles from "./Level01AdventurerRegistration.module.css";

const LEVEL_ID = "level-01-adventurer-registration" as const;
const NEXT_LEVEL_ID = "level-02-excavation-tools" as const;

export function Level01AdventurerRegistration() {
  const { t } = useTranslation();
  const { completeLevel, isLevelCompleted, progress } = useGame();

  const savedCode = progress?.activationCodes[LEVEL_ID] ?? null;
  const alreadyCompleted = isLevelCompleted(LEVEL_ID);

  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationCode, setValidationCode] = useState<string | null>(
    alreadyCompleted ? savedCode : null,
  );
  const [adventurerName, setAdventurerName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmitForm() {
    setLoading(true);
    setError(null);

    try {
      const response = await validateExercise1();

      if (!response.success) {
        setError(
          getBackendErrorMessage(
            t,
            response.errorCode,
            "levels.level01.genericValidationError",
          ),
        );
        return;
      }

      setValidationCode(response.validationCode);
      setAdventurerName(response.adventurerName ?? null);

      completeLevel(LEVEL_ID, response.validationCode);
    } catch (error) {
      if (error instanceof IrisApiError) {
        const payload = error.payload as BackendErrorPayload | null;

        setError(
          getBackendErrorMessage(
            t,
            payload?.errorCode,
            "levels.level01.genericValidationError",
          ),
        );
        return;
      }

      setError(t("levels.level01.connectionError"));
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
          src={level01Image}
          alt={t("levels.level01.imageAlt")}
          className={styles.sceneImage}
        />

        <div className={styles.sceneCaption}>
          {validationCode
            ? t("levels.level01.captionCompleted")
            : t("levels.level01.captionInitial")}
        </div>
      </div>

      <section className={styles.panel}>
        {!validationCode ? (
          <>
            <h1>{t("levels.level01.title")}</h1>

            <p>{t("levels.level01.paragraph1")}</p>
            <p>{t("levels.level01.paragraph2")}</p>
            <p>{t("levels.level01.paragraph3")}</p>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={() => setHelpOpen(true)}
              >
                {t("levels.level01.helpButton")}
              </button>

              <button
                className={styles.primaryButton}
                onClick={handleSubmitForm}
                disabled={loading}
              >
                {loading
                  ? t("levels.level01.submittingButton")
                  : t("levels.level01.submitButton")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successPanel}>
            <h1>{t("levels.level01.successTitle")}</h1>

            <p>{t("levels.level01.successMessage")}</p>

            {adventurerName && (
              <p>
                {t("levels.level01.adventurerNameLabel")}: {adventurerName}
              </p>
            )}

            <ActivationCode
              label={t("levels.level01.activationCodeLabel")}
              code={validationCode}
            />

            <button
              className={styles.primaryButton}
              onClick={handleContinue}
            >
              {t("levels.level01.continueButton")}
            </button>
          </div>
        )}
      </section>

      {helpOpen && (
        <HelpModal
          title={t("levels.level01.helpTitle")}
          closeLabel={t("levels.level01.helpCloseButton")}
          onClose={() => setHelpOpen(false)}
        >
          <p>{t("levels.level01.helpIntro")}</p>

          <ol>
            <li>{t("levels.level01.helpStep1")}</li>
            <li>{t("levels.level01.helpStep2")}</li>
            <li>{t("levels.level01.helpStep3")}</li>
            <li>{t("levels.level01.helpStep4")}</li>
            <li>{t("levels.level01.helpStep5")}</li>
          </ol>

          <p>
            <strong>{t("levels.level01.helpExpectedTitle")}:</strong>{" "}
            {t("levels.level01.helpExpectedText")}
          </p>
        </HelpModal>
      )}
    </GameFrame>
  );
}