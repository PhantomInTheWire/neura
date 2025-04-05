import { useCallback, useRef } from "react";
import { useFileStore, FileItem } from "@/store/files";
import { useShallow } from "zustand/shallow";

export function useFileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addFiles, removeFile] = useFileStore(
    useShallow((state) => [state.addFiles, state.removeFile])
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (fileList) {
        const filesArray = Array.from(fileList).map((file) => ({
          id: crypto.randomUUID(),
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size,
          file: file,
        }));
        addFiles(filesArray);
      }
      // Reset input value to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [addFiles]
  );

  return {
    fileInputRef,
    handleFileChange,
    removeFile,
  };
}
