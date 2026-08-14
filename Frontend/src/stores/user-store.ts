import { create } from "zustand";
import type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  SetActiveStatusRequest,
  ChangePasswordRequest,
} from "@/types/user";
import type { UserRole } from "@/types/enums";
import * as usersApi from "@/lib/api/users";

interface UserState {
  users: UserResponse[];
  selectedUser: UserResponse | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchUsers: (role?: UserRole) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  createUser: (data: CreateUserRequest) => Promise<UserResponse>;
  updateUser: (id: string, data: UpdateUserRequest) => Promise<UserResponse>;
  setActiveStatus: (id: string, data: SetActiveStatusRequest) => Promise<void>;
  changePassword: (id: string, data: ChangePasswordRequest) => Promise<void>;
  setSelectedUser: (user: UserResponse | null) => void;
}

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async (role?: UserRole) => {
    set({ isLoading: true, error: null });
    try {
      const users = await usersApi.getUsers(role);
      set({ users, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.detail || error?.message || "Failed to fetch users",
      });
    }
  },

  fetchUserById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await usersApi.getUserById(id);
      set({ selectedUser: user, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.detail || error?.message || "Failed to fetch user",
      });
    }
  },

  createUser: async (data: CreateUserRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await usersApi.createUser(data);
      set((state) => ({
        users: [newUser, ...state.users],
        isLoading: false,
      }));
      return newUser;
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateUser: async (id: string, data: UpdateUserRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await usersApi.updateUser(id, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        selectedUser:
          state.selectedUser?.id === id ? updatedUser : state.selectedUser,
        isLoading: false,
      }));
      return updatedUser;
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  setActiveStatus: async (id: string, data: SetActiveStatusRequest) => {
    try {
      await usersApi.setActiveStatus(id, data);
      set((state) => ({
        users: state.users.map((u) =>
          u.id === id ? { ...u, isActive: data.isActive } : u
        ),
        selectedUser:
          state.selectedUser?.id === id
            ? { ...state.selectedUser, isActive: data.isActive }
            : state.selectedUser,
      }));
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (id: string, data: ChangePasswordRequest) => {
    try {
      await usersApi.changePassword(id, data);
    } catch (error) {
      throw error;
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
}));
