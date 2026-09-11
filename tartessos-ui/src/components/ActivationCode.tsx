import styles from "./ActivationCode.module.css";

type ActivationCodeProps = {
  label: string;
  code: string;
};

export function ActivationCode({ label, code }: ActivationCodeProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>{label}</p>
      <div className={styles.code}>{code}</div>
    </div>
  );
}