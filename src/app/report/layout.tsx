
import { AppLayout } from '@/components/app-layout';

export default function ReportLayout({
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
