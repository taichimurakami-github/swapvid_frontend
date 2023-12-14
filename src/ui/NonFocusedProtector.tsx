import { UIELEM_ID_LIST } from "@/app.config";
import { useAppCommonCtx } from "@hooks/useAppContext";

export const NonFocusedProtector = () => {
  const { focused } = useAppCommonCtx();

  return (
    <>
      {!focused && (
        <div
          id={UIELEM_ID_LIST.system.documentPlayer.nonFocusProtector}
          className="absolute top-0 left-0 w-full h-full bg-black-transparent-01 flex-xyc text-2xl text-white font-bold z-100"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onWheel={(e) => {
            e.stopPropagation();
          }}
        >
          スクロールするにはクリックしてください
        </div>
      )}
    </>
  );
};
