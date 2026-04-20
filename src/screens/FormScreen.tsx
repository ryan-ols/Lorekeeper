import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { insertMedia, updateMedia, getMediaById } from '../db/database';
import { MediaItem, MediaType, StatusType } from '../types';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../../App';
import { fetchCoverUrl } from '../utils/coverSearch';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Form'>;
  route: RouteProp<RootStackParamList, 'Form'>;
};

const TYPES: MediaType[] = ['book', 'series', 'movie', 'anime', 'manga', 'lightnovel', 'game', 'other'];
const STATUSES: StatusType[] = ['watching', 'reading', 'playing', 'completed', 'paused', 'dropped', 'plan'];

const TYPE_LABELS: Record<MediaType, string> = {
  book: 'Book', series: 'Series', movie: 'Movie',
  anime: 'Anime', manga: 'Manga', game: 'Game',
  lightnovel: 'Light Novel', other: 'Other',
};

const STATUS_LABELS: Record<StatusType, string> = {
  watching: 'Watching', reading: 'Reading', playing: 'Playing',
  completed: 'Completed', paused: 'Paused', dropped: 'Dropped', plan: 'Planned',
};

function SectionTitle({ label }: { label: string }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function OptionPicker<T extends string>({
  options, value, onChange, getLabel,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  getLabel?: (v: T) => string;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionRow}>
      {options.map(opt => {
        const active = value === opt;
        const label = getLabel ? getLabel(opt) : opt.charAt(0).toUpperCase() + opt.slice(1);
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            style={[styles.optionBtn, active && styles.optionBtnActive]}
          >
            <Text style={[styles.optionText, active && styles.optionTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function StepInput({
  value, onChange, min = 0,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: number;
}) {
  const num = parseInt(value) || 0;
  return (
    <View style={styles.stepRow}>
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onChange(String(Math.max(min, num - 1)))}
      >
        <Ionicons name="remove" size={18} color={colors.text} />
      </TouchableOpacity>
      <TextInput
        style={styles.stepInput}
        value={value}
        onChangeText={onChange}
        keyboardType="number-pad"
        placeholderTextColor={colors.textDim}
      />
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onChange(String(num + 1))}
      >
        <Ionicons name="add" size={18} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

export function FormScreen({ navigation, route }: Props) {
  const editId = route.params?.id;
  const isEditing = !!editId;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [type, setType] = useState<MediaType>('series');
  const [status, setStatus] = useState<StatusType>('watching');
  const [coverUri, setCoverUri] = useState('');
  const [totalEpisodes, setTotalEpisodes] = useState('');
  const [currentEpisode, setCurrentEpisode] = useState('');
  const [totalVolumes, setTotalVolumes] = useState('');
  const [currentVolume, setCurrentVolume] = useState('');
  const [season, setSeason] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const [finishedAt, setFinishedAt] = useState('');
  const [platform, setPlatform] = useState('');
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');
  const [totalSeasons, setTotalSeasons] = useState('');
  const [currentSeason, setCurrentSeason] = useState('');
  const [episodesInCurrentSeason, setEpisodesInCurrentSeason] = useState('');
  const [currentEpisodeInSeason, setCurrentEpisodeInSeason] = useState('');
  const [totalChapters, setTotalChapters] = useState('');
  const [currentChapter, setCurrentChapter] = useState('');
  const [chaptersInCurrentVolume, setChaptersInCurrentVolume] = useState('');
  const [currentChapterInVolume, setCurrentChapterInVolume] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [currentPage, setCurrentPage] = useState('');
  const [watchedMinutes, setWatchedMinutes] = useState('');
  const [autoCover, setAutoCover] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false); 
  

  useEffect(() => {
    if (editId) {
      const item = getMediaById(editId);
      if (!item) return;
      setTitle(item.title);
      setAuthor(item.author ?? '');
      setType(item.type);
      setStatus(item.status);
      setCoverUri(item.coverUri ?? '');
      setTotalEpisodes(item.totalEpisodes?.toString() ?? '');
      setCurrentEpisode(item.currentEpisode?.toString() ?? '');
      setTotalVolumes(item.totalVolumes?.toString() ?? '');
      setCurrentVolume(item.currentVolume?.toString() ?? '');
      setSeason(item.season?.toString() ?? '');
      setStartedAt(item.startedAt ?? '');
      setFinishedAt(item.finishedAt ?? '');
      setPlatform(item.platform ?? '');
      setRating(item.rating?.toString() ?? '');
      setNotes(item.notes ?? '');
      setTotalPages(item.totalPages?.toString() ?? '');
      setCurrentPage(item.currentPage?.toString() ?? '');
      setWatchedMinutes(item.watchedMinutes?.toString() ?? '');
      setTotalSeasons(item.totalSeasons?.toString() ?? '');
      setCurrentSeason(item.currentSeason?.toString() ?? '');
      setEpisodesInCurrentSeason(item.episodesInCurrentSeason?.toString() ?? '');
      setCurrentEpisodeInSeason(item.currentEpisodeInSeason?.toString() ?? '');
      setTotalChapters(item.totalChapters?.toString() ?? '');
      setCurrentChapter(item.currentChapter?.toString() ?? '');
      setChaptersInCurrentVolume(item.chaptersInCurrentVolume?.toString() ?? '');
      setCurrentChapterInVolume(item.currentChapterInVolume?.toString() ?? '');
      setTotalPages(item.totalPages?.toString() ?? '');
      setCurrentPage(item.currentPage?.toString() ?? '');
      setWatchedMinutes(item.watchedMinutes?.toString() ?? '');
    }
  }, [editId]);

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Required', 'Title is required.');
      return;
    }

    let finalCoverUri = coverUri.trim() || undefined;

    if (autoCover && title.trim()) {
      setLoadingCover(true);
      const found = await fetchCoverUrl(title.trim(), type);
      setLoadingCover(false);
      if (found) {
        finalCoverUri = found;
      } else {
        Alert.alert('Cover not found', 'Cannot find a cover for this title. ');
      }
    }

    const now = new Date().toISOString();
    const item: MediaItem = {
      id: editId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: title.trim(),
      author: author.trim() || undefined,
      type,
      status,
      coverUri: finalCoverUri,
      totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : undefined,
      currentEpisode: currentEpisode ? parseInt(currentEpisode) : undefined,
      totalVolumes: totalVolumes ? parseInt(totalVolumes) : undefined,
      currentVolume: currentVolume ? parseInt(currentVolume) : undefined,
      season: season ? parseInt(season) : undefined,
      startedAt: startedAt.trim() || undefined,
      finishedAt: finishedAt.trim() || undefined,
      platform: platform.trim() || undefined,
      rating: rating ? parseFloat(rating) : undefined,
      notes: notes.trim() || undefined,
      createdAt: isEditing ? '' : now,
      updatedAt: now,
      totalSeasons: totalSeasons ? parseInt(totalSeasons) : undefined,
      currentSeason: currentSeason ? parseInt(currentSeason) : undefined,
      episodesInCurrentSeason: episodesInCurrentSeason ? parseInt(episodesInCurrentSeason) : undefined,
      currentEpisodeInSeason: currentEpisodeInSeason ? parseInt(currentEpisodeInSeason) : undefined,
      totalChapters: totalChapters ? parseInt(totalChapters) : undefined,
      currentChapter: currentChapter ? parseInt(currentChapter) : undefined,
      chaptersInCurrentVolume: chaptersInCurrentVolume ? parseInt(chaptersInCurrentVolume) : undefined,
      currentChapterInVolume: currentChapterInVolume ? parseInt(currentChapterInVolume) : undefined,
      totalPages: totalPages ? parseInt(totalPages) : undefined,
      currentPage: currentPage ? parseInt(currentPage) : undefined,
      watchedMinutes: watchedMinutes ? parseInt(watchedMinutes) : undefined,
    };

    if (isEditing) {
      const existing = getMediaById(editId!);
      item.createdAt = existing?.createdAt ?? now;
      updateMedia(item);
    } else {
      insertMedia(item);
    }

    navigation.goBack();
  }

    const showEpisodes = type === 'anime' || type === 'manga';
    const showVolumes = type === 'lightnovel';
    const showSeasons = type === 'series';
    const showPages = type === 'book';
    const showMinutes = type === 'movie';
  

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit' : 'Add'}</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, loadingCover && { opacity: 0.6 }]}
          disabled={loadingCover}
        >
          <Text style={styles.saveBtnText}>
            {loadingCover ? 'Searching...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

          <SectionTitle label="Basic Info" />

          <Field label="Title *">
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Title..."
              placeholderTextColor={colors.textDim}
            />
          </Field>

          <Field label="Author / Director / Studio">
            <TextInput
              style={styles.input}
              value={author}
              onChangeText={setAuthor}
              placeholder="Author..."
              placeholderTextColor={colors.textDim}
            />
          </Field>

          <Field label="Cover URL">
            <View style={styles.coverRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={coverUri}
                onChangeText={setCoverUri}
                placeholder="https://..."
                placeholderTextColor={colors.textDim}
                autoCapitalize="none"
                editable={!autoCover}
              />
              <TouchableOpacity
                style={[styles.autoCoverBtn, autoCover && styles.autoCoverBtnActive]}
                onPress={() => setAutoCover(prev => !prev)}
              >
                <Ionicons
                  name={autoCover ? 'sparkles' : 'sparkles-outline'}
                  size={18}
                  color={autoCover ? colors.white : colors.textMuted}
                />
              </TouchableOpacity>
            </View>
            {autoCover && (
              <Text style={styles.autoCoverHint}>
                The cover will be searched automatically when saving
              </Text>
            )}
          </Field>

          <Field label="Type">
            <OptionPicker options={TYPES} value={type} onChange={setType} getLabel={t => TYPE_LABELS[t]} />
          </Field>

          <Field label="Status">
            <OptionPicker options={STATUSES} value={status} onChange={setStatus} getLabel={s => STATUS_LABELS[s]} />
          </Field>

          <SectionTitle label="Progress" />

        {showSeasons && (
          <>
            <Field label="Total seasons">
              <StepInput value={totalSeasons} onChange={setTotalSeasons} min={1} />
            </Field>
            <Field label="Current season">
              <StepInput value={currentSeason} onChange={setCurrentSeason} min={1} />
            </Field>
            <Field label="Episodes in Current Season">
              <StepInput value={episodesInCurrentSeason} onChange={setEpisodesInCurrentSeason} />
            </Field>
            <Field label="Current Episode (in season)">
              <StepInput value={currentEpisodeInSeason} onChange={setCurrentEpisodeInSeason} />
            </Field>
          </>
        )}

        {showEpisodes && type === 'anime' && (
          <>
            <Field label="Total episodes">
              <StepInput value={totalEpisodes} onChange={setTotalEpisodes} />
            </Field>
            <Field label="Current episode">
              <StepInput value={currentEpisode} onChange={setCurrentEpisode} />
            </Field>
          </>
        )}

        {showEpisodes && type === 'manga' && (
          <>
            <Field label="Total chapters">
              <StepInput value={totalChapters} onChange={setTotalChapters} />
            </Field>
            <Field label="Current chapter">
              <StepInput value={currentChapter} onChange={setCurrentChapter} />
            </Field>
          </>
        )}

        {showVolumes && (
          <>
            <Field label="Total volumes">
              <StepInput value={totalVolumes} onChange={setTotalVolumes} />
            </Field>
            <Field label="Current volume">
              <StepInput value={currentVolume} onChange={setCurrentVolume} min={1} />
            </Field>
            <Field label="Chapters in Current Volume">
              <StepInput value={chaptersInCurrentVolume} onChange={setChaptersInCurrentVolume} />
            </Field>
            <Field label="Current Chapter (in volume)">
              <StepInput value={currentChapterInVolume} onChange={setCurrentChapterInVolume} />
            </Field>
          </>
        )}

        {showPages && (
          <>
            <Field label="Total pages">
              <StepInput value={totalPages} onChange={setTotalPages} />
            </Field>
            <Field label="Current page">
              <StepInput value={currentPage} onChange={setCurrentPage} />
            </Field>
          </>
        )}

        {showMinutes && (
          <>
            <Field label="Duration (min)">
              <StepInput value={totalEpisodes} onChange={setTotalEpisodes} />
            </Field>
            <Field label="Watched minutes">
              <StepInput value={watchedMinutes} onChange={setWatchedMinutes} />
            </Field>
          </>
        )}

          <SectionTitle label="Details" />

          <Field label="Platform / Where to Watch">
            <TextInput
              style={styles.input}
              value={platform}
              onChangeText={setPlatform}
              placeholder="Netflix, Crunchyroll, physical..."
              placeholderTextColor={colors.textDim}
            />
          </Field>

          <Field label="Rating (0–10)">
            <TextInput
              style={styles.input}
              value={rating}
              onChangeText={setRating}
              placeholder="8.5"
              placeholderTextColor={colors.textDim}
              keyboardType="decimal-pad"
            />
          </Field>

          <Field label="Started at">
            <TextInput
              style={styles.input}
              value={startedAt}
              onChangeText={setStartedAt}
              placeholder="25-01-2026"
              placeholderTextColor={colors.textDim}
            />
          </Field>

          <Field label="Finished at">
            <TextInput
              style={styles.input}
              value={finishedAt}
              onChangeText={setFinishedAt}
              placeholder="21-03-2026"
              placeholderTextColor={colors.textDim}
            />
          </Field>

          <Field label="Notes">
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Your thoughts, where you stopped..."
              placeholderTextColor={colors.textDim}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </Field>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  saveBtn: {
    backgroundColor: colors.pink, paddingHorizontal: 16,
    paddingVertical: 7, borderRadius: 8,
  },
  saveBtnText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  scroll: { padding: 20, paddingBottom: 60 },
  sectionTitle: {
    fontSize: 12, color: colors.textDim, fontWeight: '700',
    letterSpacing: 1, textTransform: 'uppercase',
    marginTop: 24, marginBottom: 12,
  },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: colors.text, lineHeight: 20,
  },
  textArea: { minHeight: 100 },
  optionRow: { gap: 8, flexDirection: 'row' },
  optionBtn: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8,
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
  },
  optionBtnActive: { backgroundColor: colors.pink, borderColor: colors.pink },
  optionText: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  optionTextActive: { color: colors.white },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  stepBtn: {
    width: 40, height: 40, backgroundColor: colors.bgCard,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', borderRadius: 8,
  },
  stepInput: {
    flex: 1, height: 40, backgroundColor: colors.bgCard,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border,
    textAlign: 'center', fontSize: 15, color: colors.text, lineHeight: 20,
    paddingVertical: 0,
  },
    coverRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  autoCoverBtn: {
    width: 44, height: 44,
    borderRadius: 8,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoCoverBtnActive: {
    backgroundColor: colors.pink,
    borderColor: colors.pink,
  },
  autoCoverHint: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 6,
  },
});