import accountBankReducer from './features/accountBank/accountBankSlice';
import additionalRequestReducer from './features/additionalRequests/additionalRequestSlice';
import airportVehiclesReducer from './features/airportVehicles/airportVehiclesSlice';
import appDataReducer from './features/appData/appDataSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './features/auth/authSlice';
import forgotPasswordReducer from './features/forgotPassword/forgotPasswordSlice';
import garagesReducer from './features/garages/garagesSlice';
import myBookingReducer from './features/myBooking/myBookingSlice';
import myInboxReducer from './features/inbox/myInboxSlice';
import notificationReducer from './features/notifications/notificationSlice';
import orderReducer from './features/order/orderSlice';
import rentalLocationReducer from './features/rentalLocation/rentalLocationSlice';
import userReducer from './features/user/userSlice';
import utilsReducer from './features/utils/utilsSlice';
import vehiclesReducer from './features/vehicles/vehiclesSlice';
import voucherReducer from './features/voucher/voucherSlice';
import deleteAccountReducer from './features/deleteAccount/deleteAccountSlice';
import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';

const reducers = combineReducers({
  auth: authReducer,
  utils: utilsReducer,
  forgotPassword: forgotPasswordReducer,
  appData: appDataReducer,
  myBooking: myBookingReducer,
  garages: garagesReducer,
  vehicles: vehiclesReducer,
  airportVehicles: airportVehiclesReducer,
  order: orderReducer,
  user: userReducer,
  notification: notificationReducer,
  inbox: myInboxReducer,
  additionalRequest: additionalRequestReducer,
  rentalLocation: rentalLocationReducer,
  accountBank: accountBankReducer,
  voucher: voucherReducer,
  deleteAccount: deleteAccountReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

// export const store = configureStore({
//   reducer: {
//     // counter: counterReducer,
//     appData: appDataSlice,
//     auth: authSlice,
//   },
// });
const store = configureStore({
  reducer: persistedReducer,
  // devTools: process.env.NODE_ENV !== 'production',
  // middleware: [thunk]
  // middleware: getDefaultMiddleware =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       serializableCheck: false,
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      // {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }),
});

const persistor = persistStore(store);

export {persistor};

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
