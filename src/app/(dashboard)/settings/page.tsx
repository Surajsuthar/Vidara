"use client";

import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandX,
} from "@tabler/icons-react";
import {
  Link2,
  Link2Off,
  LogOut,
  Monitor,
  Moon,
  Sun,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type SessionItem = {
  id: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
};

type AccountItem = {
  id: string;
  accountId: string;
  providerId: string;
  createdAt: Date;
};

const SOCIAL_PROVIDERS = [
  {
    id: "google" as const,
    label: "Google",
    Icon: IconBrandGoogle,
    description: "Connect your Google account",
  },
  {
    id: "github" as const,
    label: "GitHub",
    Icon: IconBrandGithub,
    description: "Connect your GitHub account",
  },
  {
    id: "twitter" as const,
    label: "Twitter / X",
    Icon: IconBrandX,
    description: "Connect your Twitter / X account",
  },
];

const THEMES = [
  { id: "light" as const, label: "Light", Icon: Sun },
  { id: "dark" as const, label: "Dark", Icon: Moon },
  { id: "system" as const, label: "System", Icon: Monitor },
];

function parseUserAgent(ua?: string | null): string {
  if (!ua) return "Unknown Device";
  if (/mobile/i.test(ua)) return "Mobile Browser";
  if (/edg/i.test(ua)) return "Edge Browser";
  if (/chrome/i.test(ua)) return "Chrome Browser";
  if (/firefox/i.test(ua)) return "Firefox Browser";
  if (/safari/i.test(ua)) return "Safari Browser";
  return "Desktop Browser";
}

function getInitials(name?: string | null): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  /* profile */
  const [name, setName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);

  /* sessions */
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [revokingToken, setRevokingToken] = useState<string | null>(null);

  /* accounts */
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [accountsLoaded, setAccountsLoaded] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(
    null,
  );

  /* sync name from session */
  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  /* ── data loaders ── */

  const loadSessions = useCallback(async () => {
    if (isLoadingSessions) return;
    setIsLoadingSessions(true);
    try {
      const { data } = await authClient.listSessions();
      if (data) setSessions(data as unknown as SessionItem[]);
      setSessionsLoaded(true);
    } catch {}
    setIsLoadingSessions(false);
  }, [isLoadingSessions]);

  const loadAccounts = useCallback(async () => {
    if (isLoadingAccounts) return;
    setIsLoadingAccounts(true);
    try {
      const { data } = await authClient.listAccounts();
      if (data) setAccounts(data as unknown as AccountItem[]);
      setAccountsLoaded(true);
    } catch {}
    setIsLoadingAccounts(false);
  }, [isLoadingAccounts]);

  /* ── handlers ── */

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setIsSavingProfile(true);
    setProfileMsg(null);
    try {
      await authClient.updateUser({ name: name.trim() });
      setProfileMsg({ text: "Profile updated successfully.", ok: true });
    } catch {
      setProfileMsg({
        text: "Failed to update profile. Please try again.",
        ok: false,
      });
    }
    setIsSavingProfile(false);
  };

  const handleRevokeSession = async (token: string) => {
    setRevokingToken(token);
    try {
      await authClient.revokeSession({ token });
      setSessions((prev) => prev.filter((s) => s.token !== token));
    } catch {}
    setRevokingToken(null);
  };

  const handleRevokeOthers = async () => {
    setIsRevokingAll(true);
    try {
      await authClient.revokeOtherSessions();
      await loadSessions();
    } catch {}
    setIsRevokingAll(false);
  };

  const handleLinkAccount = async (
    provider: "google" | "github" | "twitter",
  ) => {
    setLinkingProvider(provider);
    try {
      await authClient.linkSocial({
        provider,
        callbackURL: window.location.href,
      });
    } catch {}
    setLinkingProvider(null);
  };

  const handleUnlinkAccount = async (providerId: string) => {
    setUnlinkingProvider(providerId);
    try {
      await authClient.unlinkAccount({ providerId });
      setAccounts((prev) => prev.filter((a) => a.providerId !== providerId));
    } catch {}
    setUnlinkingProvider(null);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  /* ── derived ── */

  const user = session?.user;
  type SessionData = typeof session & { session?: { token?: string } };
  const currentToken = (session as SessionData)?.session?.token;
  const otherSessions = sessions.filter((s) => s.token !== currentToken);

  /* ────────────────────────────────── render ── */

  return (
    <section className="max-w-2xl mx-auto py-6 px-2 sm:px-4">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger
            value="accounts"
            onClick={() => {
              if (!accountsLoaded) loadAccounts();
            }}
          >
            Accounts
          </TabsTrigger>
          <TabsTrigger
            value="security"
            onClick={() => {
              if (!sessionsLoaded) loadSessions();
            }}
          >
            Security
          </TabsTrigger>
        </TabsList>

        {/* ══════════════════════════════ PROFILE ══ */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your public display name on Vidara.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Avatar row */}
              <div className="flex items-center gap-4">
                {isPending ? (
                  <Skeleton className="h-16 w-16 rounded-full" />
                ) : (
                  <Avatar className="h-16 w-16 ring-2 ring-border">
                    <AvatarImage
                      src={user?.image ?? ""}
                      alt={user?.name ?? "User"}
                    />
                    <AvatarFallback className="text-base font-semibold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="space-y-0.5">
                  {isPending ? (
                    <>
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-48 mt-1.5" />
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground pt-1">
                    Avatar is synced from your connected social provider.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Display name */}
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setProfileMsg(null);
                  }}
                  placeholder="Your name"
                  disabled={isPending}
                  className="max-w-sm"
                />
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={user?.email ?? ""}
                  readOnly
                  disabled
                  className="max-w-sm opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Email is managed through your connected social provider.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-3 border-t pt-6">
              {profileMsg ? (
                <p
                  className={cn(
                    "text-sm",
                    profileMsg.ok
                      ? "text-muted-foreground"
                      : "text-destructive",
                  )}
                >
                  {profileMsg.text}
                </p>
              ) : (
                <span />
              )}
              <Button
                size="sm"
                onClick={handleSaveProfile}
                disabled={
                  isSavingProfile ||
                  isPending ||
                  !name.trim() ||
                  name.trim() === (session?.user?.name ?? "")
                }
              >
                {isSavingProfile ? "Saving…" : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ══════════════════════════ APPEARANCE ══ */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Choose how Vidara looks and feels for you.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Label>Theme</Label>
              <div className="flex flex-wrap gap-3">
                {THEMES.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTheme(id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-xl border-2 px-8 py-5 text-sm font-medium transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      theme === id
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                &ldquo;System&rdquo; automatically matches your operating system
                preference.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════ ACCOUNTS ══ */}
        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                Manage the social providers linked to your Vidara account.
              </CardDescription>
            </CardHeader>

            <CardContent className="divide-y divide-border">
              {SOCIAL_PROVIDERS.map(({ id, label, Icon, description }) => {
                const isConnected = accounts.some((a) => a.providerId === id);
                const isLinking = linkingProvider === id;
                const isUnlinking = unlinkingProvider === id;

                return (
                  <div
                    key={id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isLoadingAccounts ? (
                            <Skeleton className="h-3 w-28 inline-block" />
                          ) : isConnected ? (
                            <span className="text-primary font-medium">
                              Connected
                            </span>
                          ) : (
                            description
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    {isLoadingAccounts ? (
                      <Skeleton className="h-8 w-24 shrink-0" />
                    ) : isConnected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUnlinking}
                        onClick={() => handleUnlinkAccount(id)}
                        className="gap-1.5 text-destructive hover:text-destructive shrink-0"
                      >
                        <Link2Off className="h-3.5 w-3.5" />
                        {isUnlinking ? "Removing…" : "Disconnect"}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isLinking}
                        onClick={() => handleLinkAccount(id)}
                        className="gap-1.5 shrink-0"
                      >
                        <Link2 className="h-3.5 w-3.5" />
                        {isLinking ? "Connecting…" : "Connect"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ════════════════════════════ SECURITY ══ */}
        <TabsContent value="security" className="space-y-4">
          {/* Active sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Devices currently signed in to your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="divide-y divide-border">
              {isLoadingSessions ? (
                (["skel-a", "skel-b", "skel-c"] as const).map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                    <Skeleton className="h-8 w-20 shrink-0" />
                  </div>
                ))
              ) : sessions.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No session data found. Click the Security tab to reload.
                </p>
              ) : (
                sessions.map((s) => {
                  const isCurrent = s.token === currentToken;
                  const device = parseUserAgent(s.userAgent);
                  const isRevoking = revokingToken === s.token;

                  return (
                    <div
                      key={s.id}
                      className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-sm font-medium flex flex-wrap items-center gap-2">
                          {device}
                          {isCurrent && (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-normal text-primary ring-1 ring-primary/20">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.ipAddress ? `IP: ${s.ipAddress} · ` : ""}
                          Signed in{" "}
                          {new Date(s.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {!isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isRevoking}
                          onClick={() => handleRevokeSession(s.token)}
                          className="gap-1.5 text-destructive hover:text-destructive shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {isRevoking ? "Revoking…" : "Revoke"}
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>

            {otherSessions.length > 1 && (
              <CardFooter className="border-t pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isRevokingAll}
                  onClick={handleRevokeOthers}
                  className="gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {isRevokingAll
                    ? "Signing out…"
                    : `Sign out of ${otherSessions.length} other session${otherSessions.length > 1 ? "s" : ""}`}
                </Button>
              </CardFooter>
            )}
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions — please proceed carefully.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Sign out */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Sign out of Vidara</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ends your current session on this device.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-1.5 shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
