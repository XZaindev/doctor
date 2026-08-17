// src/screens/AuthScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FormField, Button, Card } from '../components';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';
import { signInDoctor, signUpDoctor } from '../services/authService';
import { AuthContext } from '../App';

export default function AuthScreen() {
  const { signIn } = React.useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign up form state
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle sign in
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signInDoctor(email, password);

      if (result.success) {
        // Save session
        await AsyncStorage.setItem(
          'userToken',
          JSON.stringify({ user: result.user, doctor: result.doctor })
        );
        signIn({ token: { user: result.user, doctor: result.doctor }, user: result.user, doctor: result.doctor });
      } else {
        Alert.alert('Sign In Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign up
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUpDoctor(email, password, fullName, institution);

      if (result.success) {
        Alert.alert(
          'Sign Up Successful',
          'Please check your email for verification. You can sign in after verifying your email.'
        );
        setIsSignUp(false);
        // Reset form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setInstitution('');
      } else {
        Alert.alert('Sign Up Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>🏥 ANEMIA RESEARCH</Text>
          <Text style={styles.appSubtitle}>Data Collection System</Text>
        </View>

        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            {isSignUp
              ? 'Register as a healthcare provider'
              : 'Sign in to access the study data collection tool'}
          </Text>
        </Card>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email */}
          <FormField
            label="Email Address"
            placeholder="your.email@institution.org"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            required
          />

          {/* Full Name (Sign Up Only) */}
          {isSignUp && (
            <FormField
              label="Full Name"
              placeholder="Dr. First Last"
              value={fullName}
              onChangeText={setFullName}
              required
            />
          )}

          {/* Institution (Sign Up Only) */}
          {isSignUp && (
            <FormField
              label="Institution/Hospital"
              placeholder="Your hospital or research center"
              value={institution}
              onChangeText={setInstitution}
              helperText="Optional - helps identify your organization"
            />
          )}

          {/* Password */}
          <FormField
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            required
          />

          {/* Confirm Password (Sign Up Only) */}
          {isSignUp && (
            <FormField
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              required
            />
          )}

          {/* Terms & Conditions (Sign Up Only) */}
          {isSignUp && (
            <Text style={styles.termsText}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          )}
        </View>

        {/* Primary Button */}
        <Button
          label={isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          onPress={isSignUp ? handleSignUp : handleSignIn}
          disabled={isLoading}
          style={styles.primaryButton}
        />

        {/* Secondary Button */}
        <Button
          label={isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          onPress={() => {
            setIsSignUp(!isSignUp);
            // Reset form
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setFullName('');
            setInstitution('');
          }}
          variant="secondary"
          style={styles.secondaryButton}
        />

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This app is for authorized healthcare professionals only.
          </Text>
          <Text style={styles.footerText}>
            For technical support, contact: support@anemiaresearch.org
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  appTitle: {
    fontSize: typography.size.h2,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  appSubtitle: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
  },
  welcomeCard: {
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
  },
  welcomeTitle: {
    fontSize: typography.size.h4,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  formContainer: {
    marginBottom: spacing.xl,
  },
  termsText: {
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  primaryButton: {
    marginBottom: spacing.md,
  },
  secondaryButton: {
    marginBottom: spacing.xl,
  },
  footer: {
    marginTop: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.size.caption,
    color: colors.textTertiary,
    marginVertical: spacing.xs,
    textAlign: 'center',
  },
});
