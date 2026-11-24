import styles from "./Toast.module.css";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div
      className={`${styles.toast} ${styles[toast.type || "success"]}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.dot} />
      <span className={styles.message}>{toast.message}</span>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Închide notificarea"
      >
        ×
      </button>
    </div>
  );
}