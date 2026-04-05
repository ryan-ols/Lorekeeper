import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAllMedia } from '../db/database';
import { CatalogCard } from '../components/CatalogCard';
import { FilterTabs } from '../components/FilterTabs';
import { MediaItem, StatusType } from '../types';
import { colors } from '../theme/colors';

type RootStackParamList = {
  Home: undefined;
  Detail: { id: string };
  Form: { id?: string };
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<StatusType | 'all'>('all');

  useFocusEffect(
    useCallback(() => {
      setItems(getAllMedia());
    }, [])
  );

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.header}>
        <Text style={styles.title}>My Catalog</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="options-outline" size={22} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <FilterTabs active={filter} onChange={setFilter} />

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
            <Text style={styles.emptyText}>Nothing here yet.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Form', {})}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
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
    position: 'absolute', bottom: 28, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.pink,
    alignItems: 'center', justifyContent: 'center',
    elevation: 6,
  },
});