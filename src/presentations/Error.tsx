import React from "react";

export const ComponentError: React.FC<{
  message: string;
  errorInfo: React.ErrorInfo;
}> = ({ message, errorInfo }) => (
  <div className="flex-xyc flex-col p-8 gap-4 rounded-lg bg-white">
    <h1 className="text-gray-600 text-2xl font-bold">
      Oops! Something went wrong !
    </h1>
    <p className="font-bold text-2xl text-red-600">Error: {message}</p>
    <p className="text-center">
      {String(errorInfo.componentStack)
        .split("at ")
        .map((v, i) => (
          <p>
            {i > 0 ? "at " : ""}
            {v}
          </p>
        ))}
    </p>
    <p className="mt-8 font-bold">
      Please reload or change config by clicking the up-right "config" icon.
    </p>
  </div>
);
