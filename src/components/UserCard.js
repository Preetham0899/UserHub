
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

export default function UserCard({ name, email, phone, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
      <View>
        <Text style={{ fontWeight: '600' }}>{name}</Text>
        <Text>{email}</Text>
        {phone ? <Text>{phone}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}
