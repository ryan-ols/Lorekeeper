import React from 'react';
import {
  View, Text, TouchableOpacity, Modal,
  StyleSheet, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export type SortOption = 'recent' | 'name_asc' | 'name_desc' | 'progress_asc' | 'progress_desc' | 'rating';

const OPTIONS: { value: SortOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'recent',        label: 'Recently added',    icon: 'time-outline' },
  { value: 'name_asc',      label: 'Name (A → Z)',      icon: 'text-outline' },
  { value: 'name_desc',     label: 'Name (Z → A)',      icon: 'text-outline' },
  { value: 'progress_asc',  label: 'Progress (low)',    icon: 'trending-up-outline' },
  { value: 'progress_desc', label: 'Progress (high)',   icon: 'trending-up-outline' },
  { value: 'rating',        label: 'Best rated',        icon: 'star-outline' },
];

interface Props {
  visible: boolean;
  current: SortOption;
  onSelect: (v: SortOption) => void;
  onClose: () => void;
}

export function SortModal({ visible, current, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <Text style={styles.title}>Sort by</Text>
          {OPTIONS.map(opt => {
            const active = current === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.option, active && styles.optionActive]}
                onPress={() => { onSelect(opt.value); onClose(); }}
              >
                <Ionicons
                  name={opt.icon}
                  size={18}
                  color={active ? colors.pink : colors.textMuted}
                />
                <Text style={[styles.optionText, active && styles.optionTextActive]}>
                  {opt.label}
                </Text>
                {active && (
                  <Ionicons name="checkmark" size={16} color={colors.pink} style={styles.check} />
                )}
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: '#00000088',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: 20, paddingBottom: 36,
    borderWidth: 1, borderColor: colors.border,
  },
  title: {
    fontSize: 12, color: colors.textDim, fontWeight: '700',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16,
  },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 13, borderRadius: 8, paddingHorizontal: 8,
  },
  optionActive: { backgroundColor: colors.pinkDim },
  optionText: { fontSize: 14, color: colors.textMuted, flex: 1 },
  optionTextActive: { color: colors.pink, fontWeight: '600' },
  check: { marginLeft: 'auto' },
});