import type { TFunction } from "i18next";

export type BackendErrorPayload = {
  success?: boolean;
  exercise?: number;
  validationCode?: string;
  errorCode?: string;
  errorMessage?: string;
};

export function getBackendErrorMessage(
  t: TFunction,
  errorCode: string | undefined,
  fallbackKey: string,
) {
  if (!errorCode) {
    return t(fallbackKey);
  }

  return t(`backendErrors.${errorCode}`, {
    defaultValue: t(fallbackKey),
  });
}