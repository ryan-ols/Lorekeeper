import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  current?: number;
  total?: number;
}

export function ProgressBar({ current = 0, total = 0 }: Props) {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Progresso</Text>
      <View style={styles.row}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.percent}>{percent}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 8 },
  label: { fontSize: 11, color: colors.textDim, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  track: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.pink,
    borderRadius: 2,
  },
  percent: { fontSize: 12, color: colors.pink, fontWeight: '600', minWidth: 36, textAlign: 'right' },
});