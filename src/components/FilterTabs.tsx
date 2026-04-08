import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { StatusType } from '../types';
import { colors } from '../theme/colors';

const TABS: { label: string; value: StatusType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Reading', value: 'reading' },
  { label: 'Watching', value: 'watching' },
  { label: 'Completed', value: 'completed' },
  { label: 'Paused', value: 'paused' },
  { label: 'Dropped', value: 'dropped' },
  { label: 'Planned', value: 'plan' },
];

interface Props {
  active: StatusType | 'all';
  onChange: (val: StatusType | 'all') => void;
}

export function FilterTabs({ active, onChange }: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 52,
    justifyContent: 'center',
    marginBottom: 8,
  },
  container: {
    gap: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.pink,
    borderColor: colors.pink,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
    lineHeight: 18,
  },
  labelActive: { color: colors.white },
});