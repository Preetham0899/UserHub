import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, Text, StyleSheet, StatusBar, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSeedRequest } from '../redux/slices/usersSlice';
import UserCard from '../components/UserCard';
import { useTranslation } from 'react-i18next'; 
import i18n from '../i18n/i18n'; 

export default function UserListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { seed, custom, loading } = useSelector((s) => s.users);

  
  const [searchQuery, setSearchQuery] = useState('');

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchSeedRequest());
  }, [dispatch]);

  // Combine both lists 
  const allUsers = useMemo(() => [...custom, ...seed], [custom, seed]);

  // Filter users by search input
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return allUsers;
    const query = searchQuery.toLowerCase();
    return allUsers.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.phone?.toString().includes(query)
    );
  }, [searchQuery, allUsers]);

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{t('NO_USERS_FOUND')}</Text>
      <Text style={styles.emptyText}>
        {t('TRY_ADD_USER')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#007AFF" barStyle="light-content" />

     
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('USER_DIRECTORY')}</Text>
      </View>

      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('SEARCH_PLACEHOLDER')}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      
      <FlatList
        data={filteredData}
        keyExtractor={(item, idx) => item.id?.toString?.() ?? `${idx}`}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchSeedRequest())}
            colors={['#007AFF']}
          />
        }
        renderItem={({ item }) => (
          <UserCard
            name={item.name}
            email={item.email}
            phone={item.phone}
            onPress={() => navigation.navigate('UserDetail', { user: item })}
          />
        )}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={filteredData.length === 0 && { flexGrow: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    backgroundColor: '#0D47A1',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  searchContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  emptyText: {
    color: '#666',
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
});
