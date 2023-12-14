import { UIELEM_ID_LIST } from "@/app.config";
import React, { PropsWithChildren } from "react";

export const PoCUserStudyTaskSubmissionForm = (
  props: PropsWithChildren<{
    handleCloseForm: () => void;
  }>
) => (
  <div
    id={UIELEM_ID_LIST.system.taskPlayer.taskSubmitFormWrapper}
    className="absolute top-0 left-0 w-full h-full bg-black-transparent-01 flex-xyc"
    onClick={props.handleCloseForm}
  >
    <div className="bg-gray-200 rounded-md p-[50px] font-bold text-xl">
      <h3 className="mb-10">Are you sure to submit this task?</h3>
      <div className="flex justify-evenly gap-8 text-white w-full">
        <button
          className="rounded-full bg-red-600 p-4 min-w-[100px]"
          onClick={props.handleCloseForm}
        >
          Yes
        </button>
        <button
          className="rounded-full bg-gray-500 p-4 min-w-[100px]"
          onClick={props.handleCloseForm}
        >
          No
        </button>
      </div>
    </div>
  </div>
);
