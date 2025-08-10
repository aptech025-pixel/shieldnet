
import { AppLayout } from '@/components/app-layout';

export default function IntelLayout({
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
