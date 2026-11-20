import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './PublicLayout.module.css';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {/* Fills the free space of the `.app-shell` column so the footer stays at the
          viewport bottom on short pages (the pages render their own `<main>`). */}
      <div className={styles.publicLayoutContent}>{children}</div>
      <Footer />
    </>
  );
}
