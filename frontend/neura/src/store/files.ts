import { create } from "zustand";

export interface FileItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

interface FileStore {
  files: FileItem[];
  addFiles: (newFiles: FileItem[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  addFiles: (newFiles) =>
    set((state) => ({
      files: [...state.files, ...newFiles],
    })),
  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),
  clearFiles: () => set({ files: [] }),
}));
