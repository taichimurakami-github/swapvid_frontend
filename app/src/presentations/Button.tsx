import { faCircle, faGear } from "@fortawesome/free-solid-svg-icons";
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

export const AppConfigToggle: React.FC<{
  labelText: string;
  currentValue: boolean;
  handleClick: () => void;
  disabled?: boolean;
}> = ({ labelText, currentValue, handleClick, disabled }) => (
  <div className="flex flex-wrap items-center justify-between w-full p-4">
    <label htmlFor="app_config_toggle">{labelText}</label>
    <button
      className={`relative p-2 rounded-full cursor-pointer text-white font-bold w-20 h-11 disabled:opacity-40 ${
        currentValue ? "bg-teal-600" : "bg-gray-600"
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      <FontAwesomeIcon
        icon={faCircle}
        className={`absolute top-1/2 -translate-y-1/2 text-4xl text-white ${
          currentValue ? "right-1" : "left-1"
        }`}
        style={{ transition: "left right 0.1s ease-in-out" }}
      />
    </button>
  </div>
);
