import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '../redux/slices/authSlice';
import { addUserRequest } from '../redux/slices/usersSlice';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next'; 
import i18n from '../i18n/i18n';  


//  Zod schema for validation
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .optional(),
  website: z.string().url('Invalid URL').optional(),
});

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { loading, isConnected } = useSelector((s) => s.users);
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  
  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
  };

  //  Initialize React Hook Form with Zod resolver
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', phone: '', website: '' },
  });

  //  Submit handler
  const onSubmit = (data) => {
    dispatch(addUserRequest(data));
    reset();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#007AFF" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('PROFILE')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
       
        <View style={styles.languageContainer}>
          <Text style={styles.label}>{t('SELECT_LANGUAGE')}</Text>
          <View style={styles.langButtons}>
            <TouchableOpacity
              style={[
                styles.langButton,
                selectedLang === 'en' && styles.activeLangButton,
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text
                style={[
                  styles.langText,
                  selectedLang === 'en' && styles.activeLangText,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langButton,
                selectedLang === 'es' && styles.activeLangButton,
              ]}
              onPress={() => handleLanguageChange('es')}
            >
              <Text
                style={[
                  styles.langText,
                  selectedLang === 'es' && styles.activeLangText,
                ]}
              >
                Español
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.profileCard}>
          <Text style={styles.label}>{t('SIGNED_IN_AS')}</Text>
          <Text style={styles.value}>{user?.email}</Text>

          
        </View>

       
        <View style={styles.addCard}>
          <Text style={styles.sectionTitle}>{t('ADD_NEW_USER')}</Text>

          
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  key={selectedLang}
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder={t('NAME')}
                  value={value}
                  onChangeText={onChange}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </>
            )}
          />

          
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder={t('EMAIL')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </>
            )}
          />

         
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  placeholder={t('PHONE')}
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  maxLength={10}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone.message}</Text>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="website"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.website && styles.inputError]}
                  placeholder={t('WEBSITE')}
                  autoCapitalize="none"
                  keyboardType="URL"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.website.message}</Text>
                )}
              </>
            )}
          />

          
          <TouchableOpacity
            style={[styles.addButton, loading && { opacity: 0.7 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>
              {loading ? t('SAVING')  : t('ADD_USER')}
            </Text>
          </TouchableOpacity>
        </View>

        
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => dispatch(logoutRequest())}
        >
          <Text style={styles.logoutText}>{t('LOGOUT')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
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
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  content: { padding: 20, gap: 20 },

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
   langButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  langButton: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeLangButton: {
    backgroundColor: '#007AFF',
  },
  langText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  activeLangText: {
    color: '#fff',
  },
 
  label: { fontSize: 16, fontWeight: '600', color: '#333' },
  value: { fontSize: 16, color: '#007AFF', marginTop: 5, fontWeight: '500' },
  statusText: { marginTop: 10, fontSize: 14, fontWeight: '500' },

  addCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
    fontSize: 15,
  },
  inputError: { borderColor: '#FF3B30' },
  errorText: { color: '#FF3B30', fontSize: 13, marginBottom: 5 },

  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
