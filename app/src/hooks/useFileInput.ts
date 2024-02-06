import React, { useCallback, useState } from "react";

export function useFileInput(
  onInputChangeHook?: (v: React.ChangeEvent<HTMLInputElement>) => void
) {
  const [file, setFile] = useState<null | File>(null);

  const handleOnInputChange = useCallback(
    (v: React.ChangeEvent<HTMLInputElement>) => {
      v.currentTarget.files && setFile(v.currentTarget.files[0]);
      onInputChangeHook && onInputChangeHook(v);
    },
    [onInputChangeHook]
  );

  return {
    file,
    setFile,
    handleOnInputChange,
  };
}

export function useMultipleFilesInput(
  onInputChangeHook?: (v: React.ChangeEvent<HTMLInputElement>) => void
) {
  const [files, setFiles] = useState<null | FileList>(null);

  const handleOnInputChange = useCallback(
    (v: React.ChangeEvent<HTMLInputElement>) => {
      v.currentTarget.files && setFiles(v.currentTarget.files);
      onInputChangeHook && onInputChangeHook(v);
    },
    [onInputChangeHook]
  );

  return {
    files,
    setFiles,
    handleOnInputChange,
  };
}
