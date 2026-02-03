
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardContent } from "@/components/dashboard-content";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
}

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  relationship: string | null;
}

interface SOSAlert {
  id: string;
  status: string;
  message: string;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push("/auth/login");
          return;
        }

        setUser(user);

        // Fetch profile with error handling
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.warn("Profile fetch error:", profileError.message);
        } else {
          setProfile(profile);
        }

        // Fetch trusted contacts with error handling
        const { data: trustedContacts, error: contactsError } = await supabase
          .from("trusted_contacts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (contactsError) {
          console.warn("Trusted contacts fetch error:", contactsError.message);
        } else {
          setTrustedContacts(trustedContacts || []);
        }

        // Fetch recent alerts with error handling
        const { data: recentAlerts, error: alertsError } = await supabase
          .from("sos_alerts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (alertsError) {
          console.warn("Recent alerts fetch error:", alertsError.message);
        } else {
          setRecentAlerts(recentAlerts || []);
        }

      } catch (error) {
        // Safeguard against any unexpected errors during auth/session access
        console.error("Dashboard auth error:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <DashboardContent
      user={user}
      profile={profile}
      trustedContacts={trustedContacts}
      recentAlerts={recentAlerts}
    />
  );
}
