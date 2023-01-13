import create from "zustand";

type State = {
  isReplying: boolean;
};

type Action = {
  setIsReplying: (isReplying: boolean) => void;
};

export const editStore = create<State & Action>((set) => ({
  isReplying: true,
  setIsReplying: (isReplying: boolean) =>
    set(() => ({ isReplying: isReplying })),
}));
