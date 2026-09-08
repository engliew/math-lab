"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiLogout, apiMe } from "@/lib/api";
import type { Student } from "@/lib/student";

type AuthContextValue = {
  student: Student | null;
  loading: boolean;
  setStudent: (student: Student | null) => void;
  refresh: () => Promise<Student | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await apiMe();
      setStudent(next);
      return next;
    } catch {
      setStudent(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      void (async () => {
        try {
          const next = await apiMe();
          if (!cancelled) setStudent(next);
        } catch {
          if (!cancelled) setStudent(null);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setStudent(null);
  }, []);

  const value = useMemo(
    () => ({ student, loading, setStudent, refresh, logout }),
    [student, loading, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
