import create from "zustand";

export const useMarkerStore = create<{
  marker: number | null;
  setMarker: (marker: number) => void;
}>((set) => ({
  marker: 0,
  setMarker: (marker) => set({ marker }),
}));
