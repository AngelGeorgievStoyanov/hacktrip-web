import type { Metadata } from 'next';
import { NOINDEX } from '@/constants/seo';
import { ProfilePageContent } from '@/components/auth/ProfilePageContent';

export const metadata: Metadata = {
  title: 'Profile',
  robots: NOINDEX,
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}
