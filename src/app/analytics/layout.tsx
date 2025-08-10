
import { AppLayout } from '@/components/app-layout';

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
        {children}
    </AppLayout>
  );
}
