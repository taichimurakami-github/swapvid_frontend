import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { CSSProperties, PropsWithChildren } from "react";

export const AppMenu: React.FC = () => {
  return <div></div>;
};

export const AppModalWrapper: React.FC<
  PropsWithChildren<{
    visibility: boolean;
    height?: CSSProperties["height"];
    handleClose?: () => void;
    zIndex?: number;
  }>
> = ({ children, visibility, height, handleClose, zIndex }) => (
  <div
    className="fixed flex-xyc z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-hidden rounded-lg bg-white text-black text-lg rounded-lg bg-black-transparent-01"
    style={{
      visibility: visibility ? "visible" : "hidden",
      zIndex: zIndex ?? "auto",
      height: height ?? "100%",
    }}
    onClick={handleClose}
  >
    {children}
  </div>
);

export const AppModalTypeA: React.FC<
  PropsWithChildren<{
    title: string;
    width?: CSSProperties["width"];
    height?: CSSProperties["height"];
    handleClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }>
> = ({ children, title, width, height, handleClose }) => (
  <div
    className="z-10 max-h-[90%] max-w-[80%] overflow-hidden rounded-lg bg-white text-black text-lg min-w-[50vw] max-w-[1280px] rounded-lg"
    style={{
      height: height ?? "auto",
      width: width ?? "auto",
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <h2 className="relative py-4 px-8 bg-slate-600 text-white text-2xl font-bold mb-4">
      {title}
      <button
        className="absolute top-1/2 -translate-y-1/2 right-0 p-2 disabled:hidden"
        onClick={handleClose}
        disabled={!handleClose}
      >
        <FontAwesomeIcon className="text-3xl px-2" icon={faXmark} />
      </button>
    </h2>
    <div className="flex-xyc p-4 overflow-scroll scrollbar-hidden">
      {children}
    </div>
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
