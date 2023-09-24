import { TBoundingBox } from "@/@types/types";

export const applyToEachBboxCood = (
  srcBbox: TBoundingBox,
  applyFunc: (elementValue: number) => number
) => srcBbox.map((point) => point.map((v) => applyFunc(v)));

export const applyToEachBboxPoint = (
  srcBbox: TBoundingBox,
  applyFunc: (positionValue: [number, number]) => [number, number]
) => srcBbox.map((point) => applyFunc(point));

export const getZeroBbox = (): TBoundingBox => [
  [0.0, 0.0],
  [0.0, 0.0],
];

export const cvtToWHArray = (value: TBoundingBox) => [
  value[1][0] - value[0][0], // width
  value[1][1] - value[0][1], // height
];

export const cvtToTLWHArray = (value: TBoundingBox) => [
  value[0][1], // top
  value[0][0], // left
  value[1][0] - value[0][0], //width
  value[1][1] - value[0][1], //height
];

export const calcBboxArea = (value: TBoundingBox) => {
  const [width, height] = cvtToWHArray(value);
  return width * height;
};
