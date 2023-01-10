import create from "zustand";
import { User } from "../../@types/Profile";
import { useEffect } from "react";

type State = {
  user: User;
};

type Action = {
  setUser: (user: User) => void;
  removeUser: () => void;
};

export const useStore = create<State & Action>()((set) => ({
  user: handleTest(),
  setUser: (user: User) => set(() => ({ user: user })),
  removeUser: () => set(() => ({ user: null })),
}));

export function handleTest() {
  if (typeof window !== "undefined") {
    // Perform localStorage action
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    return user;
  }
}
