import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActivationCode } from "../../components/ActivationCode";
import { GameFrame } from "../../components/GameFrame";
import { HelpModal } from "../../components/HelpModal";
import { validateExercise8 } from "../../api/questApi";
import { IrisApiError } from "../../api/irisClient";
import {
  getBackendErrorMessage,
  type BackendErrorPayload,
} from "../../api/backendErrors";
import { useGame } from "../../game/GameContext";

import level08Image from "../../assets/images/level08.png";
import styles from "./Level08ClassQueries.module.css";

const LEVEL_ID = "level-08-class-queries" as const;
const NEXT_LEVEL_ID = "level-09-rest-api" as const;

type ClassQueriesSummary = {
  queries?: {
    sarcophagus?: boolean;
    offering?: boolean;
    all?: boolean;
  };
  values?: {
    sarcophagusRows?: number;
    offeringRows?: number;
    allRows?: number;
  };
};

function getReadableStatus(
  value: boolean | undefined,
  t: (key: string) => string,
) {
  return value
    ? t("levels.level08.statusVerified")
    : t("levels.level08.statusPending");
}

export function Level08ClassQueries() {
  const { t } = useTranslation();
  const { completeLevel, isLevelCompleted, progress } = useGame();

  const savedCode = progress?.activationCodes[LEVEL_ID] ?? null;
  const alreadyCompleted = isLevelCompleted(LEVEL_ID);

  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationCode, setValidationCode] = useState<string | null>(
    alreadyCompleted ? savedCode : null,
  );
  const [summary, setSummary] = useState<ClassQueriesSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReviewInscriptions() {
    setLoading(true);
    setError(null);

    try {
      const response = await validateExercise8();

      if (!response.success) {
        setError(
          getBackendErrorMessage(
            t,
            response.errorCode,
            "levels.level08.genericValidationError",
          ),
        );
        return;
      }

      setValidationCode(response.validationCode);
      setSummary({
        queries: response.queries,
        values: response.values,
      });

      completeLevel(LEVEL_ID, response.validationCode);
    } catch (error) {
      if (error instanceof IrisApiError) {
        const payload = error.payload as BackendErrorPayload | null;

        setError(
          getBackendErrorMessage(
            t,
            payload?.errorCode,
            "levels.level08.genericValidationError",
          ),
        );
        return;
      }

      setError(t("levels.level08.connectionError"));
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
          src={level08Image}
          alt={t("levels.level08.imageAlt")}
          className={styles.sceneImage}
        />

        <div className={styles.sceneCaption}>
          {validationCode
            ? t("levels.level08.captionCompleted")
            : t("levels.level08.captionInitial")}
        </div>
      </div>

      <section className={styles.panel}>
        {!validationCode ? (
          <>
            <h1>{t("levels.level08.title")}</h1>

            <p>{t("levels.level08.paragraph1")}</p>
            <p>{t("levels.level08.paragraph2")}</p>
            <p>{t("levels.level08.paragraph3")}</p>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={() => setHelpOpen(true)}
              >
                {t("levels.level08.helpButton")}
              </button>

              <button
                className={styles.primaryButton}
                onClick={handleReviewInscriptions}
                disabled={loading}
              >
                {loading
                  ? t("levels.level08.reviewingButton")
                  : t("levels.level08.reviewButton")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successPanel}>
            <h1>{t("levels.level08.successTitle")}</h1>

            <p>{t("levels.level08.successMessage")}</p>

            <div className={styles.translationSummary}>
              <p>{t("levels.level08.translationIntro")}</p>

              <ul className={styles.translationList}>
                <li>
                  <span>{t("levels.level08.sarcophagusQueryLabel")}</span>
                  <strong>
                    {getReadableStatus(summary?.queries?.sarcophagus, t)}
                  </strong>
                  <em>
                    {summary?.values?.sarcophagusRows ?? 0}{" "}
                    {t("levels.level08.rowsLabel")}
                  </em>
                </li>

                <li>
                  <span>{t("levels.level08.offeringQueryLabel")}</span>
                  <strong>
                    {getReadableStatus(summary?.queries?.offering, t)}
                  </strong>
                  <em>
                    {summary?.values?.offeringRows ?? 0}{" "}
                    {t("levels.level08.rowsLabel")}
                  </em>
                </li>

                <li>
                  <span>{t("levels.level08.allQueryLabel")}</span>
                  <strong>{getReadableStatus(summary?.queries?.all, t)}</strong>
                  <em>
                    {summary?.values?.allRows ?? 0}{" "}
                    {t("levels.level08.rowsLabel")}
                  </em>
                </li>
              </ul>
            </div>

            <ActivationCode
              label={t("levels.level08.activationCodeLabel")}
              code={validationCode}
            />
            <button
                className={styles.primaryButton}
                onClick={handleContinue}
            >
                {t("levels.level08.continueButton")}
            </button>
          </div>
        )}
      </section>

      {helpOpen && (
        <HelpModal
          title={t("levels.level08.helpTitle")}
          closeLabel={t("levels.level08.helpCloseButton")}
          onClose={() => setHelpOpen(false)}
        >
          <p>{t("levels.level08.helpIntro")}</p>

          <ol>
            <li>{t("levels.level08.helpStep1")}</li>
            <li>{t("levels.level08.helpStep2")}</li>
            <li>{t("levels.level08.helpStep3")}</li>
            <li>{t("levels.level08.helpStep4")}</li>
            <li>{t("levels.level08.helpStep5")}</li>
            <li>{t("levels.level08.helpStep6")}</li>
            <li>{t("levels.level08.helpStep7")}</li>
            <li>{t("levels.level08.helpStep8")}</li>
            <li>{t("levels.level08.helpStep9")}</li>
            <li>{t("levels.level08.helpStep10")}</li>
            <li>{t("levels.level08.helpStep11")}</li>
          </ol>

          <p>
            <strong>{t("levels.level08.helpExpectedTitle")}:</strong>{" "}
            {t("levels.level08.helpExpectedText")}
          </p>
        </HelpModal>
      )}
    </GameFrame>
  );
}