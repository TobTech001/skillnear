import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User, UserRole } from "../types";
import { seedUsers } from "../data/Seed";
import { readStorage, writeStorage, removeStorage, STORAGE_KEYS } from "../services/Storage";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  trade?: string;
}

interface AuthContextValue {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string; user?: User };
  register: (input: RegisterInput) => { ok: boolean; error?: string; user?: User };
  logout: () => void;
  updateCurrentUser: (patch: Partial<User>) => void;
  userExists: (email: string) => boolean;
  resetPassword: (email: string, newPassword: string) => { ok: boolean; error?: string };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadUsers(): User[] {
  const existing = window.localStorage.getItem(STORAGE_KEYS.users);
  if (existing === null) {
    writeStorage(STORAGE_KEYS.users, seedUsers);
    return seedUsers;
  }
  const stored = readStorage<User[]>(STORAGE_KEYS.users, seedUsers);
  // If a new demo/seed account (e.g. admin) was added after this browser
  // already had users saved, merge it in rather than silently missing it.
  const missing = seedUsers.filter(
    (seed) => !stored.some((u) => u.id === seed.id)
  );
  if (missing.length > 0) {
    const merged = [...stored, ...missing];
    writeStorage(STORAGE_KEYS.users, merged);
    return merged;
  }
  return stored;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on first mount: if a currentUserId is stored, look up
  // the matching user record.
  useEffect(() => {
    const users = loadUsers();
    const savedId = readStorage<string | null>(STORAGE_KEYS.currentUserId, null);
    if (savedId) {
      const found = users.find((u) => u.id === savedId) ?? null;
      setCurrentUser(found);
    }
    setLoading(false);
  }, []);

  const login: AuthContextValue["login"] = (email, password) => {
    const users = loadUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!match || match.password !== password) {
      return { ok: false, error: "Incorrect email or password." };
    }
    if (match.suspended) {
      return {
        ok: false,
        error: "This account has been suspended. Contact support.",
      };
    }
    writeStorage(STORAGE_KEYS.currentUserId, match.id);
    setCurrentUser(match);
    return { ok: true, user: match };
  };

  const register: AuthContextValue["register"] = ({
    name,
    email,
    password,
    role,
    trade,
  }) => {
    const users = loadUsers();
    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (emailTaken) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      trade: role === "provider" ? trade : undefined,
    };
    const updated = [...users, newUser];
    writeStorage(STORAGE_KEYS.users, updated);
    writeStorage(STORAGE_KEYS.currentUserId, newUser.id);
    setCurrentUser(newUser);
    return { ok: true, user: newUser };
  };

  const logout = () => {
    removeStorage(STORAGE_KEYS.currentUserId);
    setCurrentUser(null);
  };

  const updateCurrentUser = (patch: Partial<User>) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...patch };
      const users = loadUsers().map((u) =>
        u.id === updatedUser.id ? updatedUser : u
      );
      writeStorage(STORAGE_KEYS.users, users);
      return updatedUser;
    });
  };

  const userExists = (email: string) => {
    const users = loadUsers();
    return users.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
  };

  const resetPassword: AuthContextValue["resetPassword"] = (email, newPassword) => {
    const users = loadUsers();
    const target = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!target) {
      return { ok: false, error: "No account found with that email." };
    }
    const updated = users.map((u) =>
      u.id === target.id ? { ...u, password: newPassword } : u
    );
    writeStorage(STORAGE_KEYS.users, updated);
    // If this happens to be the signed-in user, keep the session in sync.
    if (currentUser?.id === target.id) {
      setCurrentUser({ ...target, password: newPassword });
    }
    return { ok: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        updateCurrentUser,
        userExists,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}