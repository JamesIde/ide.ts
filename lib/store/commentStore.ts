import create from "zustand";

type State = {
  isActionCompleted: boolean;
  commentCount: number;
};

type Action = {
  setIsActionCompleted: (isActionCompleted: boolean) => void;
  setCommentCount: (commentCount: number) => void;
};

export const commentStore = create<State & Action>((set) => ({
  isActionCompleted: false,
  setIsActionCompleted: (isActionCompleted: boolean) =>
    set(() => ({ isActionCompleted: isActionCompleted })),
  commentCount: 0,
  setCommentCount: (commentCount: number) =>
    set(() => ({ commentCount: commentCount })),
}));
