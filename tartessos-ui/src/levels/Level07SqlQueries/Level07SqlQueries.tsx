import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActivationCode } from "../../components/ActivationCode";
import { GameFrame } from "../../components/GameFrame";
import { HelpModal } from "../../components/HelpModal";
import { validateExercise7 } from "../../api/questApi";
import { IrisApiError } from "../../api/irisClient";
import {
  getBackendErrorMessage,
  type BackendErrorPayload,
} from "../../api/backendErrors";
import { useGame } from "../../game/GameContext";

import level07Image from "../../assets/images/level07.png";
import styles from "./Level07SqlQueries.module.css";

const LEVEL_ID = "level-07-sql-queries" as const;
const NEXT_LEVEL_ID = "level-08-class-queries" as const;

type SqlQueriesSummary = {
  queries?: {
    totalInscriptions?: boolean;
    goldOfferingMortuaryDetails?: boolean;
  };
  values?: {
    totalInscriptions?: number;
    goldOfferingMortuaryDetails?: string[];
  };
};

function getReadableStatus(
  value: boolean | undefined,
  t: (key: string) => string,
) {
  return value
    ? t("levels.level07.statusVerified")
    : t("levels.level07.statusPending");
}

export function Level07SqlQueries() {
  const { t } = useTranslation();
  const { completeLevel, isLevelCompleted, progress } = useGame();

  const savedCode = progress?.activationCodes[LEVEL_ID] ?? null;
  const alreadyCompleted = isLevelCompleted(LEVEL_ID);

  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationCode, setValidationCode] = useState<string | null>(
    alreadyCompleted ? savedCode : null,
  );
  const [summary, setSummary] = useState<SqlQueriesSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReviewNotes() {
    setLoading(true);
    setError(null);

    try {
      const response = await validateExercise7();

      if (!response.success) {
        setError(
          getBackendErrorMessage(
            t,
            response.errorCode,
            "levels.level07.genericValidationError",
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
            "levels.level07.genericValidationError",
          ),
        );
        return;
      }

      setError(t("levels.level07.connectionError"));
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
          src={level07Image}
          alt={t("levels.level07.imageAlt")}
          className={styles.sceneImage}
        />

        <div className={styles.sceneCaption}>
          {validationCode
            ? t("levels.level07.captionCompleted")
            : t("levels.level07.captionInitial")}
        </div>
      </div>

      <section className={styles.panel}>
        {!validationCode ? (
          <>
            <h1>{t("levels.level07.title")}</h1>

            <p>{t("levels.level07.paragraph1")}</p>
            <p>{t("levels.level07.paragraph2")}</p>
            <p>{t("levels.level07.paragraph3")}</p>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={() => setHelpOpen(true)}
              >
                {t("levels.level07.helpButton")}
              </button>

              <button
                className={styles.primaryButton}
                onClick={handleReviewNotes}
                disabled={loading}
              >
                {loading
                  ? t("levels.level07.reviewingButton")
                  : t("levels.level07.reviewButton")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successPanel}>
            <h1>{t("levels.level07.successTitle")}</h1>

            <p>{t("levels.level07.successMessage")}</p>

            <div className={styles.querySummary}>
              <p>{t("levels.level07.queriesIntro")}</p>

              <ul className={styles.queryList}>
                <li>
                  {t("levels.level07.totalInscriptionsLabel")}:{" "}
                  {summary?.values?.totalInscriptions ?? 0}
                </li>
                <li>
                  {t("levels.level07.totalInscriptionsQueryLabel")}:{" "}
                  {getReadableStatus(
                    summary?.queries?.totalInscriptions,
                    t,
                  )}
                </li>
                <li>
                  {t("levels.level07.goldDetailsQueryLabel")}:{" "}
                  {getReadableStatus(
                    summary?.queries?.goldOfferingMortuaryDetails,
                    t,
                  )}
                </li>
              </ul>

            </div>

            <ActivationCode
              label={t("levels.level07.activationCodeLabel")}
              code={validationCode}
            />
            <button
              className={styles.primaryButton}
              onClick={handleContinue}
            >
              {t("levels.level07.continueButton")}
            </button>
          </div>
        )}
      </section>

      {helpOpen && (
        <HelpModal
          title={t("levels.level07.helpTitle")}
          closeLabel={t("levels.level07.helpCloseButton")}
          onClose={() => setHelpOpen(false)}
        >
          <p>{t("levels.level07.helpIntro")}</p>

          <ol>
            <li>{t("levels.level07.helpStep1")}</li>
            <li>{t("levels.level07.helpStep2")}</li>
            <li>{t("levels.level07.helpStep3")}</li>
            <li>{t("levels.level07.helpStep4")}</li>
            <li>{t("levels.level07.helpStep5")}</li>
            <li>{t("levels.level07.helpStep6")}</li>
            <li>{t("levels.level07.helpStep7")}</li>
            <li>{t("levels.level07.helpStep8")}</li>
            <li>{t("levels.level07.helpStep9")}</li>
            <li>{t("levels.level07.helpStep10")}</li>
            <li>{t("levels.level07.helpStep11")}</li>
            <li>{t("levels.level07.helpStep12")}</li>
          </ol>

          <p>
            <strong>{t("levels.level07.helpExpectedTitle")}:</strong>{" "}
            {t("levels.level07.helpExpectedText")}
          </p>
        </HelpModal>
      )}
    </GameFrame>
  );
}