// src/services/authService.js
import supabase from './supabaseClient';

/**
 * Sign up doctor account
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 * @param {string} institution
 * @returns {Promise<object>}
 */
export const signUpDoctor = async (email, password, fullName, institution) => {
  try {
    // Step 1: Create auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const userId = authData?.user?.id;

    // Step 2: Create doctor profile in doctors table
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .insert([
        {
          id: userId,
          email,
          full_name: fullName,
          institution: institution || null,
        },
      ])
      .select();

    if (doctorError) {
      // If doctor profile creation fails, delete auth account
      await supabase.auth.admin.deleteUser(userId);
      throw new Error(doctorError.message);
    }

    return {
      success: true,
      user: authData.user,
      doctor: doctorData?.[0],
      message: 'Sign up successful. Please check your email for confirmation.',
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Sign in doctor
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>}
 */
export const signInDoctor = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Get doctor profile
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (doctorError) {
      throw new Error('Doctor profile not found');
    }

    return {
      success: true,
      user: data.user,
      doctor: doctorData,
      session: data.session,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Sign out doctor
 * @returns {Promise<object>}
 */
export const signOutDoctor = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'Sign out successful',
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get current doctor session
 * @returns {Promise<object>}
 */
export const getCurrentDoctor = async () => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return {
        success: false,
        user: null,
        doctor: null,
      };
    }

    // Get doctor profile
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (doctorError) {
      return {
        success: false,
        error: 'Doctor profile not found',
      };
    }

    return {
      success: true,
      user: userData.user,
      doctor: doctorData,
    };
  } catch (error) {
    console.error('Get current doctor error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Reset password (send reset email)
 * @param {string} email
 * @returns {Promise<object>}
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://your-app-domain.com/reset-password',
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'Password reset email sent',
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update doctor profile
 * @param {string} doctorId
 * @param {object} updates - { full_name, institution }
 * @returns {Promise<object>}
 */
export const updateDoctorProfile = async (doctorId, updates) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .update(updates)
      .eq('id', doctorId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      doctor: data?.[0],
    };
  } catch (error) {
    console.error('Update doctor profile error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Listen to auth state changes
 * @param {function} callback - Called when auth state changes
 * @returns {function} - Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  const { data: subscription } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        // Get doctor profile
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', session.user.id)
          .single();

        callback(session.user, doctorData);
      } else {
        callback(null, null);
      }
    }
  );

  // Return unsubscribe function
  return () => {
    subscription?.unsubscribe();
  };
};

export default {
  signUpDoctor,
  signInDoctor,
  signOutDoctor,
  getCurrentDoctor,
  resetPassword,
  updateDoctorProfile,
  onAuthStateChange,
};
