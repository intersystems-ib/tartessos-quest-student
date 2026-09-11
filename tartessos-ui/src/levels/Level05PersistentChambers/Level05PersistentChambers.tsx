import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActivationCode } from "../../components/ActivationCode";
import { GameFrame } from "../../components/GameFrame";
import { HelpModal } from "../../components/HelpModal";
import { validateExercise5 } from "../../api/questApi";
import { IrisApiError } from "../../api/irisClient";
import { useGame } from "../../game/GameContext";

import level05Image from "../../assets/images/level05.png";
import styles from "./Level05PersistentChambers.module.css";

import {
  getBackendErrorMessage,
  type BackendErrorPayload,
} from "../../api/backendErrors";

const LEVEL_ID = "level-05-persistent-chambers" as const;
const NEXT_LEVEL_ID = "level-06-connected-model" as const;

type PersistentChambersSummary = {
  hallRelevant?: boolean;
  mortuaryRelevant?: boolean;
  storageRelevant?: boolean;
  corridorRelevant?: boolean;
};

function getReadableRelevance(
  value: boolean | undefined,
  t: (key: string) => string,
) {
  return value
    ? t("levels.level05.relevantYes")
    : t("levels.level05.relevantNo");
}

export function Level05PersistentChambers() {
  const { t } = useTranslation();
  const { completeLevel, isLevelCompleted, progress } = useGame();

  const savedCode = progress?.activationCodes[LEVEL_ID] ?? null;
  const alreadyCompleted = isLevelCompleted(LEVEL_ID);

  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationCode, setValidationCode] = useState<string | null>(
    alreadyCompleted ? savedCode : null,
  );
  const [persistentChambers, setPersistentChambers] =
    useState<PersistentChambersSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReviewRegistry() {
    setLoading(true);
    setError(null);

    try {
      const response = await validateExercise5();

      if (!response.success) {
        setError(
          getBackendErrorMessage(t, response.errorCode, "levels.level05.genericValidationError") ||
            t("levels.level05.genericValidationError"),
        );
        return;
      }

      setValidationCode(response.validationCode);
      setPersistentChambers(response.persistentChambers ?? null);

      completeLevel(LEVEL_ID, response.validationCode);
    } catch (error) {
      if (error instanceof IrisApiError) {
        const payload = error.payload as BackendErrorPayload | null;

        setError(
          getBackendErrorMessage(t, payload?.errorCode, "levels.level05.genericValidationError") ||
            t("levels.level05.genericValidationError"),
        );
        return;
      }

      setError(t("levels.level05.connectionError"));
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
          src={level05Image}
          alt={t("levels.level05.imageAlt")}
          className={styles.sceneImage}
        />

        <div className={styles.sceneCaption}>
          {validationCode
            ? t("levels.level05.captionCompleted")
            : t("levels.level05.captionInitial")}
        </div>
      </div>

      <section className={styles.panel}>
        {!validationCode ? (
          <>
            <h1>{t("levels.level05.title")}</h1>

            <p>{t("levels.level05.paragraph1")}</p>
            <p>{t("levels.level05.paragraph2")}</p>
            <p>{t("levels.level05.paragraph3")}</p>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={() => setHelpOpen(true)}
              >
                {t("levels.level05.helpButton")}
              </button>

              <button
                className={styles.primaryButton}
                onClick={handleReviewRegistry}
                disabled={loading}
              >
                {loading
                  ? t("levels.level05.reviewingButton")
                  : t("levels.level05.reviewButton")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successPanel}>
            <h1>{t("levels.level05.successTitle")}</h1>

            <p>{t("levels.level05.successMessage")}</p>

            <div className={styles.registrySummary}>
              <p>{t("levels.level05.registryIntro")}</p>

              <ul className={styles.registryList}>
                <li>
                  {t("levels.level05.hallLabel")}:{" "}
                  {getReadableRelevance(
                    persistentChambers?.hallRelevant,
                    t,
                  )}
                </li>
                <li>
                  {t("levels.level05.mortuaryLabel")}:{" "}
                  {getReadableRelevance(
                    persistentChambers?.mortuaryRelevant,
                    t,
                  )}
                </li>
                <li>
                  {t("levels.level05.storageLabel")}:{" "}
                  {getReadableRelevance(
                    persistentChambers?.storageRelevant,
                    t,
                  )}
                </li>
                <li>
                  {t("levels.level05.corridorLabel")}:{" "}
                  {getReadableRelevance(
                    persistentChambers?.corridorRelevant,
                    t,
                  )}
                </li>
              </ul>
            </div>

            <ActivationCode
              label={t("levels.level05.activationCodeLabel")}
              code={validationCode}
            />
            <button
              className={styles.primaryButton}
              onClick={handleContinue}
            >
              {t("levels.level05.continueButton")}
            </button>
          </div>
        )}
      </section>

      {helpOpen && (
        <HelpModal
          title={t("levels.level05.helpTitle")}
          closeLabel={t("levels.level05.helpCloseButton")}
          onClose={() => setHelpOpen(false)}
        >
          <p>{t("levels.level05.helpIntro")}</p>

          <ol>
            <li>{t("levels.level05.helpStep1")}</li>
            <li>{t("levels.level05.helpStep2")}</li>
            <li>{t("levels.level05.helpStep3")}</li>
            <li>{t("levels.level05.helpStep4")}</li>
            <li>{t("levels.level05.helpStep5")}</li>
            <li>{t("levels.level05.helpStep6")}</li>
            <li>{t("levels.level05.helpStep7")}</li>
            <li>{t("levels.level05.helpStep8")}</li>
            <li>{t("levels.level05.helpStep9")}</li>
            <li>{t("levels.level05.helpStep10")}</li>
            <li>{t("levels.level05.helpStep11")}</li>
            <li>{t("levels.level05.helpStep12")}</li>
            <li>{t("levels.level05.helpStep13")}</li>
            <li>{t("levels.level05.helpStep14")}</li>
            <li>{t("levels.level05.helpStep15")}</li>
          </ol>

          <p>
            <strong>{t("levels.level05.helpExpectedTitle")}:</strong>{" "}
            {t("levels.level05.helpExpectedText")}
          </p>
        </HelpModal>
      )}
    </GameFrame>
  );
}