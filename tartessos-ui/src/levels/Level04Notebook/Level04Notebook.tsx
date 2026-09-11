import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActivationCode } from "../../components/ActivationCode";
import { GameFrame } from "../../components/GameFrame";
import { HelpModal } from "../../components/HelpModal";
import { validateExercise4 } from "../../api/questApi";
import { IrisApiError } from "../../api/irisClient";
import { useGame } from "../../game/GameContext";

import level04Image from "../../assets/images/level04.png";
import styles from "./Level04Notebook.module.css";

import {
  getBackendErrorMessage,
  type BackendErrorPayload,
} from "../../api/backendErrors";

const LEVEL_ID = "level-04-notebook" as const;
const NEXT_LEVEL_ID = "level-05-persistent-chambers" as const;

type NotebookSummary = {
  totalLines?: number;
  firstChamberType?: string;
};

function getReadableChamberType(type: string | undefined, t: (key: string) => string) {
  switch (type) {
    case "Hall":
      return t("levels.level04.chamberTypeHall");

    case "Mortuary":
      return t("levels.level04.chamberTypeMortuary");

    case "Storage":
      return t("levels.level04.chamberTypeStorage");

    case "Corridor":
      return t("levels.level04.chamberTypeCorridor");

    default:
      return t("levels.level04.chamberTypeUnknown");
  }
}

export function Level04Notebook() {
  const { t } = useTranslation();
  const { completeLevel, isLevelCompleted, progress } = useGame();

  const savedCode = progress?.activationCodes[LEVEL_ID] ?? null;
  const alreadyCompleted = isLevelCompleted(LEVEL_ID);

  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationCode, setValidationCode] = useState<string | null>(
    alreadyCompleted ? savedCode : null,
  );
  const [notebook, setNotebook] = useState<NotebookSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReviewNotebook() {
    setLoading(true);
    setError(null);

    try {
      const response = await validateExercise4();

      if (!response.success) {        
        if (response.errorCode === "NOTEBOOK_GLOBAL_NOT_FOUND") {
          setError(t("levels.level04.notebookGlobalNotFound"));
        }
        else {
            setError(
                getBackendErrorMessage(t, response.errorCode, "levels.level04.genericValidationError") ||
                    t("levels.level04.genericValidationError"),
            );
        }
        
        return;
      }

      setValidationCode(response.validationCode);
      setNotebook(response.notebook ?? null);

      completeLevel(LEVEL_ID, response.validationCode);
    } catch (error) {
      if (error instanceof IrisApiError) {
        const payload = error.payload as BackendErrorPayload | null;

        if (payload?.errorCode === "NOTEBOOK_GLOBAL_NOT_FOUND") {
          setError(t("levels.level04.notebookGlobalNotFound"));
        }
        else {
            setError(
                getBackendErrorMessage(t, payload?.errorCode, "levels.level04.genericValidationError") ||
                    t("levels.level04.genericValidationError"),
            );
        }
        return;
      }

      setError(t("levels.level04.connectionError"));
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
          src={level04Image}
          alt={t("levels.level04.imageAlt")}
          className={styles.sceneImage}
        />

        <div className={styles.sceneCaption}>
          {validationCode
            ? t("levels.level04.captionCompleted")
            : t("levels.level04.captionInitial")}
        </div>
      </div>

      <section className={styles.panel}>
        {!validationCode ? (
          <>
            <h1>{t("levels.level04.title")}</h1>

            <p>{t("levels.level04.paragraph1")}</p>
            <p>{t("levels.level04.paragraph2")}</p>
            <p>{t("levels.level04.paragraph3")}</p>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={() => setHelpOpen(true)}
              >
                {t("levels.level04.helpButton")}
              </button>

              <button
                className={styles.primaryButton}
                onClick={handleReviewNotebook}
                disabled={loading}
              >
                {loading
                  ? t("levels.level04.reviewingButton")
                  : t("levels.level04.reviewButton")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successPanel}>
            <h1>{t("levels.level04.successTitle")}</h1>

            <p>{t("levels.level04.successMessage")}</p>

            <div className={styles.notebookSummary}>
              <p>{t("levels.level04.notebookIntro")}</p>

              <ul className={styles.notebookList}>
                <li>
                  {t("levels.level04.totalLinesLabel")}:{" "}
                  {notebook?.totalLines ?? 0}
                </li>
                <li>
                  {t("levels.level04.firstChamberTypeLabel")}:{" "}
                  {getReadableChamberType(notebook?.firstChamberType, t)}
                </li>
              </ul>
            </div>

            <ActivationCode
              label={t("levels.level04.activationCodeLabel")}
              code={validationCode}
            />
            <button
                className={styles.primaryButton}
                onClick={handleContinue}
                >
                {t("levels.level04.continueButton")}
            </button>
          </div>
        )}
      </section>

      {helpOpen && (
        <HelpModal
          title={t("levels.level04.helpTitle")}
          closeLabel={t("levels.level04.helpCloseButton")}
          onClose={() => setHelpOpen(false)}
        >
          <p>{t("levels.level04.helpIntro")}</p>

          <ol>
            <li>{t("levels.level04.helpStep1")}</li>
            <li>{t("levels.level04.helpStep2")}</li>
            <li>{t("levels.level04.helpStep3")}</li>
            <li>{t("levels.level04.helpStep4")}</li>
            <li>{t("levels.level04.helpStep5")}</li>
            <li>{t("levels.level04.helpStep6")}</li>
            <li>{t("levels.level04.helpStep7")}</li>
            <li>{t("levels.level04.helpStep8")}</li>
            <li>{t("levels.level04.helpStep9")}</li>
            <li>{t("levels.level04.helpStep10")}</li>
            <li>{t("levels.level04.helpStep11")}</li>
            <li>{t("levels.level04.helpStep12")}</li>
            <li>{t("levels.level04.helpStep13")}</li>
          </ol>

          <p>
            <strong>{t("levels.level04.helpExpectedTitle")}:</strong>{" "}
            {t("levels.level04.helpExpectedText")}
          </p>
        </HelpModal>
      )}
    </GameFrame>
  );
}