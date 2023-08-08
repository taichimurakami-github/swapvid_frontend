import React, { useEffect } from "react";
import { MainPlayerRootContainer } from "./containers/MainPlayerRootContainer";

export default function App() {
  useEffect(() => {
    (async () => {
      // await loadTimelineData("EdanMeyerVpt");
      // await loadAssetData("IEEEVR2022Hoshikawa");
    })();
  }, []);

  // return <div>test mode.</div>;
  return (
    <MainPlayerRootContainer
      // interfaceMode="parallel"
      initialInterfaceMode="combined"
      // initialAssetId="CHI2021Fujita"
      // initialAssetId="IEEEVR2022Ogawa"
      // initialAssetId="IEEEVR2022Hoshikawa"
      initialAssetId="EdanMeyerVpt"
      enableOverflowModeOnCombinedView={false}
    />
  );
}
