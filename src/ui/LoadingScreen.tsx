import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export function LoadingScreen(props: { hScreen?: boolean }) {
  return (
    <div
      className="w-full bg-white text-gray-600 flex-xyc flex-col gap-4"
      style={{
        height: props.hScreen ? "100vh" : "100%",
      }}
    >
      <FontAwesomeIcon className="fa-spin-pulse text-[75px]" icon={faSpinner} />
      <p className="text-xl">Loading...</p>
    </div>
  );
}
