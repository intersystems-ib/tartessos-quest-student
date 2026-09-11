import { irisRequest } from "./irisClient";
import type { QuestApiProgressResponse } from "../game/gameTypes";

export type ExerciseValidationResponse = {
  success: boolean;
  exercise: number;
  validationCode: string;
  adventurerName?: string;
  errorCode: string;
  errorMessage: string;
};

export type Exercise2ValidationResponse = {
  success: boolean;
  exercise: number;
  validationCode: string;
  kit?: {
    trowel?: number;
    hat?: number;
    flashlight?: number;
    batteries?: number;
  };
  errorCode: string;
  errorMessage: string;
};

export type Exercise3ValidationResponse = {
  success: boolean;
  exercise: number;
  validationCode: string;
  model?: {
    baseClass?: string;
    derivedClasses?: string[];
  };
  errorCode: string;
  errorMessage: string;
};

export type Exercise4ValidationResponse = {
  success: boolean;
  exercise: number;
  validationCode: string;
  notebook?: {
    totalLines?: number;
    firstChamberType?: string;
  };
  errorCode: string;
  errorMessage: string;
};

export type Exercise5ValidationResponse = {
  success: boolean;
  exercise: number;
  validationCode: string;
  persistentChambers?: {
    hallRelevant?: boolean;
    mortuaryRelevant?: boolean;
    storageRelevant?: boolean;
    corridorRelevant?: boolean;
  };
  errorCode: string;
  errorMessage: string;
};

export type Exercise6ValidationResponse = {
  success: boolean;
  exercise: number;
  validationCode: string;
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
  errorCode: string;
  errorMessage: string;
};

export type Exercise7ValidationResponse = {
  success: boolean;
  exercise: number;
  validationCode: string;
  queries?: {
    totalInscriptions?: boolean;
    goldOfferingMortuaryDetails?: boolean;
  };
  values?: {
    totalInscriptions?: number;
    goldOfferingMortuaryDetails?: string[];
  };
  errorCode: string;
  errorMessage: string;
};

export type Exercise8ValidationResponse = {
  success: boolean;
  exercise: number;
  validationCode: string;
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
  errorCode: string;
  errorMessage: string;
};

export type Exercise9BurialTrailResponse = {
  success: boolean;
  exercise: number;
  validationCode: string;
  floorLevel: number;
  goldOfferingMortuaryCount: number;
  trailStatus: string;
  errorCode: string;
  errorMessage: string;
};

export type Exercise10ValidationResponse = {
  success: boolean;
  exercise: number;
  validationCode: string;
  analysis?: {
    encodedInscriptionFound?: boolean;
    inscriptionDecoded?: boolean;
    argantonioConfirmed?: boolean;
    invalidFloorLevelHandled?: boolean;
  };
  result?: string;
  errorCode: string;
  errorMessage: string;
};

export type TimelineEvent = {
  eventNumber: number;
  type: string;
  location: string;
  headline: string;
  summary: string;
};

export type Exercise11ValidationResponse = {
  success: boolean;
  exercise: number;
  validationCode: string;
  timeline?: TimelineEvent[];
  frontPageHeadline?: string;
  errorCode: string;
  errorMessage: string;
};

export async function getQuestProgress(): Promise<QuestApiProgressResponse> {
  return irisRequest<QuestApiProgressResponse>("/tartessos/progress");
}

export async function validateExercise1(): Promise<ExerciseValidationResponse> {
  return irisRequest<ExerciseValidationResponse>("/tartessos/exercise/1/validate");
}

export async function validateExercise2(): Promise<Exercise2ValidationResponse> {
  return irisRequest<Exercise2ValidationResponse>("/tartessos/exercise/2/validate");
}

export async function validateExercise3(): Promise<Exercise3ValidationResponse> {
  return irisRequest<Exercise3ValidationResponse>("/tartessos/exercise/3/validate");
}

export async function validateExercise4(): Promise<Exercise4ValidationResponse> {
  return irisRequest<Exercise4ValidationResponse>("/tartessos/exercise/4/validate");
}

export async function validateExercise5(): Promise<Exercise5ValidationResponse> {
  return irisRequest<Exercise5ValidationResponse>("/tartessos/exercise/5/validate");
}

export async function validateExercise6(): Promise<Exercise6ValidationResponse> {
  return irisRequest<Exercise6ValidationResponse>("/tartessos/exercise/6/validate");
}

export async function validateExercise7(): Promise<Exercise7ValidationResponse> {
  return irisRequest<Exercise7ValidationResponse>("/tartessos/exercise/7/validate");
}

export async function validateExercise8(): Promise<Exercise8ValidationResponse> {
  return irisRequest<Exercise8ValidationResponse>("/tartessos/exercise/8/validate");
}

export async function validateExercise9BurialTrail(
  floorLevel: number,
): Promise<Exercise9BurialTrailResponse> {
  const params = new URLSearchParams({
    floorLevel: String(floorLevel),
  });

  return irisRequest<Exercise9BurialTrailResponse>(
    `/student/burial-trail?${params.toString()}`,
  );
}

export async function validateExercise10(): Promise<Exercise10ValidationResponse> {
  return irisRequest<Exercise10ValidationResponse>(
    "/tartessos/exercise/10/validate",
  );
}

export async function validateExercise11(): Promise<Exercise11ValidationResponse> {
  return irisRequest<Exercise11ValidationResponse>(
    "/tartessos/exercise/11/validate",
  );
}