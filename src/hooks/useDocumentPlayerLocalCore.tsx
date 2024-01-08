import { useEffect } from "react";
import {
  useDispatchDocumentPlayerStateCtx,
  useDocumentPlayerElementCtx,
} from "./useContextConsumer";

const useXXTest = () => {
  const dispatchDocumentPlayerState = useDispatchDocumentPlayerStateCtx();
  const elems = useDocumentPlayerElementCtx();

  const useTest = () => {
    useEffect(() => {
      return;
    }, []);
  };
};
