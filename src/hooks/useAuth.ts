import { useContext } from 'react';

// auth provider
import AuthContext from 'contexts/JWTContext';
// import AuthContext from 'contexts/FirebaseContext';
// import AuthContext from 'contexts/AWSCognitoContext';
// import AuthContext from 'contexts/Auth0Context';

// ==============================|| HOOKS - AUTH ||============================== //

export default function useAuth() {
  const context = useContext(AuthContext);

  // If the AuthContext is null, return a fallback or default behavior
  if (!context) {
    console.warn("AuthContext is not available, returning fallback");
    return {
      isLoggedIn: false,
      user: null, // Default to no user
      login: async () => Promise.resolve(), // No-op async function for login
      logout: () => {}, // No-op function for logout
      register: async () => Promise.resolve(), // No-op function for register
      resetPassword: async () => Promise.resolve(), // No-op function for reset password
      updateProfile: () => {} // No-op function for update profile
    };
  }

  return context;
}