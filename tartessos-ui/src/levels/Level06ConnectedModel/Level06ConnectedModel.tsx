import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActivationCode } from "../../components/ActivationCode";
import { GameFrame } from "../../components/GameFrame";
import { HelpModal } from "../../components/HelpModal";
import { validateExercise6 } from "../../api/questApi";
import { IrisApiError } from "../../api/irisClient";
import { useGame } from "../../game/GameContext";

import level06Image from "../../assets/images/level06.png";
import styles from "./Level06ConnectedModel.module.css";
import {
  getBackendErrorMessage,
  type BackendErrorPayload,
} from "../../api/backendErrors";

const LEVEL_ID = "level-06-connected-model" as const;
const NEXT_LEVEL_ID = "level-07-sql-queries" as const;

type ConnectedModelSummary = {
  relationships?: {
    mortuarySarcophagus?: boolean;
    sarcophagusOffering?: boolean;
  };
  indexes?: {
    offeringClassification?: boolean;
  };
  validations?: {
    sarcophagus?: boolean;
    offering?: boolean;
  };
};

function getReadableStatus(
  value: boolean | undefined,
  t: (key: string) => string,
) {
  return value
    ? t("levels.level06.statusVerified")
    : t("levels.level06.statusPending");
}

export function Level06ConnectedModel() {
  const { t } = useTranslation();
  const { completeLevel, isLevelCompleted, progress } = useGame();

  const savedCode = progress?.activationCodes[LEVEL_ID] ?? null;
  const alreadyCompleted = isLevelCompleted(LEVEL_ID);

  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationCode, setValidationCode] = useState<string | null>(
    alreadyCompleted ? savedCode : null,
  );
  const [summary, setSummary] = useState<ConnectedModelSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReviewFinds() {
    setLoading(true);
    setError(null);

    try {
      const response = await validateExercise6();

      if (!response.success) {
        setError(
          getBackendErrorMessage(t, response.errorCode, "levels.level06.genericValidationError") ||
            t("levels.level06.genericValidationError"),
        );
        return;
      }

      setValidationCode(response.validationCode);
      setSummary({
        relationships: response.relationships,
        indexes: response.indexes,
        validations: response.validations,
      });

      completeLevel(LEVEL_ID, response.validationCode);
    } catch (error) {
      if (error instanceof IrisApiError) {
        const payload = error.payload as BackendErrorPayload | null;

        setError(
          getBackendErrorMessage(t, payload?.errorCode, "levels.level06.genericValidationError") ||
            t("levels.level06.genericValidationError"),
        );
        return;
      }

      setError(t("levels.level06.connectionError"));
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
          src={level06Image}
          alt={t("levels.level06.imageAlt")}
          className={styles.sceneImage}
        />

        <div className={styles.sceneCaption}>
          {validationCode
            ? t("levels.level06.captionCompleted")
            : t("levels.level06.captionInitial")}
        </div>
      </div>

      <section className={styles.panel}>
        {!validationCode ? (
          <>
            <h1>{t("levels.level06.title")}</h1>

            <p>{t("levels.level06.paragraph1")}</p>
            <p>{t("levels.level06.paragraph2")}</p>
            <p>{t("levels.level06.paragraph3")}</p>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={() => setHelpOpen(true)}
              >
                {t("levels.level06.helpButton")}
              </button>

              <button
                className={styles.primaryButton}
                onClick={handleReviewFinds}
                disabled={loading}
              >
                {loading
                  ? t("levels.level06.reviewingButton")
                  : t("levels.level06.reviewButton")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successPanel}>
            <h1>{t("levels.level06.successTitle")}</h1>

            <p>{t("levels.level06.successMessage")}</p>

            <div className={styles.findsSummary}>
              <p>{t("levels.level06.findsIntro")}</p>

              <ul className={styles.findsList}>
                <li>
                  {t("levels.level06.relationshipMortuarySarcophagus")}:{" "}
                  {getReadableStatus(
                    summary?.relationships?.mortuarySarcophagus,
                    t,
                  )}
                </li>
                <li>
                  {t("levels.level06.relationshipSarcophagusOffering")}:{" "}
                  {getReadableStatus(
                    summary?.relationships?.sarcophagusOffering,
                    t,
                  )}
                </li>
                <li>
                  {t("levels.level06.indexOfferingClassification")}:{" "}
                  {getReadableStatus(
                    summary?.indexes?.offeringClassification,
                    t,
                  )}
                </li>
                <li>
                  {t("levels.level06.validationSarcophagus")}:{" "}
                  {getReadableStatus(
                    summary?.validations?.sarcophagus,
                    t,
                  )}
                </li>
                <li>
                  {t("levels.level06.validationOffering")}:{" "}
                  {getReadableStatus(
                    summary?.validations?.offering,
                    t,
                  )}
                </li>
              </ul>
            </div>

            <ActivationCode
              label={t("levels.level06.activationCodeLabel")}
              code={validationCode}
            />
            <button
              className={styles.primaryButton}
              onClick={handleContinue}
            >
              {t("levels.level06.continueButton")}
            </button>
          </div>
        )}
      </section>

      {helpOpen && (
        <HelpModal
          title={t("levels.level06.helpTitle")}
          closeLabel={t("levels.level06.helpCloseButton")}
          onClose={() => setHelpOpen(false)}
        >
          <p>{t("levels.level06.helpIntro")}</p>

          <ol>
            <li>{t("levels.level06.helpStep1")}</li>
            <li>{t("levels.level06.helpStep2")}</li>
            <li>{t("levels.level06.helpStep3")}</li>
            <li>{t("levels.level06.helpStep4")}</li>
            <li>{t("levels.level06.helpStep5")}</li>
            <li>{t("levels.level06.helpStep6")}</li>
            <li>{t("levels.level06.helpStep7")}</li>
            <li>{t("levels.level06.helpStep8")}</li>
            <li>{t("levels.level06.helpStep9")}</li>
            <li>{t("levels.level06.helpStep10")}</li>
            <li>{t("levels.level06.helpStep11")}</li>
            <li>{t("levels.level06.helpStep12")}</li>
            <li>{t("levels.level06.helpStep13")}</li>
            <li>{t("levels.level06.helpStep14")}</li>
          </ol>

          <p>
            <strong>{t("levels.level06.helpExpectedTitle")}:</strong>{" "}
            {t("levels.level06.helpExpectedText")}
          </p>
        </HelpModal>
      )}
    </GameFrame>
  );
}