import { PropsWithChildren } from "react";

const PlayerError = (
  props: PropsWithChildren<{
    message?: string[];
  }>
) => (
  <div className="w-full h-full flex-xyc flex-col gap-4">
    <p>Failed to load player module.</p>
    {props.message && props.message.map((v) => <p>{v}</p>)}
  </div>
);

export default PlayerError;
