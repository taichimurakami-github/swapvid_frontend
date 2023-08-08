import React, { PropsWithChildren } from "react";

export default function AbsoluteCenterWrapper(props: PropsWithChildren) {
  return (
    <div
      className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2`}
    >
      {props?.children}
    </div>
  );
}
