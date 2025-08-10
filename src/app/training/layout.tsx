
import { AppLayout } from '@/components/app-layout';

export default function TrainingLayout({
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
