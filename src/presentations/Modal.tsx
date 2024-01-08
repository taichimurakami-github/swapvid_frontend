import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren } from "react";

export const AppMenu: React.FC = () => {
  return <div></div>;
};

export const AppMenuModalTypeA: React.FC<
  PropsWithChildren<{
    title: string;
    visibility: boolean;
    handleClose?: () => void;
  }>
> = ({ children, title, visibility, handleClose }) => (
  <div
    className="fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[95vh] max-w-[90vw] overflow-hidden rounded-lg bg-white text-black text-lg h-full w-[90vw] max-w-[1280px] rounded-lg"
    style={{ visibility: visibility ? "visible" : "hidden" }}
  >
    <h2 className="relative py-4 px-8 bg-slate-600 text-white text-2xl font-bold mb-4">
      {title}
      <button
        className="absolute top-1/2 -translate-y-1/2 right-0 p-2"
        onClick={handleClose}
      >
        <FontAwesomeIcon className="text-3xl px-2" icon={faXmark} />
      </button>
    </h2>
    <div className="h-full p-4 overflow-scroll">{children}</div>
  </div>
);

export const AppConfigModalContainer: React.FC<
  PropsWithChildren<{ zIndex?: number; handleClose?: () => void }>
> = ({ children, zIndex, handleClose }) => {
  return (
    <div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex-xyc bg-black-transparent-01"
      style={{ zIndex: zIndex ?? "auto" }}
      onClick={handleClose}
    >
      <div
        className="w-full h-full max-h-[750px] max-w-[1154px] overflow-hidden rounded-lg bg-teal-900 z-10 text-white text-lg h-full rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const AppConfigContentContainer: React.FC<PropsWithChildren> = ({
  children,
}) => (
  <div className="bg-white text-black text-xl h-full w-full p-2 overflow-scroll">
    {children}
  </div>
);
