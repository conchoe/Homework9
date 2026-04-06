import { calendarDaysBetween, getLocalDateString } from "./date";
import type { AppStateV1 } from "./types";

/** Zero out streak in persisted state if user has been inactive for 3+ local days. */
export function applyStreakDecayToState(state: AppStateV1): AppStateV1 {
  const { lastWorkoutDate, streak } = state;
  if (!lastWorkoutDate) {
    if (streak === 0) return state;
    return { ...state, streak: 0 };
  }
  const today = getLocalDateString(new Date());
  if (calendarDaysBetween(lastWorkoutDate, today) >= 3) {
    if (streak === 0) return state;
    return { ...state, streak: 0 };
  }
  return state;
}
