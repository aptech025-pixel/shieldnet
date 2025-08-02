
"use client"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Shield,
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Settings,
  UserCircle,
  LogOut,
  LifeBuoy,
} from 'lucide-react';
import { Dashboard } from '@/components/dashboard';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';


export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };


  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Shield className="size-8 text-primary" />
            <h1 className="text-xl font-headline font-semibold">ShieldNet</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" passHref>
                <SidebarMenuButton isActive={pathname === '/'} tooltip={{content: "Dashboard"}}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/threats" passHref>
                <SidebarMenuButton isActive={pathname === '/threats'} tooltip={{content: "Threats"}}>
                  <AlertTriangle />
                  <span>Threats</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/analytics" passHref>
                <SidebarMenuButton isActive={pathname === '/analytics'} tooltip={{content: "Analytics"}}>
                  <BarChart3 />
                  <span>Analytics</span>
                </SidebarMenuButton>
               </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/settings" passHref>
                <SidebarMenuButton isActive={pathname === '/settings'} tooltip={{content: "Settings"}}>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/report" passHref>
                <SidebarMenuButton isActive={pathname === '/report'} tooltip={{content: "IT Report"}}>
                  <LifeBuoy />
                  <span>IT Report</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             {user && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip={{ content: "Profile" }}>
                    <UserCircle />
                    <span>{user.email}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut} tooltip={{ content: "Sign Out" }}>
                <LogOut />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Dashboard />
      </SidebarInset>
    </>
  );
}
