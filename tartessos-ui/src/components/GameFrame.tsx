import type { ReactNode } from "react";
import styles from "./GameFrame.module.css";

type GameFrameProps = {
  children: ReactNode;
};

export function GameFrame({ children }: GameFrameProps) {
  return <section className={styles.gameFrame}>{children}</section>;
}