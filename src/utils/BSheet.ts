import store from 'redux/store';
import {ReactNode} from 'react';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';

interface IToast {
  content: ReactNode;
  /**
   * value should be in percentage
   */
  snapPoint?: string[];
  enablePanDownToClose?: boolean;
  isCloseBackhandler?: boolean;
}

export const showBSheet = ({
  content,
  snapPoint,
  enablePanDownToClose = true,
  isCloseBackhandler = false,
}: IToast) => {
  const dispatch = store.dispatch;
  const showBsheet = store.getState().utils.isShowBSHeet;
  dispatch(
    toggleBSheet({
      content,
      snapPoint,
      show: !showBsheet,
      enablePanDownToClose,
      isCloseBackhandler,
    }),
  );
};
