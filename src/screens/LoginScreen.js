import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../redux/slices/authSlice';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


const userSchema = z.object({
  
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginScreen({ navigation }) {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const { loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(userSchema),
      defaultValues: {  email: '', password: '' },
    });

  const onSubmit = (data) => {
      console.log(' Registered:', data);
      dispatch(loginRequest(data)); 
      reset();
    };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back </Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                </>
              )}
            />
      

       <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                </>
              )}
            />

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
              {loading ? (
  <ActivityIndicator color="#fff" testID="ActivityIndicator" />
) : (
  <Text style={styles.buttonText}>LogIn</Text>
)}
            </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don’t have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 25,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
