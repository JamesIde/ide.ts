import create from "zustand";

type State = {
  isActionCompleted: boolean;
};

type Action = {
  setIsActionCompleted: (isActionCompleted: boolean) => void;
};

export const commentStore = create<State & Action>((set) => ({
  isActionCompleted: false,
  setIsActionCompleted: (isActionCompleted: boolean) =>
    set(() => ({ isActionCompleted: isActionCompleted })),
}));
