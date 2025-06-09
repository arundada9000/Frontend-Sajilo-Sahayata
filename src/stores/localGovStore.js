// Currently not used but can be used to store the local government name in local storage

import { create } from "zustand";

export const useLocalGovStore = create((set) => ({
  localGov: null,
  setLocalGov: (name) => set({ localGov: name }),
}));
