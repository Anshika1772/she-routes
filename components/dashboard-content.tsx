"use client";

import React from "react"

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  MapPin,
  Users,
  Phone,
  Plus,
  Trash2,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEmergencySiren } from "@/hooks/use-emergency-siren";

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

interface DashboardContentProps {
  user: User;
  profile: Profile | null;
  trustedContacts: TrustedContact[];
  recentAlerts: SOSAlert[];
}

export function DashboardContent({
  user,
  profile,
  trustedContacts: initialContacts,
  recentAlerts,
}: DashboardContentProps) {
  const router = useRouter();
  const { isPlaying, startSiren, stopSiren } = useEmergencySiren();
  const [contacts, setContacts] = useState(initialContacts);
  const [sosLoading, setSosLoading] = useState(false);
  const [sosStatus, setSosStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [sirenCountdown, setSirenCountdown] = useState(0);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "",
  });
  const [quickSosLoading, setQuickSosLoading] = useState(false);

  const handleQuickSOS = () => {
    setQuickSosLoading(true);
    setSosStatus(null);

    const userName = profile?.full_name || user.email || "Unknown";
    const contactsWithPhone = contacts.filter((c) => c.phone && String(c.phone).trim());

    if (contactsWithPhone.length === 0) {
      setSosStatus({ type: "error", message: "Add trusted contacts first" });
      setQuickSosLoading(false);
      return;
    }

    const sosWindow = window.open("about:blank", "_blank", "noopener,noreferrer");

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    const formatPhone = (phone: string) => {
      const digits = String(phone).replace(/\D/g, "");
      if (!digits) return "";
      if (digits.length === 10 && !digits.startsWith("0")) return `91${digits}`;
      if (digits.length === 12 && digits.startsWith("91")) return digits;
      if (digits.startsWith("0")) return digits.slice(1);
      return digits;
    };

    const openWhatsAppAndSMS = (googleMapsLink: string, locationFailed?: boolean) => {
      const message = `🚨 SOS ALERT 🚨\nI am in danger. Please help me immediately.\n📍 Live Location: ${googleMapsLink}`;
      const encodedMessage = encodeURIComponent(message);
      const firstContact = contactsWithPhone[0];
      const firstPhone = formatPhone(firstContact.phone);
      if (!firstPhone) return;

      const whatsappUrl = `https://wa.me/${firstPhone}?text=${encodedMessage}`;
      const smsUrl = `sms:${firstPhone}?body=${encodedMessage}`;

      if (sosWindow && !sosWindow.closed) {
        sosWindow.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }
      setTimeout(() => window.open(smsUrl, "_blank", "noopener,noreferrer"), 800);

      if (contactsWithPhone.length > 1) {
        let idx = 1;
        const openNext = () => {
          if (idx < contactsWithPhone.length) {
            const phone = formatPhone(contactsWithPhone[idx].phone);
            if (phone) {
              const url = `https://wa.me/${phone}?text=${encodedMessage}`;
              window.open(url, "_blank", "noopener,noreferrer");
            }
            idx++;
            if (idx < contactsWithPhone.length) setTimeout(openNext, 2000);
          }
        };
        setTimeout(openNext, 2000);
      }

      setSosStatus({
        type: "success",
        message: locationFailed
          ? "WhatsApp opened. Message is pre-filled. Tap Send to share."
          : "WhatsApp opened with SOS + location. Tap Send to share.",
      });
      setQuickSosLoading(false);
    };

    const tryGetLocation = (isRetry: boolean) => {
      if (!navigator.geolocation) {
        openWhatsAppAndSMS("Location unavailable", true);
        setSosStatus({ type: "error", message: "Location not supported in this browser" });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
          openWhatsAppAndSMS(googleMapsLink);
        },
        (error) => {
          if (error.code === 1) {
            setSosStatus({ type: "error", message: "Location permission denied. Allow location in browser settings." });
          } else if (error.code === 3 && !isRetry) {
            tryGetLocation(true);
            return;
          } else if (error.code === 3) {
            setSosStatus({ type: "error", message: "Location request timed out. Try again." });
          } else {
            setSosStatus({ type: "error", message: "Location unavailable. Check if location services are enabled." });
          }
          openWhatsAppAndSMS("Location unavailable", true);
        },
        geoOptions
      );
    };

    tryGetLocation(false);
  };

  // Countdown timer for siren
  useEffect(() => {
    if (!isPlaying) {
      setSirenCountdown(0);
      return;
    }

    setSirenCountdown(30);
    const interval = setInterval(() => {
      setSirenCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleSOS = () => {
    setSosLoading(true);
    setSosStatus(null);

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    const sendToApi = (latitude?: number, longitude?: number) => {
      fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          message: "Emergency SOS Alert",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setSosStatus({ type: "error", message: data.error });
          } else {
            setSosStatus({ type: "success", message: data.message });
            startSiren();
            router.refresh();
          }
        })
        .catch(() => {
          setSosStatus({ type: "error", message: "Failed to send SOS. Please try again." });
        })
        .finally(() => setSosLoading(false));
    };

    if (!navigator.geolocation) {
      setSosStatus({ type: "error", message: "Location not supported in this browser" });
      sendToApi();
      return;
    }

    const tryGetLocation = (isRetry: boolean) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          sendToApi(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          if (error.code === 1) {
            setSosStatus({ type: "error", message: "Location permission denied. Allow location in browser settings." });
          } else if (error.code === 3 && !isRetry) {
            tryGetLocation(true);
            return;
          } else if (error.code === 3) {
            setSosStatus({ type: "error", message: "Location request timed out. Try again." });
          } else {
            setSosStatus({ type: "error", message: "Location unavailable. Check if location services are enabled." });
          }
          sendToApi();
        },
        geoOptions
      );
    };

    tryGetLocation(false);
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/trusted-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      });

      const data = await response.json();

      if (response.ok) {
        setContacts([data.contact, ...contacts]);
        setNewContact({ name: "", phone: "", email: "", relationship: "" });
        setAddContactOpen(false);
      }
    } catch (error) {
      console.error("Add contact error:", error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const response = await fetch(`/api/trusted-contacts?id=${contactId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setContacts(contacts.filter((c) => c.id !== contactId));
      }
    } catch (error) {
      console.error("Delete contact error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Quick SOS Button - fixed top-right */}
      <Button
        size="sm"
        variant="destructive"
        className="fixed top-4 right-4 z-50 h-9 px-3 text-sm font-semibold"
        onClick={handleQuickSOS}
        disabled={quickSosLoading}
      >
        {quickSosLoading ? "..." : "SOS"}
      </Button>

      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">SheRoutes</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {profile?.full_name || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your safety settings and contacts
          </p>
        </div>

        {/* SOS Alert Section */}
        <Card className={`mb-8 border-destructive/20 ${isPlaying ? "bg-destructive/20 border-destructive animate-pulse" : "bg-destructive/5"}`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${isPlaying ? "bg-destructive/30 animate-pulse" : "bg-destructive/10"}`}>
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Emergency SOS</h2>
                  <p className="text-muted-foreground">
                    {isPlaying ? `Siren playing: ${sirenCountdown}s remaining` : "Send an immediate alert with your location"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleSOS}
                  disabled={sosLoading || isPlaying}
                  className="min-w-[200px]"
                >
                  {isPlaying ? (
                    <>
                      <Volume2 className="h-5 w-5 mr-2 animate-pulse" />
                      Siren Active
                    </>
                  ) : sosLoading ? (
                    "Sending..."
                  ) : (
                    "Send SOS Alert"
                  )}
                </Button>
                {isPlaying && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={stopSiren}
                    className="min-w-[200px] bg-transparent"
                  >
                    <VolumeX className="h-4 w-4 mr-2" />
                    Stop Siren
                  </Button>
                )}
              </div>
            </div>
            {sosStatus && (
              <Alert
                className="mt-4"
                variant={sosStatus.type === "error" ? "destructive" : "default"}
              >
                <AlertDescription>{sosStatus.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Trusted Contacts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Trusted Contacts
                </CardTitle>
                <CardDescription>
                  People who will be notified in emergencies
                </CardDescription>
              </div>
              <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Trusted Contact</DialogTitle>
                    <DialogDescription>
                      This person will be notified when you send an SOS alert
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddContact} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Name</Label>
                      <Input
                        id="contactName"
                        value={newContact.name}
                        onChange={(e) =>
                          setNewContact({ ...newContact, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={newContact.phone}
                        onChange={(e) =>
                          setNewContact({
                            ...newContact,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email (optional)</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={newContact.email}
                        onChange={(e) =>
                          setNewContact({
                            ...newContact,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactRelationship">
                        Relationship (optional)
                      </Label>
                      <Input
                        id="contactRelationship"
                        placeholder="e.g., Mother, Friend"
                        value={newContact.relationship}
                        onChange={(e) =>
                          setNewContact({
                            ...newContact,
                            relationship: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Contact
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No trusted contacts yet. Add someone you trust.
                </p>
              ) : (
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {contact.phone}
                            {contact.relationship &&
                              ` • ${contact.relationship}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Alerts
              </CardTitle>
              <CardDescription>Your SOS alert history</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAlerts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No alerts sent yet. Stay safe!
                </p>
              ) : (
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        {alert.status === "active" ? (
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        ) : alert.status === "resolved" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium capitalize">
                            {alert.status} Alert
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(alert.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {alert.latitude && alert.longitude && (
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
