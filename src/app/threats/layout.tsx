
import { AppLayout } from '@/components/app-layout';

export default function ThreatsLayout({
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
