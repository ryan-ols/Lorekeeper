import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { StatusType } from '../types';
import { colors } from '../theme/colors';

const TABS: { label: string; value: StatusType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Reading', value: 'reading' },
  { label: 'Watching', value: 'watching' },
  { label: 'Completed', value: 'completed' },
  { label: 'Paused', value: 'paused' },
  { label: 'Dropped', value: 'dropped' },
  { label: 'Plan', value: 'plan' },
];

interface Props {
  active: StatusType | 'all';
  onChange: (val: StatusType | 'all') => void;
}

export function FilterTabs({ active, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.container}>
      {TABS.map(tab => {
        const isActive = active === tab.value;
        return (
          <TouchableOpacity
            key={tab.value}
            onPress={() => onChange(tab.value)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginBottom: 16 },
  container: { gap: 8, paddingHorizontal: 20 },
  tab: {
  paddingHorizontal: 16,
  paddingVertical: 7,
  borderRadius: 20,
  backgroundColor: colors.bgCard,
  borderWidth: 1,
  borderColor: colors.border,
  alignSelf: 'flex-start', 
},
  tabActive: {
    backgroundColor: colors.pink,
    borderColor: colors.pink,
  },
  label: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  labelActive: { color: colors.white },
});