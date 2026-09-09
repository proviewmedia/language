import type { StepBase } from "@/data/curriculum";

// frame_swap and roleplay steps bundle several sub-interactions (one per
// slot/line) behind a single top-level step. Weight each step by its real
// interaction count so the progress bar/counter reflect actual content,
// matching the fix already shipped in app.html's updateLessonProgress().
export function stepWeight(s: StepBase): number {
  // +1 for frame_swap's bare-frame intro screen before it starts filling in slots.
  if (s.type === "frame_swap") return (s.slots as unknown[]).length + 1;
  if (s.type === "roleplay") return (s.lines as unknown[]).length;
  return 1;
}

export function lessonProgress(steps: StepBase[], si: number, subIdx = 0) {
  let before = 0;
  for (let i = 0; i < si; i++) before += stepWeight(steps[i]);
  const total = steps.reduce((sum, s) => sum + stepWeight(s), 0);
  const current = Math.min(before + subIdx + 1, total);
  return { current, total };
}
