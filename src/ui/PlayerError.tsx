import { PropsWithChildren } from "react";

export default function PlayerError(
  props: PropsWithChildren<{
    message?: string[];
  }>
) {
  return (
    <div className="w-full h-full flex-xyc flex-col gap-4">
      <p>Failed to load player module.</p>
      {props.message && props.message.map((v) => <p>{v}</p>)}
    </div>
  );
}
