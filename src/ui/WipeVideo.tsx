import useInteractJS from "@/hooks/useInteractJS";
import React, { PropsWithChildren } from "react";

export default function WipeVideo(props: PropsWithChildren) {
  const windowWidth = 1500;
  const windowHeight = 800;
  const interactJs = useInteractJS({
    width: windowWidth,
    height: windowHeight,
  });
  return (
    <div ref={interactJs.ref} style={interactJs.style}>
      {props.children}
    </div>
  );
}
