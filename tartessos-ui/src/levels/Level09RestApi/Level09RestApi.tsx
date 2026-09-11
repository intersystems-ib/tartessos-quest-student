import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActivationCode } from "../../components/ActivationCode";
import { GameFrame } from "../../components/GameFrame";
import { HelpModal } from "../../components/HelpModal";
import { validateExercise9BurialTrail } from "../../api/questApi";
import { IrisApiError } from "../../api/irisClient";
import {
  getBackendErrorMessage,
  type BackendErrorPayload,
} from "../../api/backendErrors";
import { useGame } from "../../game/GameContext";

import level09Image from "../../assets/images/level09.png";
import styles from "./Level09RestApi.module.css";

const LEVEL_ID = "level-09-rest-api" as const;
const NEXT_LEVEL_ID = "level-10-embedded-python" as const;
const FLOOR_LEVEL_TO_VALIDATE = 3;
const EXPECTED_GOLD_OFFERING_MORTUARY_COUNT = 2;

type BurialEvidenceSummary = {
  floorLevel?: number;
  goldOfferingMortuaryCount?: number;
  trailStatus?: string;
};

function getEvidenceStatusLabel(
  trailStatus: string | undefined,
  t: (key: string) => string,
) {
  switch (trailStatus) {
    case "detected":
      return t("levels.level09.evidenceStatusDetected");

    case "clear":
      return t("levels.level09.evidenceStatusClear");

    case "blocked":
      return t("levels.level09.evidenceStatusBlocked");

    default:
      return t("levels.level09.evidenceStatusUnknown");
  }
}

export function Level09RestApi() {
  const { t } = useTranslation();
  const { completeLevel, isLevelCompleted, progress } = useGame();

  const savedCode = progress?.activationCodes[LEVEL_ID] ?? null;
  const alreadyCompleted = isLevelCompleted(LEVEL_ID);

  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationCode, setValidationCode] = useState<string | null>(
    alreadyCompleted ? savedCode : null,
  );
  const [summary, setSummary] = useState<BurialEvidenceSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckEvidence() {
    setLoading(true);
    setError(null);

    try {
      const response = await validateExercise9BurialTrail(
        FLOOR_LEVEL_TO_VALIDATE,
      );

      if (!response.success) {
        setError(
          getBackendErrorMessage(
            t,
            response.errorCode,
            "levels.level09.genericValidationError",
          ),
        );
        return;
      }

      const validResponse =
        response.exercise === 9 &&
        Boolean(response.validationCode) &&
        response.floorLevel === FLOOR_LEVEL_TO_VALIDATE &&
        response.goldOfferingMortuaryCount ===
          EXPECTED_GOLD_OFFERING_MORTUARY_COUNT &&
        response.errorCode === "";

      if (!validResponse) {
        setError(t("levels.level09.genericValidationError"));
        return;
      }

      setValidationCode(response.validationCode);
      setSummary({
        floorLevel: response.floorLevel,
        goldOfferingMortuaryCount: response.goldOfferingMortuaryCount,
        trailStatus: response.trailStatus,
      });

      completeLevel(LEVEL_ID, response.validationCode);
    } catch (error) {
      if (error instanceof IrisApiError) {
        const payload = error.payload as BackendErrorPayload | null;

        setError(
          getBackendErrorMessage(
            t,
            payload?.errorCode,
            "levels.level09.genericValidationError",
          ),
        );
        return;
      }

      setError(t("levels.level09.connectionError"));
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
          src={level09Image}
          alt={t("levels.level09.imageAlt")}
          className={styles.sceneImage}
        />

        <div className={styles.sceneCaption}>
          {validationCode
            ? t("levels.level09.captionCompleted")
            : t("levels.level09.captionInitial")}
        </div>
      </div>

      <section className={styles.panel}>
        {!validationCode ? (
          <>
            <h1>{t("levels.level09.title")}</h1>

            <p>{t("levels.level09.paragraph1")}</p>
            <p>{t("levels.level09.paragraph2")}</p>
            <p>{t("levels.level09.paragraph3")}</p>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={() => setHelpOpen(true)}
              >
                {t("levels.level09.helpButton")}
              </button>

              <button
                className={styles.primaryButton}
                onClick={handleCheckEvidence}
                disabled={loading}
              >
                {loading
                  ? t("levels.level09.reviewingButton")
                  : t("levels.level09.reviewButton")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successPanel}>
            <h1>{t("levels.level09.successTitle")}</h1>

            <p>{t("levels.level09.successMessage")}</p>

            <div className={styles.evidenceSummary}>
              <p>{t("levels.level09.evidenceIntro")}</p>

              <ul className={styles.evidenceList}>
                <li>
                  <span>{t("levels.level09.floorLevelLabel")}</span>
                  <strong>
                    {summary?.floorLevel ?? FLOOR_LEVEL_TO_VALIDATE}
                  </strong>
                </li>

                <li>
                  <span>{t("levels.level09.goldMortuaryCountLabel")}</span>
                  <strong>{summary?.goldOfferingMortuaryCount ?? 0}</strong>
                </li>

                <li>
                  <span>{t("levels.level09.evidenceStatusLabel")}</span>
                  <strong>
                    {getEvidenceStatusLabel(summary?.trailStatus, t)}
                  </strong>
                </li>
              </ul>
            </div>

            <ActivationCode
              label={t("levels.level09.activationCodeLabel")}
              code={validationCode}
            />
            <button
              className={styles.primaryButton}
              onClick={handleContinue}
            >
              {t("levels.level09.continueButton")}
            </button>
          </div>
        )}
      </section>

      {helpOpen && (
        <HelpModal
          title={t("levels.level09.helpTitle")}
          closeLabel={t("levels.level09.helpCloseButton")}
          onClose={() => setHelpOpen(false)}
        >
          <p>{t("levels.level09.helpIntro")}</p>

          <ol>
            <li>{t("levels.level09.helpStep1")}</li>
            <li>{t("levels.level09.helpStep2")}</li>
            <li>{t("levels.level09.helpStep3")}</li>
            <li>{t("levels.level09.helpStep4")}</li>
            <li>{t("levels.level09.helpStep5")}</li>
            <li>{t("levels.level09.helpStep6")}</li>
            <li>{t("levels.level09.helpStep7")}</li>
            <li>{t("levels.level09.helpStep8")}</li>
            <li>{t("levels.level09.helpStep9")}</li>
            <li>{t("levels.level09.helpStep10")}</li>
            <li>{t("levels.level09.helpStep11")}</li>
            <li>{t("levels.level09.helpStep12")}</li>
            <li>{t("levels.level09.helpStep13")}</li>
          </ol>

          <p>
            <strong>{t("levels.level09.helpExpectedTitle")}:</strong>{" "}
            {t("levels.level09.helpExpectedText")}
          </p>
        </HelpModal>
      )}
    </GameFrame>
  );
}