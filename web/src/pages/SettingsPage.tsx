import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { readEspTalkPrefs, writeEspTalkPrefs, type EspTalkPrefs } from "@/lib/localState";
import type { AppOutletContext } from "@/components/app/AppLayout";

function SettingRow({
  label,
  sub,
  children,
}: {
  label: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <div className="font-body text-sm font-medium text-foreground">{label}</div>
        <div className="font-body text-xs text-muted-foreground">{sub}</div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
      <h2 className="font-heading text-sm font-bold text-foreground">{title}</h2>
      <div className="mt-1 divide-y divide-black/[0.06]">{children}</div>
    </div>
  );
}

export function SettingsPage() {
  const { name, isPro, openPaywall } = useOutletContext<AppOutletContext>();
  const [prefs, setPrefs] = useState<EspTalkPrefs>(() => readEspTalkPrefs());
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(name);
  const [savingName, setSavingName] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  function updatePrefs(update: Partial<EspTalkPrefs>) {
    const next = { ...prefs, ...update };
    setPrefs(next);
    writeEspTalkPrefs(update);
  }

  async function saveName() {
    const trimmed = nameDraft.trim();
    if (!trimmed) return;
    setSavingName(true);
    await supabase.auth.updateUser({ data: { display_name: trimmed } });
    window.location.reload();
  }

  function resetProgress() {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  }

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>

      <div className="mt-6 flex flex-col gap-4">
        <SettingsCard title="Account">
          <SettingRow label={name || "—"} sub="Display name">
            <Button variant="outline" size="sm" onClick={() => { setNameDraft(name); setNameDialogOpen(true); }}>
              Edit
            </Button>
          </SettingRow>
          <SettingRow
            label={isPro ? "Pro plan" : "Free plan"}
            sub={isPro ? "Full course unlocked" : "Engine basics & Eating & Drinking only"}
          >
            {isPro ? (
              <span className="font-body text-xs font-semibold text-accent">Active</span>
            ) : (
              <Button size="sm" onClick={openPaywall}>
                Upgrade
              </Button>
            )}
          </SettingRow>
          <SettingRow label="Reset progress" sub="Clear all data and start over">
            <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => setResetOpen(true)}>
              Reset
            </Button>
          </SettingRow>
          <SettingRow label="Sign out" sub="Log out of your account">
            <Button
              variant="outline"
              size="sm"
              onClick={() => supabase.auth.signOut().then(() => (window.location.href = "/app.html"))}
            >
              Sign out
            </Button>
          </SettingRow>
        </SettingsCard>

        <SettingsCard title="Preferences">
          <SettingRow label="Daily reminders" sub="Get notified to practice">
            <Switch checked={prefs.reminders} onCheckedChange={(v) => updatePrefs({ reminders: v })} />
          </SettingRow>
          <SettingRow label="Sound effects" sub="Audio feedback on answers">
            <Switch checked={prefs.sound} onCheckedChange={(v) => updatePrefs({ sound: v })} />
          </SettingRow>
          <SettingRow label="Auto-advance" sub="Skip delay after correct answers">
            <Switch checked={prefs.auto} onCheckedChange={(v) => updatePrefs({ auto: v })} />
          </SettingRow>
        </SettingsCard>

        <SettingsCard title="Audio">
          <SettingRow label="Voice" sub="Who speaks the Spanish audio">
            <Select value={prefs.voice} onValueChange={(v) => v && updatePrefs({ voice: v })}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male (Mateo)</SelectItem>
                <SelectItem value="female">Female (Luciana)</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="Playback speed" sub="Slow down every clip by default">
            <Select value={prefs.speed} onValueChange={(v) => v && updatePrefs({ speed: v })}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="slow">Slow</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </SettingsCard>

        <SettingsCard title="Learning">
          <SettingRow label="Daily goal" sub="Target XP per day">
            <Select value={String(prefs.dailyGoal)} onValueChange={(v) => v && updatePrefs({ dailyGoal: Number(v) })}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Casual (10 XP)</SelectItem>
                <SelectItem value="25">Regular (25 XP)</SelectItem>
                <SelectItem value="50">Serious (50 XP)</SelectItem>
                <SelectItem value="100">Intense (100 XP)</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="Lesson difficulty" sub="Adjust question complexity">
            <Select value={prefs.difficulty} onValueChange={(v) => v && updatePrefs({ difficulty: v })}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="adaptive">Adaptive</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </SettingsCard>
      </div>

      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit display name</DialogTitle>
            <DialogDescription>This is the name shown across EspTalk.</DialogDescription>
          </DialogHeader>
          <input
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") saveName(); }}
            autoFocus
            className="w-full rounded-lg border border-black/[0.1] px-3 py-2 font-body text-sm outline-none focus:border-accent"
          />
          <DialogFooter>
            <Button onClick={saveName} disabled={savingName || !nameDraft.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This clears all your progress, XP, and streaks. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive/10 text-destructive hover:bg-destructive/20" onClick={resetProgress}>
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
