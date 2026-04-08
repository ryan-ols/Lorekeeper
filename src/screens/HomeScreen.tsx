import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAllMedia } from '../db/database';
import { CatalogCard } from '../components/CatalogCard';
import { FilterTabs } from '../components/FilterTabs';
import { MediaItem, StatusType } from '../types';
import { colors } from '../theme/colors';
import { SortModal, SortOption } from '../components/SortModal';
import { RootStackParamList } from '../../App';
import { getProgress } from '../utils/progress';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<StatusType | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('recent');
  const [showSort, setShowSort] = useState(false);
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      setItems(getAllMedia());
    }, [])
  );

  const filtered = React.useMemo(() => {
  let list = filter === 'all' ? items : items.filter(i => i.status === filter);
   if (search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.author?.toLowerCase().includes(q)
    );
  }

  switch (sort) {
    case 'name_asc':
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name_desc':
      list = [...list].sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'progress_asc':
      list = [...list].sort((a, b) => {
        const { current: ca, total: ta } = getProgress(a);
        const { current: cb, total: tb } = getProgress(b);
        const pa = ta > 0 ? ca / ta : 0;
        const pb = tb > 0 ? cb / tb : 0;
        return pa - pb;
      });
      break;
    case 'progress_desc':
      list = [...list].sort((a, b) => {
        const { current: ca, total: ta } = getProgress(a);
        const { current: cb, total: tb } = getProgress(b);
        const pa = ta > 0 ? ca / ta : 0;
        const pb = tb > 0 ? cb / tb : 0;
        return pb - pa;
      });
      break;
    case 'rating':
      list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case 'recent':
    default:
      list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
  }

  return list;
}, [items, filter, sort, search]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.header}>
        <Text style={styles.title}>LoreKeeper</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowSort(true)}>
          <Ionicons name="options-outline" size={22} color={showSort ? colors.pink : colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color={colors.textDim} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar..."
          placeholderTextColor={colors.textDim}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={colors.textDim} />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ height: 50 }}>
        <FilterTabs active={filter} onChange={setFilter} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <CatalogCard
            item={item}
            onPress={() => navigation.navigate('Detail', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nada por aqui ainda.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: 16 + insets.bottom }]}
        onPress={() => navigation.navigate('Form', {})}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>

      <SortModal
        visible={showSort}
        current={sort}
        onSelect={setSort}
        onClose={() => setShowSort(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 16, paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  iconBtn: { padding: 4 },
  list: { paddingBottom: 100 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: colors.textDim, fontSize: 14 },
  fab: {
    position: 'absolute', right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.pink,
    alignItems: 'center', justifyContent: 'center',
    elevation: 6,
  },
    searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgCard, borderWidth: 1,
    borderColor: colors.border, borderRadius: 10,
    paddingHorizontal: 12, marginHorizontal: 20, marginBottom: 16, height: 40,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20, paddingVertical: 0 },
});