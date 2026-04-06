import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/lib/theme";
import { getWeekKeySunday, startOfWeekSunday } from "@/lib/date";
import type { WorkoutSession } from "@/lib/types";

const WEEKS = 8;

function buildWeekBuckets(sessions: WorkoutSession[]): { label: string; count: number; key: string }[] {
  const anchor = startOfWeekSunday(new Date());
  const buckets: { label: string; count: number; key: string }[] = [];
  for (let i = WEEKS - 1; i >= 0; i -= 1) {
    const d = new Date(anchor);
    d.setDate(d.getDate() - i * 7);
    const key = getWeekKeySunday(d);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    buckets.push({ key, label, count: 0 });
  }
  const keyToIndex = new Map(buckets.map((b, idx) => [b.key, idx]));
  for (const s of sessions) {
    const day = new Date(s.localDate + "T12:00:00");
    const wk = getWeekKeySunday(day);
    const idx = keyToIndex.get(wk);
    if (idx !== undefined) {
      buckets[idx].count += 1;
    }
  }
  return buckets;
}

export function WeeklyBarChart({ sessions }: { sessions: WorkoutSession[] }) {
  const buckets = useMemo(() => buildWeekBuckets(sessions), [sessions]);
  const max = useMemo(() => Math.max(1, ...buckets.map((b) => b.count)), [buckets]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Workouts per week</Text>
      <View style={styles.row}>
        {buckets.map((b) => (
          <View key={b.key} style={styles.barWrap}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { height: b.count === 0 ? 0 : Math.max(8, (b.count / max) * 120) },
                ]}
              />
            </View>
            <Text style={styles.barLabel} numberOfLines={1}>
              {b.label}
            </Text>
            <Text style={styles.count}>{b.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 4,
  },
  barWrap: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  barTrack: {
    width: "100%",
    height: 120,
    backgroundColor: colors.surface2,
    borderRadius: 8,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    backgroundColor: colors.chartBar,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    minHeight: 4,
  },
  barLabel: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: "center",
  },
  count: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "600",
  },
});
