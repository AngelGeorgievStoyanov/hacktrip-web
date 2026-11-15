'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './NotFound.module.css';

const COUNTDOWN_START = 10;

export function NotFound() {
  const router = useRouter();
  const [count, setCount] = useState(COUNTDOWN_START);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      router.replace('/');
    }, COUNTDOWN_START * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [router]);

  function goHome(): void {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    router.replace('/');
  }

  return (
    <main className={styles.page}>
      <h3>PAGE NOT FOUND 404</h3>
      <h4>WRONG WAY!</h4>
      <div className={styles.content}>
        <h3>{count} SECONDS OR CLICK</h3>
        <button
          type="button"
          onClick={goHome}
          className={styles.homeButton}
        >
          HOME
        </button>
      </div>
    </main>
  );
}
