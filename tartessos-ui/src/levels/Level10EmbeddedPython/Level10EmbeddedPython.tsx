import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActivationCode } from "../../components/ActivationCode";
import { GameFrame } from "../../components/GameFrame";
import { HelpModal } from "../../components/HelpModal";
import { validateExercise10 } from "../../api/questApi";
import { IrisApiError } from "../../api/irisClient";
import {
  getBackendErrorMessage,
  type BackendErrorPayload,
} from "../../api/backendErrors";
import { useGame } from "../../game/GameContext";

import level10Image from "../../assets/images/level10.png";
import styles from "./Level10EmbeddedPython.module.css";

const LEVEL_ID = "level-10-embedded-python" as const;
const NEXT_LEVEL_ID = "level-11-discovery-chronicle" as const;

type InscriptionAnalysisSummary = {
  encodedInscriptionFound?: boolean;
  inscriptionDecoded?: boolean;
  argantonioConfirmed?: boolean;
  invalidFloorLevelHandled?: boolean;
  result?: string;
};

function getReadableStatus(
  value: boolean | undefined,
  t: (key: string) => string,
) {
  return value
    ? t("levels.level10.statusVerified")
    : t("levels.level10.statusPending");
}

function getReadableResult(
  result: string | undefined,
  t: (key: string) => string,
) {
  switch (result) {
    case "ARGANTONIO_CONFIRMED":
      return t("levels.level10.resultArgantonioConfirmed");

    case "UNKNOWN_BURIAL":
      return t("levels.level10.resultUnknownBurial");

    case "NO_INSCRIPTION_FOUND":
      return t("levels.level10.resultNoInscriptionFound");

    case "INVALID_FLOOR_LEVEL":
      return t("levels.level10.resultInvalidFloorLevel");

    default:
      return t("levels.level10.resultUnknown");
  }
}

export function Level10EmbeddedPython() {
  const { t } = useTranslation();
  const { completeLevel, isLevelCompleted, progress } = useGame();

  const savedCode = progress?.activationCodes[LEVEL_ID] ?? null;
  const alreadyCompleted = isLevelCompleted(LEVEL_ID);

  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationCode, setValidationCode] = useState<string | null>(
    alreadyCompleted ? savedCode : null,
  );
  const [summary, setSummary] = useState<InscriptionAnalysisSummary | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function handleDecodeInscription() {
    setLoading(true);
    setError(null);

    try {
      const response = await validateExercise10();

      if (!response.success) {
        setError(
          getBackendErrorMessage(
            t,
            response.errorCode,
            "levels.level10.genericValidationError",
          ),
        );
        return;
      }

      const validResponse =
        response.exercise === 10 &&
        Boolean(response.validationCode) &&
        response.result === "ARGANTONIO_CONFIRMED" &&
        response.errorCode === "";

      if (!validResponse) {
        setError(t("levels.level10.genericValidationError"));
        return;
      }

      setValidationCode(response.validationCode);
      setSummary({
        encodedInscriptionFound:
          response.analysis?.encodedInscriptionFound ?? false,
        inscriptionDecoded:
          response.analysis?.inscriptionDecoded ??
          response.analysis?.argantonioConfirmed ??
          false,
        argantonioConfirmed:
          response.analysis?.argantonioConfirmed ??
          response.result === "ARGANTONIO_CONFIRMED",
        invalidFloorLevelHandled:
          response.analysis?.invalidFloorLevelHandled ?? false,
        result: response.result,
      });

      completeLevel(LEVEL_ID, response.validationCode);
    } catch (error) {
      if (error instanceof IrisApiError) {
        const payload = error.payload as BackendErrorPayload | null;

        setError(
          getBackendErrorMessage(
            t,
            payload?.errorCode,
            "levels.level10.genericValidationError",
          ),
        );
        return;
      }

      setError(t("levels.level10.connectionError"));
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
          src={level10Image}
          alt={t("levels.level10.imageAlt")}
          className={styles.sceneImage}
        />

        <div className={styles.sceneCaption}>
          {validationCode
            ? t("levels.level10.captionCompleted")
            : t("levels.level10.captionInitial")}
        </div>
      </div>

      <section className={styles.panel}>
        {!validationCode ? (
          <>
            <h1>{t("levels.level10.title")}</h1>

            <p>{t("levels.level10.paragraph1")}</p>
            <p>{t("levels.level10.paragraph2")}</p>
            <p>{t("levels.level10.paragraph3")}</p>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={() => setHelpOpen(true)}
              >
                {t("levels.level10.helpButton")}
              </button>

              <button
                className={styles.primaryButton}
                onClick={handleDecodeInscription}
                disabled={loading}
              >
                {loading
                  ? t("levels.level10.reviewingButton")
                  : t("levels.level10.reviewButton")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successPanel}>
            <h1>{t("levels.level10.successTitle")}</h1>

            <p>{t("levels.level10.successMessage")}</p>

            <div className={styles.analysisSummary}>
              <p>{t("levels.level10.analysisIntro")}</p>

              <ul className={styles.analysisList}>
                <li>
                  <span>{t("levels.level10.encodedInscriptionLabel")}</span>
                  <strong>
                    {getReadableStatus(
                      summary?.encodedInscriptionFound,
                      t,
                    )}
                  </strong>
                </li>

                <li>
                  <span>{t("levels.level10.decodedInscriptionLabel")}</span>
                  <strong>
                    {getReadableStatus(summary?.inscriptionDecoded, t)}
                  </strong>
                </li>

                <li>
                  <span>{t("levels.level10.invalidLevelLabel")}</span>
                  <strong>
                    {getReadableStatus(
                      summary?.invalidFloorLevelHandled,
                      t,
                    )}
                  </strong>
                </li>

                <li className={styles.resultItem}>
                  <span>{t("levels.level10.resultLabel")}</span>
                  <strong>{getReadableResult(summary?.result, t)}</strong>
                </li>
              </ul>
            </div>

            <ActivationCode
              label={t("levels.level10.activationCodeLabel")}
              code={validationCode}
            />
            <button
              className={styles.primaryButton}
              onClick={handleContinue}
            >
              {t("levels.level10.continueButton")}
            </button>
          </div>
        )}
      </section>

      {helpOpen && (
        <HelpModal
          title={t("levels.level10.helpTitle")}
          closeLabel={t("levels.level10.helpCloseButton")}
          onClose={() => setHelpOpen(false)}
        >
          <p>{t("levels.level10.helpIntro")}</p>

          <ol>
            <li>{t("levels.level10.helpStep1")}</li>
            <li>{t("levels.level10.helpStep2")}</li>
            <li>{t("levels.level10.helpStep3")}</li>
            <li>{t("levels.level10.helpStep4")}</li>
            <li>{t("levels.level10.helpStep5")}</li>
            <li>{t("levels.level10.helpStep6")}</li>
            <li>{t("levels.level10.helpStep7")}</li>
            <li>{t("levels.level10.helpStep8")}</li>
            <li>{t("levels.level10.helpStep9")}</li>
            <li>{t("levels.level10.helpStep10")}</li>
            <li>{t("levels.level10.helpStep11")}</li>
          </ol>

          <p>
            <strong>{t("levels.level10.helpExpectedTitle")}:</strong>{" "}
            {t("levels.level10.helpExpectedText")}
          </p>
        </HelpModal>
      )}
    </GameFrame>
  );
}