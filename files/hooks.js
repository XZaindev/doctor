// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../App';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContext');
  }
  return context;
};

// src/hooks/useFormData.js
import { useState, useCallback } from 'react';

export const useFormData = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateMultipleFields = useCallback((updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
  }, [initialData]);

  const getField = useCallback((field, defaultValue = null) => {
    return formData[field] ?? defaultValue;
  }, [formData]);

  return {
    formData,
    updateField,
    updateMultipleFields,
    resetForm,
    getField,
    setFormData,
  };
};

// src/hooks/useAsyncOperation.js
import { useState, useCallback } from 'react';

export const useAsyncOperation = (asyncFunction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await asyncFunction(...args);
        setResult(response);
        return response;
      } catch (err) {
        setError(err.message || 'An error occurred');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction]
  );

  return { execute, isLoading, error, result };
};

// src/hooks/index.js
export { useAuth } from './useAuth';
export { useFormData } from './useFormData';
export { useAsyncOperation } from './useAsyncOperation';
