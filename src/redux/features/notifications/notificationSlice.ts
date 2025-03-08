import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { NotificationInitState } from 'types/notification';
import { getNotificationSettings, updateNotificationSettings } from './notificationAPI';

const initialState: NotificationInitState = {
  data: [],
  isLoading: false,
  isError: false,
  isUpdateSuccess: false,
  errorMessage: {}, // kalo retry setelah error, harus hapus errorMessage dan isError!
};

export const notifications = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // reducers goes here
    resetNotification: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationSettings.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = {};
      })
      .addCase(getNotificationSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(getNotificationSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload as any;
      })
      .addCase(updateNotificationSettings.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isUpdateSuccess = false;
        state.errorMessage = {};
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isUpdateSuccess = false;
        state.errorMessage = action.payload;
      })
      .addCase(updateNotificationSettings.fulfilled, (state) => {
        state.isLoading = false;
        state.isUpdateSuccess = true;
      });
  },
});

export const {resetNotification} = notifications.actions;

export const notificationState = (state: RootState) => state.notification;
export default notifications.reducer;
