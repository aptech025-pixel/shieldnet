
import { AppLayout } from '@/components/app-layout';

export default function ToolkitLayout({
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
