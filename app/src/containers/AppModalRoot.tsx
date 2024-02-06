import { appModalElementAtom } from "@/providers/jotai/store";
import { useAtom } from "jotai/react";
import React from "react";

export const AppModalRoot: React.FC<{ zIndex: number }> = ({ zIndex }) => {
  const [modalElement, dispatchModalElement] = useAtom(appModalElementAtom);

  const handleCloseModal = () => {
    dispatchModalElement({ type: "close" });
  };

  if (!modalElement) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black-transparent-01 grid place-items-center"
      style={{
        zIndex: zIndex ?? "auto",
      }}
      onClick={handleCloseModal}
    >
      {modalElement}
    </div>
  );
};
