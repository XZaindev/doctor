// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import AuthScreen from './src/screens/AuthScreen';
import WizardScreen from './src/screens/WizardScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import PDFExportScreen from './src/screens/PDFExportScreen';

// Services
import { onAuthStateChange } from './src/services/authService';
import { colors } from './src/styles/theme';

const Stack = createNativeStackNavigator();

// Authentication Context
export const AuthContext = React.createContext();

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            isLoading: false,
            isSignedIn: action.payload !== null,
            userToken: action.payload,
            user: action.payload?.user || null,
            doctor: action.payload?.doctor || null,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignedIn: true,
            userToken: action.payload.token,
            user: action.payload.user,
            doctor: action.payload.doctor,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignedIn: false,
            userToken: null,
            user: null,
            doctor: null,
          };
        case 'SIGN_UP':
          return {
            ...prevState,
            isSignedIn: false, // User needs to verify email
            userToken: null,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignedIn: false,
      userToken: null,
      user: null,
      doctor: null,
    }
  );

  useEffect(() => {
    // Restore token and user session on app start
    const bootstrapAsync = async () => {
      let userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.error('Failed to restore session:', e);
      }

      dispatch({ type: 'RESTORE_TOKEN', payload: userToken });
    };

    bootstrapAsync();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user, doctor) => {
      if (user && doctor) {
        // Save token to AsyncStorage
        AsyncStorage.setItem('userToken', JSON.stringify({ user, doctor }));
        dispatch({
          type: 'SIGN_IN',
          payload: { token: { user, doctor }, user, doctor },
        });
      } else {
        AsyncStorage.removeItem('userToken');
        dispatch({ type: 'SIGN_OUT' });
      }
    });

    return unsubscribe;
  }, []);

  // Context value
  const authContext = React.useMemo(
    () => ({
      signIn: async (credentials) => {
        // Will be handled in AuthScreen
        dispatch({
          type: 'SIGN_IN',
          payload: credentials,
        });
      },
      signUp: async (credentials) => {
        // Will be handled in AuthScreen
        dispatch({
          type: 'SIGN_UP',
          payload: credentials,
        });
      },
      signOut: async () => {
        dispatch({ type: 'SIGN_OUT' });
      },
      signUpPending: false,
    }),
    []
  );

  if (state.isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            cardStyle: { backgroundColor: colors.background },
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
            },
            headerTintColor: colors.primary,
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
          }}
        >
          {state.isSignedIn ? (
            <>
              {/* Authenticated Screens */}
              <Stack.Screen
                name="Wizard"
                component={WizardScreen}
                options={{
                  title: 'Patient Data Collection',
                  headerLeft: () => null, // Disable back button
                }}
              />
              <Stack.Screen
                name="Summary"
                component={SummaryScreen}
                options={{
                  title: 'Patient Summary',
                }}
              />
              <Stack.Screen
                name="PDFExport"
                component={PDFExportScreen}
                options={{
                  title: 'Export Report',
                }}
              />
            </>
          ) : (
            <>
              {/* Authentication Screens */}
              <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{
                  headerShown: false,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
