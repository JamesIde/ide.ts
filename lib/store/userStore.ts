import create from "zustand";
import { User } from "../../@types/Profile";

type State = {
  user: User;
};

type Action = {
  setUser: (user: User) => void;
  removeUser: () => void;
};

export const useStore = create<State & Action>()((set) => ({
  user: getUserFromStorage(),
  // Set user in local storage too
  setUser: (user: User) => set(() => ({ user: user })),
  removeUser: () => set(() => ({ user: null })),
}));

export function getUserFromStorage() {
  // Wait until client and window object have been rendered. Next renders server content first..
  if (typeof window !== "undefined") {
    // Perform localStorage action
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    return user;
  }
}
