// Mock implementations for @clerk/clerk-react when Clerk is disabled

export const useUser = () => ({
  user: null,
  isLoaded: true,
  isSignedIn: false,
});

export const useAuth = () => ({
  getToken: async () => null,
  isLoaded: true,
  isSignedIn: false,
  userId: null,
  sessionId: null,
  signOut: async () => {},
});

export const useSession = () => ({
  session: null,
  isLoaded: true,
});

export const useClerk = () => ({
  signOut: async () => {},
  openSignIn: () => {},
  openSignUp: () => {},
});

// Mock components
export const SignInButton = ({ children }) => children || null;
export const SignUpButton = ({ children }) => children || null;
export const SignOutButton = ({ children }) => children || null;
export const UserButton = () => null;
export const SignIn = () => null;
export const SignUp = () => null;
export const ClerkProvider = ({ children }) => children;

// Re-export everything else as no-ops
export const ClerkLoaded = ({ children }) => children;
export const ClerkLoading = () => null;
export const SignedIn = ({ children }) => null; // Hide signed-in content
export const SignedOut = ({ children }) => children; // Show signed-out content
