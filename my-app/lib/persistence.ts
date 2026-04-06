import AsyncStorage from "@react-native-async-storage/async-storage";

import { applyStreakDecayToState } from "./streak-sync";
import type { AppStateV1 } from "./types";

const STORAGE_KEY = "workout_logger_state_v1";

export function createDefaultState(): AppStateV1 {
  return {
    version: 1,
    exercises: [],
    splits: [],
    sessions: [],
    streak: 0,
    lastWorkoutDate: null,
    lastWeightByExerciseId: {},
    activeSplitId: null,
    activeWorkoutSlotIndex: null,
    draftByExerciseId: {},
  };
}

function normalizeState(raw: unknown): AppStateV1 | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.version !== 1) return null;
  return {
    version: 1,
    exercises: Array.isArray(o.exercises) ? (o.exercises as AppStateV1["exercises"]) : [],
    splits: Array.isArray(o.splits) ? (o.splits as AppStateV1["splits"]) : [],
    sessions: Array.isArray(o.sessions) ? (o.sessions as AppStateV1["sessions"]) : [],
    streak: typeof o.streak === "number" ? o.streak : 0,
    lastWorkoutDate: typeof o.lastWorkoutDate === "string" || o.lastWorkoutDate === null ? (o.lastWorkoutDate as string | null) : null,
    lastWeightByExerciseId:
      o.lastWeightByExerciseId && typeof o.lastWeightByExerciseId === "object"
        ? (o.lastWeightByExerciseId as Record<string, number>)
        : {},
    activeSplitId: typeof o.activeSplitId === "string" || o.activeSplitId === null ? (o.activeSplitId as string | null) : null,
    activeWorkoutSlotIndex:
      typeof o.activeWorkoutSlotIndex === "number" || o.activeWorkoutSlotIndex === null
        ? (o.activeWorkoutSlotIndex as number | null)
        : null,
    draftByExerciseId:
      o.draftByExerciseId && typeof o.draftByExerciseId === "object"
        ? (o.draftByExerciseId as AppStateV1["draftByExerciseId"])
        : {},
  };
}

function repairActivePointers(state: AppStateV1): AppStateV1 {
  const splitIds = new Set(state.splits.map((s) => s.id));
  let activeSplitId = state.activeSplitId;
  if (activeSplitId && !splitIds.has(activeSplitId)) {
    activeSplitId = null;
  }
  let activeWorkoutSlotIndex = state.activeWorkoutSlotIndex;
  if (!activeSplitId) {
    activeWorkoutSlotIndex = null;
  } else if (typeof activeWorkoutSlotIndex === "number") {
    const split = state.splits.find((s) => s.id === activeSplitId);
    const slot = split?.slots[activeWorkoutSlotIndex];
    if (!slot) {
      activeWorkoutSlotIndex = null;
    }
  }
  return { ...state, activeSplitId, activeWorkoutSlotIndex };
}

export async function loadPersistedState(): Promise<AppStateV1> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as unknown;
    const normalized = normalizeState(parsed);
    if (!normalized) return createDefaultState();
    const repaired = repairActivePointers(normalized);
    return applyStreakDecayToState(repaired);
  } catch {
    return createDefaultState();
  }
}

export async function savePersistedState(state: AppStateV1): Promise<void> {
  const json = JSON.stringify(state);
  await AsyncStorage.setItem(STORAGE_KEY, json);
}
