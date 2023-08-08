import { FieldValue, Timestamp } from "firebase/firestore";
import { TMouseEventLog, TTimeLog } from "./logger";

export type TUserData = {
  uid: string;
  email: string; //ユーザーのIDとして利用
  updatedAt: FieldValue;
  createdAt: FieldValue;
};

export type TTaskResultData = {
  createdAt: string;
  mouseEventLog: string;
  timeLog: string; //Date.now().toLocaleString()
  wheelEventLog: string;
};
