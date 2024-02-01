import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren } from "react";

export const AppConfigActivatorButton: React.FC<{
  handleToggleAppConfigActive: () => void;
}> = ({ handleToggleAppConfigActive }) => (
  <button
    id="appmenu_activator"
    className="p-2"
    onClick={handleToggleAppConfigActive}
  >
    <FontAwesomeIcon
      className="text-4xl text-white user-select-none"
      icon={faGear}
    />
  </button>
);

export const AppTopMenuButtonTypeA: React.FC<
  PropsWithChildren & {
    handleButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }
> = ({ children, handleButtonClick }) => (
  <button
    className={`flex-xyc cursor-pointer rounded-md p-2 text-white font-bold bg-teal-600 hover:bg-teal-700`}
    onClick={handleButtonClick}
  >
    {children}
  </button>
);

export const VideoToolbarPanelTypeA: React.FC<
  PropsWithChildren & {
    disabled?: boolean;
    handleButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }
> = ({ children, disabled, handleButtonClick }) => (
  <button
    className={`flex-xyc cursor-pointer rounded-md w-[65px] hover:bg-gray-600 disabled:opacity-0 transition-opacity`}
    onClick={handleButtonClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export const VideoToolbarPanelTypeB: React.FC<
  PropsWithChildren & {
    disabled?: boolean;
    handleButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }
> = ({ children, disabled, handleButtonClick }) => (
  <button
    className={`relative p-2 flex-xyc rounded-md w-[65px] hover:bg-gray-600 disabled:opacity-0 transition-opacity`}
    onClick={handleButtonClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export const VideoToolbarPanelTypeC: React.FC<
  PropsWithChildren & {
    disabled?: boolean;
    handleButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }
> = ({ children, disabled, handleButtonClick }) => (
  <button
    className={`relative p-2 flex-xyc rounded-md w-[65px] hover:bg-gray-600 disabled:opacity-0 transition-opacity`}
    onClick={handleButtonClick}
    disabled={disabled}
  >
    {children}
  </button>
);
