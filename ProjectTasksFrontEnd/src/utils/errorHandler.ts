import { AxiosError } from 'axios';
import { ApiError, ErrorResponse, ValidationErrors } from '../types';

/**
 * Handles different types of errors from the backend
 * @param error - The error object from axios or other sources
 * @returns ApiError object with parsed error information
 */
export const handleApiError = (error: unknown): ApiError => {
  // Check if it's an Axios error
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      const { status, data } = axiosError.response;

      // Handle validation errors (400 with field-error map)
      if (status === 400 && data && typeof data === 'object') {
        // Check if it's a validation error (Map<String, String>)
        const dataObj = data as Record<string, unknown>;

        // If it has an 'error' property, it's an ErrorResponse
        if ('error' in dataObj && 'message' in dataObj) {
          const errorResponse = data as ErrorResponse;
          return {
            type: 'error',
            status: errorResponse.status,
            error: errorResponse.error,
            message: errorResponse.message
          };
        }

        // Otherwise, it's a validation error map
        const validationErrors: ValidationErrors = {};
        Object.entries(dataObj).forEach(([key, value]) => {
          validationErrors[key] = String(value);
        });

        return {
          type: 'validation',
          status: 400,
          validationErrors,
          message: 'Please fix the validation errors'
        };
      }

      // Handle standard error responses
      if (data && typeof data === 'object' && 'message' in data) {
        const errorResponse = data as ErrorResponse;
        return {
          type: 'error',
          status: errorResponse.status || status,
          error: errorResponse.error,
          message: errorResponse.message
        };
      }

      // Handle other HTTP errors
      return {
        type: 'error',
        status,
        message: getDefaultErrorMessage(status as number)
      };
    }

    // Network error (no response from server)
    if (axiosError.request) {
      return {
        type: 'error',
        message: 'Unable to reach the server. Please check your internet connection.'
      };
    }
  }

  // Unknown error
  return {
    type: 'error',
    message: error instanceof Error ? error.message : 'An unexpected error occurred'
  };
};

/**
 * Get default error message based on HTTP status code
 */
const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Authentication failed. Please login again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A conflict occurred. The resource may already exist.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};

/**
 * Format validation errors for display
 * @param validationErrors - Object containing field-error pairs
 * @returns Formatted error message
 */
export const formatValidationErrors = (validationErrors: ValidationErrors): string => {
  return Object.entries(validationErrors)
    .map(([field, message]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      return `${fieldName}: ${message}`;
    })
    .join('\n');
};

/**
 * Format API error for display
 * @param apiError - The parsed API error
 * @returns Formatted error message
 */
export const formatApiError = (apiError: ApiError): string => {
  if (apiError.type === 'validation' && apiError.validationErrors) {
    return formatValidationErrors(apiError.validationErrors);
  }

  return apiError.message || 'An error occurred';
};



/**
 * Check if error should redirect to dedicated error page
 * @param apiError - The parsed API error
 * @returns error page path or null if should show inline
 */
export const getErrorPagePath = (apiError: ApiError): string | null => {
  if (!apiError.status) return null;

  switch (apiError.status) {
    case 403:
      return '/403';
    case 404:
      return '/404';
    case 500:
    case 502:
    case 503:
      return '/500';
    default:
      return null;
  }
};



