import React, { useCallback, useState } from "react";

export function useFileInput() {
  const [file, setFile] = useState<null | File>(null);

  const handleOnInputChange = useCallback(
    (v: React.ChangeEvent<HTMLInputElement>) => {
      v.currentTarget.files && setFile(v.currentTarget.files[0]);
    },
    []
  );

  return {
    file,
    handleOnInputChange,
  };
}

export function useMultipleFilesInput() {
  const [files, setFiles] = useState<null | FileList>(null);

  const handleOnInputChange = useCallback(
    (v: React.ChangeEvent<HTMLInputElement>) => {
      v.currentTarget.files && setFiles(v.currentTarget.files);
    },
    []
  );

  return {
    files,
    handleOnInputChange,
  };
}
