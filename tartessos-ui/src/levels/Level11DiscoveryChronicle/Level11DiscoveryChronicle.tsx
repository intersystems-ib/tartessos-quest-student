import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActivationCode } from "../../components/ActivationCode";
import { GameFrame } from "../../components/GameFrame";
import { HelpModal } from "../../components/HelpModal";
import {
  validateExercise11,
  type TimelineEvent,
} from "../../api/questApi";
import { IrisApiError } from "../../api/irisClient";
import {
  getBackendErrorMessage,
  type BackendErrorPayload,
} from "../../api/backendErrors";
import { useGame } from "../../game/GameContext";

import level11Image from "../../assets/images/level11.png";
import styles from "./Level11DiscoveryChronicle.module.css";

const LEVEL_ID = "level-11-discovery-chronicle" as const;

type ChronicleSummary = {
  timeline?: TimelineEvent[];
  frontPageHeadline?: string;
};

function getEventTypeLabel(type: string, t: (key: string) => string) {
  switch (type) {
    case "camp":
      return t("levels.level11.timelineTypeCamp");

    case "tools":
      return t("levels.level11.timelineTypeTools");

    case "chambers":
      return t("levels.level11.timelineTypeChambers");

    case "inscription":
      return t("levels.level11.timelineTypeInscription");

    case "press":
      return t("levels.level11.timelineTypePress");

    default:
      return type;
  }
}

function getLocationLabel(location: string, t: (key: string) => string) {
  switch (location) {
    case "camp":
      return t("levels.level11.locationCamp");

    case "level-3":
      return t("levels.level11.locationLevel3");

    case "level-5":
      return t("levels.level11.locationLevel5");

    case "surface":
      return t("levels.level11.locationSurface");

    default:
      return location;
  }
}

export function Level11DiscoveryChronicle() {
  const { t } = useTranslation();
  const { completeLevel, isLevelCompleted, progress } = useGame();

  const savedCode = progress?.activationCodes[LEVEL_ID] ?? null;
  const alreadyCompleted = isLevelCompleted(LEVEL_ID);

  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationCode, setValidationCode] = useState<string | null>(
    alreadyCompleted ? savedCode : null,
  );
  const [summary, setSummary] = useState<ChronicleSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePublishChronicle() {
    setLoading(true);
    setError(null);

    try {
      const response = await validateExercise11();

      if (!response.success) {
        setError(
          getBackendErrorMessage(
            t,
            response.errorCode,
            "levels.level11.genericValidationError",
          ),
        );
        return;
      }

      const validResponse =
        response.exercise === 11 &&
        Boolean(response.validationCode) &&
        Array.isArray(response.timeline) &&
        response.timeline.length > 0 &&
        Boolean(response.frontPageHeadline) &&
        response.errorCode === "";

      if (!validResponse) {
        setError(t("levels.level11.genericValidationError"));
        return;
      }

      setValidationCode(response.validationCode);
      setSummary({
        timeline: response.timeline,
        frontPageHeadline: response.frontPageHeadline,
      });

      completeLevel(LEVEL_ID, response.validationCode);
    } catch (error) {
      if (error instanceof IrisApiError) {
        const payload = error.payload as BackendErrorPayload | null;

        setError(
          getBackendErrorMessage(
            t,
            payload?.errorCode,
            "levels.level11.genericValidationError",
          ),
        );
        return;
      }

      setError(t("levels.level11.connectionError"));
    } finally {
      setLoading(false);
    }
  }

  const timeline = summary?.timeline ?? [];

  return (
    <GameFrame>
      <div className={styles.scene}>
        <img
          src={level11Image}
          alt={t("levels.level11.imageAlt")}
          className={styles.sceneImage}
        />

        <div className={styles.sceneCaption}>
          {validationCode
            ? t("levels.level11.captionCompleted")
            : t("levels.level11.captionInitial")}
        </div>
      </div>

      <section className={styles.panel}>
        {!validationCode ? (
          <>
            <h1>{t("levels.level11.title")}</h1>

            <p>{t("levels.level11.paragraph1")}</p>
            <p>{t("levels.level11.paragraph2")}</p>
            <p>{t("levels.level11.paragraph3")}</p>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={() => setHelpOpen(true)}
              >
                {t("levels.level11.helpButton")}
              </button>

              <button
                className={styles.primaryButton}
                onClick={handlePublishChronicle}
                disabled={loading}
              >
                {loading
                  ? t("levels.level11.reviewingButton")
                  : t("levels.level11.reviewButton")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successPanel}>
            <h1>{t("levels.level11.successTitle")}</h1>

            <p>{t("levels.level11.successMessage")}</p>

            {summary?.frontPageHeadline && (
              <div className={styles.frontPageBox}>
                <span>{t("levels.level11.frontPageHeadlineLabel")}</span>
                <strong>{summary.frontPageHeadline}</strong>
              </div>
            )}

            <div className={styles.timelineSummary}>
              <p>{t("levels.level11.timelineIntro")}</p>

              <ol className={styles.timelineList}>
                {timeline.map((event) => (
                  <li key={event.eventNumber}>
                    <div className={styles.timelineMeta}>
                      <span>
                        {t("levels.level11.eventNumberLabel")}{" "}
                        {event.eventNumber}
                      </span>
                      <span>
                        {getEventTypeLabel(event.type, t)}
                      </span>
                      <span>
                        {getLocationLabel(event.location, t)}
                      </span>
                    </div>

                    <strong>{event.headline}</strong>
                    <p>{event.summary}</p>
                  </li>
                ))}
              </ol>
            </div>

            <ActivationCode
              label={t("levels.level11.activationCodeLabel")}
              code={validationCode}
            />
          </div>
        )}
      </section>

      {helpOpen && (
        <HelpModal
          title={t("levels.level11.helpTitle")}
          closeLabel={t("levels.level11.helpCloseButton")}
          onClose={() => setHelpOpen(false)}
        >
          <p>{t("levels.level11.helpIntro")}</p>

          <ol>
            <li>{t("levels.level11.helpStep1")}</li>
            <li>{t("levels.level11.helpStep2")}</li>
            <li>{t("levels.level11.helpStep3")}</li>
            <li>{t("levels.level11.helpStep4")}</li>
            <li>{t("levels.level11.helpStep5")}</li>
            <li>{t("levels.level11.helpStep6")}</li>
            <li>{t("levels.level11.helpStep7")}</li>
            <li>{t("levels.level11.helpStep8")}</li>
            <li>{t("levels.level11.helpStep9")}</li>
            <li>{t("levels.level11.helpStep10")}</li>
            <li>{t("levels.level11.helpStep11")}</li>
            <li>{t("levels.level11.helpStep12")}</li>
            <li>{t("levels.level11.helpStep13")}</li>
          </ol>

          <p>
            <strong>{t("levels.level11.helpExpectedTitle")}:</strong>{" "}
            {t("levels.level11.helpExpectedText")}
          </p>
        </HelpModal>
      )}
    </GameFrame>
  );
}