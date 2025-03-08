import {createSlice} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';
import {
  forgotPasswordConfirmation,
  // forgotPasswordConfirmation,
  forgotPasswordRequest,
  forgotPasswordReset,
} from './forgotPasswordAPI';

interface IInitState {
  data: {
    token?: string;
    session?: string;
  };
  status:
    | 'idle'
    | 'loading_request'
    | 'success_request'
    | 'failed_request'
    | 'loading_confirmation'
    | 'success_confirmation'
    | 'failed_confirmation'
    | 'loading_reset'
    | 'success_reset'
    | 'failed_reset';
  error: any;
}

const initialState: IInitState = {
  data: {
    token: '',
    session: '',
  },
  status: 'idle',
  error: null,
};

export const forgotPassword = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(forgotPasswordRequest.pending, state => {
        state.status = 'loading_request';
      })
      .addCase(forgotPasswordRequest.rejected, (state, action) => {
        state.status = 'failed_request';
        state.error = action.payload;
      })
      .addCase(forgotPasswordRequest.fulfilled, (state, action) => {
        state.status = 'success_request';
        state.data = action.payload as any;
        state.error = null;
      })
      .addCase(forgotPasswordConfirmation.pending, state => {
        state.status = 'loading_confirmation';
      })
      .addCase(forgotPasswordConfirmation.rejected, (state, action) => {
        state.status = 'failed_confirmation';
        state.error = action.payload;
      })
      .addCase(forgotPasswordConfirmation.fulfilled, state => {
        state.status = 'success_confirmation';
        state.error = null;
      })
      .addCase(forgotPasswordReset.pending, state => {
        state.status = 'loading_reset';
      })
      .addCase(forgotPasswordReset.rejected, (state, action) => {
        state.status = 'failed_reset';
        state.error = action.payload;
      })
      .addCase(forgotPasswordReset.fulfilled, (state, action) => {
        state.status = 'success_reset';
        state.data = action.payload as any;
        state.error = null;
      });
  },
});

export const forgotPasswordState = (state: RootState) => state.forgotPassword;
export default forgotPassword.reducer;
