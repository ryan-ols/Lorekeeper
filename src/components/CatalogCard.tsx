import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MediaItem, MediaType, StatusType } from '../types';
import { ProgressBar } from './ProgressBar';
import { getProgress } from '../utils/progress';
import { colors } from '../theme/colors';

const TYPE_LABELS: Record<MediaType, string> = {
  book: 'LIVRO', series: 'SÉRIE', movie: 'FILME',
  anime: 'ANIME', manga: 'MANGÁ', game: 'JOGO',
  lightnovel: 'LN', other: 'OUTRO',
};

const STATUS_LABELS: Record<StatusType, string> = {
  watching: 'Assistindo', reading: 'Lendo', playing: 'Jogando',
  completed: 'Concluído', paused: 'Pausado', dropped: 'Abandonado', plan: 'Planejado',
};

function getTypeStyle(type: MediaType) {
  return colors[`tag${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof colors] as { bg: string; text: string; border: string }
    ?? { bg: colors.pinkDim, text: colors.pink, border: colors.pink };
}

function getStatusStyle(status: StatusType) {
  const key = `status${status.charAt(0).toUpperCase() + status.slice(1)}` as keyof typeof colors;
  return (colors[key] as { bg: string; text: string }) ?? { bg: colors.pinkDim, text: colors.pink };
}

interface Props {
  item: MediaItem;
  onPress: () => void;
}

export function CatalogCard({ item, onPress }: Props) {
  const typeStyle = getTypeStyle(item.type);
  const statusStyle = getStatusStyle(item.status);

  const { current, total, label } = getProgress(item);  

  const subtitle = [
    item.author,
    item.type === 'series' ? `T${item.currentSeason ?? 1}, Ep ${item.currentEpisodeInSeason ?? 0}` :
    item.type === 'lightnovel' ? `Vol.${item.currentVolume ?? 1}` : null,
  ].filter(Boolean).join(' · ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {item.coverUri ? (
        <Image source={{ uri: item.coverUri }} style={styles.cover} resizeMode="cover" />
      ) : (
        <View style={[styles.cover, styles.coverFallback]}>
          <Text style={styles.coverFallbackText}>{item.title.charAt(0)}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: typeStyle.bg, borderColor: typeStyle.border }]}>
            <Text style={[styles.tagText, { color: typeStyle.text }]}>{TYPE_LABELS[item.type]}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: statusStyle.bg, borderColor: 'transparent' }]}>
            <Text style={[styles.tagText, { color: statusStyle.text }]}>{STATUS_LABELS[item.status]}</Text>
          </View>
        </View>
        {total > 0 && <ProgressBar current={current} total={total} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cover: { width: 72, height: 100, borderRadius: 8 },
  coverFallback: {
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverFallbackText: { fontSize: 28, color: colors.white, fontWeight: '700' },
  info: { flex: 1, justifyContent: 'center', gap: 4 },
  title: { fontSize: 15, fontWeight: '600', color: colors.text },
  subtitle: { fontSize: 12, color: colors.textMuted },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 4 },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  tagText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});