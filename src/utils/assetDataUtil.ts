import { TAssetId } from "@/types/swapvid";

/**
 * Helper for assets importing
 * using v3 dynamic import
 */
export const loadAssetData = <T>(
  assetId: TAssetId,
  filenameWoExt: string,
  ext: string
): Promise<T | null> => {
  // [WARNING]
  // Dynamic import doesn't work except "/" just before filename,
  // and "." between filename and extension.
  // Also, "import" syntax needs literal string, not valiable of string.
  //
  return import(`@assets/${assetId}/${filenameWoExt}.${ext}`)
    .then((v) => v.default as T)
    .catch((e) => {
      console.log(e);
      return null;
    });
};
