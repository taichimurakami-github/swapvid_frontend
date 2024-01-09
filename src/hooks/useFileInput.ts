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
