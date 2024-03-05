import React, { PropsWithChildren, useCallback, useRef, useState } from "react";

export const AppConfigMenuSectionContainer: React.FC<
  PropsWithChildren<{ title?: string }>
> = ({ children, title }) => (
  <div className="mb-8">
    {title && (
      <h3 className="select-none mx-auto flex-xyc text-center font-bold text-xl text-gray-600 p-2 mb-2">
        {title}
      </h3>
    )}
    <div className="divide-y divide-gray-300">{children}</div>
  </div>
);

export const AppConfigLinkItem: React.FC<
  PropsWithChildren<{ disabled?: boolean; handleClick?: () => void }>
> = ({ children, disabled, handleClick }) => (
  <a
    className={`select-none p-4 block ${
      disabled ? "" : "hover:bg-slate-300 cursor-pointer"
    }`}
    style={{ opacity: disabled ? 0.5 : 1 }}
    onClick={!disabled ? handleClick : undefined}
  >
    {children}
  </a>
);

export type TAppConfigMultipleSelectProps<T extends string> = {
  selectElementId: string;
  labelText: string;
  options: { value: T; name: string }[];
  currentValue: T;
  handleSetValue: (selectedOptions: T) => void;
};

export const AppConfigMultipleSelect = <T extends string>(
  props: TAppConfigMultipleSelectProps<T>
) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const { labelText, options, currentValue, selectElementId, handleSetValue } =
    props;

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleSetValue(e.currentTarget.value as T);
  };

  return (
    <div className="flex flex-wrap items-center justify-between p-4">
      <label htmlFor={selectElementId}>{labelText}</label>
      <select
        name="app_config_multiple_input"
        id={selectElementId}
        className="cursor-pointer p-2 border-2 border-teal-500 rounded-md font-bold text-teal-600"
        ref={selectRef}
        onChange={handleSelect}
        value={currentValue}
      >
        {options.map((v) => (
          <option value={v.value} key={v.value}>
            {v.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export type TAppConfigInputProps = {
  labelText: string;
  currentValue: string;
  handleSetValue: (selectedOptions: string) => void;
};

export const AppConfigInput = (props: TAppConfigInputProps) => {
  const { labelText, currentValue, handleSetValue } = props;

  const [inputValue, setInputValue] = useState<string>(currentValue);
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.currentTarget.value);
    },
    []
  );

  const handleSubmit = useCallback(() => {
    handleSetValue(inputValue);
  }, [handleSetValue, inputValue]);

  const isAcceptable = inputValue && inputValue !== currentValue;

  return (
    <div className="flex flex-wrap items-center justify-between p-4">
      <label htmlFor="app_config_input">{labelText}</label>
      <div className="flex gap-4">
        <input
          className="px-2 rounded-sm border-2 border-teal-600"
          onChange={handleInputChange}
          value={inputValue}
        />
        <button
          className="px-4 py-2 cursor-pointer text-white font-bold rounded-lg disabled:bg-gray-300 bg-gray-500 hover:bg-gray-600"
          disabled={!isAcceptable}
          onClick={handleSubmit}
        >
          Update
        </button>
      </div>
    </div>
  );
};
