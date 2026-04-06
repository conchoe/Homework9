import { calendarDaysBetween, getLocalDateString } from "./date";

/**
 * Duolingo-style streak with 3-day grace (reset when calendar gap >= 3 days).
 * Same calendar day: streak unchanged. First ever workout: streak becomes 1.
 */
export function computeStreakAfterWorkout(
  previousStreak: number,
  lastWorkoutDate: string | null,
  workoutLocalDate: string
): { streak: number; lastWorkoutDate: string } {
  if (!lastWorkoutDate) {
    return { streak: 1, lastWorkoutDate: workoutLocalDate };
  }
  if (lastWorkoutDate === workoutLocalDate) {
    return { streak: previousStreak, lastWorkoutDate: lastWorkoutDate };
  }
  const gap = calendarDaysBetween(lastWorkoutDate, workoutLocalDate);
  if (gap >= 3) {
    return { streak: 1, lastWorkoutDate: workoutLocalDate };
  }
  return { streak: previousStreak + 1, lastWorkoutDate: workoutLocalDate };
}

export function streakDisplayValue(
  storedStreak: number,
  lastWorkoutDate: string | null
): number {
  if (!lastWorkoutDate) return 0;
  const today = getLocalDateString(new Date());
  if (calendarDaysBetween(lastWorkoutDate, today) >= 3) {
    return 0;
  }
  return storedStreak;
}
