import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/lib/theme";
import type { DraftSet } from "@/lib/types";

export function ExerciseLogModal({
  visible,
  title,
  sets,
  onClose,
  onChangeSet,
  onAddSet,
  onRemoveSet,
}: {
  visible: boolean;
  title: string;
  sets: DraftSet[];
  onClose: () => void;
  onChangeSet: (index: number, field: keyof DraftSet, value: string) => void;
  onAddSet: () => void;
  onRemoveSet: (index: number) => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity style={styles.touchOut} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>Sets · reps (min 1) · weight lbs (min 1) · RPE 1–10</Text>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {sets.map((row, idx) => (
              <View key={idx} style={styles.setRow}>
                <Text style={styles.setLabel}>Set {idx + 1}</Text>
                <View style={styles.inputs}>
                  <TextInput
                    style={styles.input}
                    placeholder="Reps"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    value={row.reps}
                    onChangeText={(t) => onChangeSet(idx, "reps", t)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Weight"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="decimal-pad"
                    value={row.weight}
                    onChangeText={(t) => onChangeSet(idx, "weight", t)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="RPE"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    value={row.rpe}
                    onChangeText={(t) => onChangeSet(idx, "rpe", t)}
                  />
                </View>
                {sets.length > 1 ? (
                  <TouchableOpacity onPress={() => onRemoveSet(idx)} style={styles.trash}>
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.trashSpacer} />
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.addBtn} onPress={onAddSet}>
              <Ionicons name="add-circle-outline" size={22} color={colors.accent} />
              <Text style={styles.addBtnText}>Add set</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  touchOut: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    maxHeight: "88%",
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    paddingRight: 12,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 13,
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  setLabel: {
    width: 52,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  inputs: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    fontSize: 15,
  },
  trash: {
    padding: 6,
  },
  trashSpacer: {
    width: 32,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  addBtnText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "600",
  },
});
