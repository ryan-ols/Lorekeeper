import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { getMediaById, deleteMedia } from '../db/database';
import { ProgressBar } from '../components/ProgressBar';
import { MediaItem } from '../types';
import { getProgress } from '../utils/progress';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Detail'>;
  route: RouteProp<RootStackParamList, 'Detail'>;
};

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function DetailScreen({ navigation, route }: Props) {
  const [item, setItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    const found = getMediaById(route.params.id);
    setItem(found);
  }, [route.params.id]);

  const TYPE_PT: Record<string, string> = {
    book: 'Book', series: 'Series', movie: 'Movie',
    anime: 'Anime', manga: 'Manga', game: 'Game',
    lightnovel: 'Light Novel', other: 'Other',
  };

  const STATUS_PT: Record<string, string> = {
    watching: 'Watching', reading: 'Reading', playing: 'Playing',
    completed: 'Completed', paused: 'Paused', dropped: 'Dropped', plan: 'Planned',
  };

  if (!item) return null;

const { current, total, label } = getProgress(item);

  function handleDelete() {
    Alert.alert('Delete', `Remove "${item!.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
          deleteMedia(item!.id);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Form', { id: item.id })}
            style={styles.iconBtn}
          >
            <Ionicons name="create-outline" size={22} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={22} color="#e05555" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          {item.coverUri ? (
            <Image source={{ uri: item.coverUri }} style={styles.cover} resizeMode="cover" />
          ) : (
            <View style={[styles.cover, styles.coverFallback]}>
              <Text style={styles.coverFallbackText}>{item.title.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.heroInfo}>
            <Text style={styles.title}>{item.title}</Text>
            {item.author && <Text style={styles.author}>{item.author}</Text>}
            {item.rating != null && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={colors.pink} />
                <Text style={styles.rating}>{item.rating}/10</Text>
              </View>
            )}
          </View>
        </View>

        {total > 0 && (
          <View style={styles.progressSection}>
            <ProgressBar current={current} total={total} />
            <Text style={styles.progressDetail}>
              {`${current} / ${total} ${label}`}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Row label="Type" value={TYPE_PT[item.type]} />
          <Row label="Status" value={STATUS_PT[item.status]} />
          <Row label="Platform" value={item.platform} />
          {item.type === 'series' && <Row label="Total seasons" value={item.totalSeasons} />}
          {item.type === 'series' && <Row label="Current season" value={item.currentSeason} />}
          {item.type === 'lightnovel' && <Row label="Total volumes" value={item.totalVolumes} />}
          {item.type === 'lightnovel' && <Row label="Current volume" value={item.currentVolume} />}
          <Row label="Begin in" value={item.startedAt} />
          <Row label="Complete in" value={item.finishedAt} />
        </View>

        {item.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notas</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 4 },
  scroll: { padding: 20, paddingBottom: 60 },
  hero: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  cover: { width: 100, height: 140, borderRadius: 10 },
  coverFallback: { backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  coverFallbackText: { fontSize: 36, color: colors.white, fontWeight: '700' },
  heroInfo: { flex: 1, justifyContent: 'center', gap: 6 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  author: { fontSize: 13, color: colors.textMuted },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  rating: { fontSize: 13, color: colors.pink, fontWeight: '600' },
  progressSection: { marginBottom: 24, gap: 6 },
  progressDetail: { fontSize: 12, color: colors.textMuted },
  section: {
    backgroundColor: colors.bgCard, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: 16, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  rowLabel: { fontSize: 13, color: colors.textMuted },
  rowValue: { fontSize: 13, color: colors.text, fontWeight: '500', textTransform: 'capitalize' },
  notesSection: {
    backgroundColor: colors.bgCard, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border, padding: 16,
  },
  notesLabel: { fontSize: 12, color: colors.textDim, marginBottom: 6 },
  notesText: { fontSize: 14, color: colors.text, lineHeight: 20 },
});