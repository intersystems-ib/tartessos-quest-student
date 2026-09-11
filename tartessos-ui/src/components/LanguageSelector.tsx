import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../i18n";
import styles from "./LanguageSelector.module.css";

export function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.resolvedLanguage ?? i18n.language ?? "es";

  return (
    <label className={styles.languageSelector}>
      <span>{t("language.label")}</span>

      <select
        value={currentLanguage}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
      >
        {supportedLanguages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}