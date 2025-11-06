import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { deleteUserRequest } from '../redux/slices/usersSlice';
import { useTranslation } from 'react-i18next'; 


export default function UserDetailScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { user } = route.params;
  const { t } = useTranslation(); // Add this line to access translations
  const handleDelete = () => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteUserRequest(user.id));
            navigation.goBack(); // Go back to list after deletion
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>{user.name}</Text>
      <Text style={styles.field}>{t('EMAIL')} {user.email}</Text>
      {user.phone ? <Text style={styles.field}>{t('PHONE')}{user.phone}</Text> : null}
      {user.username ? <Text style={styles.field}>{t('ADD_NEW_USER')}{user.username}</Text> : null}
      {user.website ? <Text style={styles.field}>{t('WEBSITE')} {user.website}</Text> : null}

      <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>{t('DELETE')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  h1: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#222',
  },
  field: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  deleteBtn: {
    backgroundColor: 'tomato',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
