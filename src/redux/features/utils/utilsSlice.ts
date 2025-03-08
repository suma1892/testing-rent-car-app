import {createSlice} from '@reduxjs/toolkit';
import {ReactNode} from 'react';
import {RootState} from 'redux/store';

interface IInit {
  isShowLoader: boolean;
  isShowToast: boolean;
  titleToast: string;
  messageToast: string;
  isShowBSHeet: boolean;
  contentBsheet?: ReactNode;
  enablePanDownToClose: boolean;
  isCloseBackhandler?: boolean;
  typeToast: 'success' | 'warning' | 'error';
  snapPoint?: [string, string];
  lang: 'cn' | 'id' | 'en';
  currency: 'IDR' | 'USD';
}
const initialState: IInit = {
  isShowLoader: false,
  isShowToast: false,
  titleToast: '',
  messageToast: '',
  typeToast: 'success',
  isShowBSHeet: false,
  contentBsheet: undefined,
  snapPoint: undefined,
  lang: 'id',
  currency: 'IDR',
  enablePanDownToClose: false,
};

export const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    toggleLoader: (state, action) => {
      state.isShowLoader = action.payload;
    },
    toggleToast: (state, action) => {
      state.isShowToast = action.payload.show;
      state.messageToast = action.payload.message;
      state.titleToast = action.payload.title;
      state.typeToast = action.payload.type;
    },
    toggleBSheet: (state, action) => {
      state.isShowBSHeet = action.payload.show;
      state.contentBsheet = action.payload.content;
      state.snapPoint = action.payload.snapPoint;
      state.enablePanDownToClose = action.payload.enablePanDownToClose;
      state.isCloseBackhandler = action.payload?.isCloseBackhandler;
    },
    changeLanguage: (state, action) => {
      state.lang = action.payload;
    },
    setGlobalCurrency: (state, action) => {
      state.currency = action.payload;
    },
  },
});

export const {toggleLoader, toggleToast, toggleBSheet, changeLanguage} =
  utilsSlice.actions;

export const utilsState = (state: RootState) => state.utils;
export default utilsSlice.reducer;
