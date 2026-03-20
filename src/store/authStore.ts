import { create } from "zustand";

type Role = "admin" | "student" | null;

interface AuthState {
  role: Role;
  studentId: string | null;
  loginAsAdmin: () => void;
  loginAsStudent: (studentId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  studentId: null,
  loginAsAdmin: () =>
    set(() => ({
      role: "admin",
      studentId: null,
    })),
  loginAsStudent: (studentId: string) =>
    set(() => ({
      role: "student",
      studentId,
    })),
  logout: () =>
    set(() => ({
      role: null,
      studentId: null,
    })),
}));

