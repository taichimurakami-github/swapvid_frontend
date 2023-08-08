// 容量削減のため，ログの形式を簡素化
export type TMouseEventLog = [
  string, // type of event
  number, // time when event occured
  [number, number, number, number], // pointer position [MouseEvent.clientX, MouseEvent.clientY, Window.screenLeft, Window.screenTop]
  string[] // path array
];
// {
//   type: string; //"mouseup" | "mousedown" | "mousemove"
//   time: number;
//   pos: [number, number, number, number]; //[MouseEvent.clientX, MouseEvent.clientY, Window.screenLeft, Window.screenTop]
//   path: string[];
// };

export type TWheelEventLog = [
  string, // type of event
  number, // time when event occured
  [number, number], // scroll amount ([deltaX, deltaY])
  string[] // paty array
];
// {
//   type: string; //"scroll"
//   time: number;
//   deltas: number[]; //[deltaX, deltaY]
//   path: string[];
// };

export type TTimeLog = [number, number];

// {
//   name: string;
//   beginAt: number;
//   endAt: number;
// };
