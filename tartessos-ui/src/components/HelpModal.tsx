import styles from "./HelpModal.module.css";

type HelpModalProps = {
  title: string;
  children: React.ReactNode;
  closeLabel: string;
  onClose: () => void;
};

export function HelpModal({
  title,
  children,
  closeLabel,
  onClose,
}: HelpModalProps) {
  return (
    <div className={styles.backdrop} role="presentation">
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
      >
        <h2 id="help-modal-title">{title}</h2>

        <div className={styles.content}>{children}</div>

        <button className={styles.closeButton} onClick={onClose}>
          {closeLabel}
        </button>
      </section>
    </div>
  );
}