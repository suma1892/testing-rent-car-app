import AsyncStorage from '@react-native-async-storage/async-storage';
import {AIRPORT_LOCATION_DEFAULT} from 'utils/constants';
import {createSlice} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import {RootState} from '../../store';
import {
  IBanks,
  ICities,
  IFacilityType,
  IFormAirportTransfer,
  IFormDaily,
  IGarages,
  IGlobalConfig,
  IPayments,
  IServiceType,
  IShuttle,
  ISubServiceType,
  IUserData,
  IUserProfile,
} from 'types/global.types';
import {
  getAboutUsImage,
  getAllCities,
  getBanks,
  getBanners,
  getGarages,
  getGlobalConfigs,
  getPayments,
  getRefferalPoint,
  getShuttle,
  getUser,
} from './appDataAPI';

interface IInitState {
  status: string;
  cities: ICities[];
  globalConfig: IGlobalConfig[];
  searchHistory?: ICities;
  isLoading: boolean;
  userData: IUserData;
  userProfile: IUserProfile;
  formDaily: IFormDaily;
  formAirportTransfer: IFormAirportTransfer;
  garages: IGarages[];
  payments: IPayments[];
  banks: IBanks[];
  aboutUsImages: any[];
  languages: 'id' | 'en';
  onboarding: boolean;
  banners: any[];
  refferal_point: {point: string; user_id: string; user_name: string};
  shuttle: IShuttle;
  service_type: IServiceType;
  sub_service_type: ISubServiceType;
  facility_type: IFacilityType;
  voucher_ids: number[];
}

const initialState: IInitState = {
  status: '',
  cities: [],
  globalConfig: [],
  searchHistory: undefined,
  isLoading: false,
  aboutUsImages: [],
  userData: {
    fullname: '',
    email: '',
    phone: '',
    code: '',
    wa: '',
    wa_code: '',
    password: '',
    password_confirmation: '',
    registration_type: 'email',
  },
  formDaily: {
    limit: 10,
    passanger: 4,
    price_sort: 'asc',
    start_trip: '',
    end_trip: '',
    location: '',
    additional_item: [],
    page: 1,
    vehicle_id: 0,
    end_booking_date: '',
    end_booking_time: '',
    start_booking_date: '',
    start_booking_time: '',
    with_driver: false,
    location_id: 0,
    booking_zones: [],
    need_update: false,
    order_booking_zone: [],
    duration: 0,
    vehicle_category_id: 0,
    pasengger_number: 0,
    order_voucher: [],
    sub_service_id: 0,
    point: '',
    selected_location: {
      id: 0,
      name: '',
      time_zone: '',
      time_zone_identifier: '',
      currency: null,
    },
    facility_id: 0,
    refresh_data: false,
  },
  formAirportTransfer: {
    pickup_location: AIRPORT_LOCATION_DEFAULT,
    dropoff_location: AIRPORT_LOCATION_DEFAULT,
    pickup_date: '',
    pickup_time: '',
    price_sort: 'asc',
    limit: 10,
    page: 1,
    sub_service_id: 0,
    passanger: 0,
    vehicle_id: 0,
    vehicle_category_id: 0,
    airport_transfer_package_id: 0,
    is_switched: false,
    adults: 1,
    child: 0,
    flight_number: '',
    large_suitcase: 0,
    meet_and_greet_name: '',
    suitcase: 1,
  },
  userProfile: {
    email: '',
    id: '',
    name: '',
    personal_info: {
      ktp: '',
      sim: '',
      need_review_sim: false,
      need_review_ktp: false,
    },
    phone: '',
    phone_code: '',
    wa_number: '',
    photo_profile: '',
    refferal: '',
    account_bank: {
      created_at: '',
      deleted_at: '',
      id: '',
      nama_bank: '',
      nama_rek: '',
      no_rek: '',
      status: '',
      updated_at: '',
      user_id: '',
    },
  },
  garages: [],
  payments: [],
  banks: [],
  shuttle: {
    pagination: {
      last_page: 1,
      limit: 0,
      page: 0,
      sort: null,
      total_data: 15,
    },
    shuttle: [],
  },
  languages: 'id',
  onboarding: false,
  banners: [],
  refferal_point: {
    point: '',
    user_id: '',
    user_name: '',
  },
  service_type: 'Sewa Mobil',
  sub_service_type: 'Daily',
  facility_type: 'Without Driver',
  voucher_ids: [],
};

export const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    saveFormRegister: (state, action) => {
      state.userData.code = action.payload?.code;
      state.userData.email = action.payload?.email;
      state.userData.fullname = action.payload?.fullname;
      state.userData.phone = action.payload?.phone;
      state.userData.wa = action.payload?.wa;
      state.userData.wa_code = action.payload?.wa_code;
      state.userData.password = action.payload?.password;
      state.userData.password_confirmation =
        action.payload?.password_confirmation;
      state.userData.registration_type = action.payload?.registration_type;
    },
    resetFormDaily: (state, action) => {
      state.formDaily = {
        ...initialState.formDaily,
        with_driver: action.payload?.with_driver,
      };
    },
    setSelectedVoucher: (state, action) => {
      state.voucher_ids = action.payload;
    },
    saveFormDaily: (state, action) => {
      console.log('action.payload = ', JSON.stringify(action.payload));
      state.formDaily = action.payload;
    },
    toggleLanguages: (state, action) => {
      state.languages = action.payload;
    },
    setSearchHistory: (state, action) => {
      state.searchHistory = action.payload;
    },
    toggleOnboarding: (state, action) => {
      state.onboarding = action.payload;
    },
    setServiceType: (state, action) => {
      state.service_type = action.payload;
    },
    setSubServiceType: (state, action) => {
      state.sub_service_type = action.payload;
    },
    setFacilityType: (state, action) => {
      state.facility_type = action.payload;
    },
    saveFormAirportTransfer: (state, action) => {
      state.formAirportTransfer = action.payload;
    },
    reseFormAirportTransfer: state => {
      state.formAirportTransfer = {
        ...initialState.formAirportTransfer,
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getGlobalConfigs.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getGlobalConfigs.fulfilled, (state, action) => {
        state.status = 'idle';
        state.globalConfig = action.payload?.data;
        state.isLoading = false;
      })
      .addCase(getGlobalConfigs.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      .addCase(getAllCities.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getAllCities.fulfilled, (state, action) => {
        state.status = 'idle';
        state.cities = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllCities.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      .addCase(getShuttle.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getShuttle.fulfilled, (state, action) => {
        state.status = 'idle';
        state.shuttle = action.payload;
        state.isLoading = false;
      })
      .addCase(getShuttle.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      //GET ABOUT US IMAGES
      .addCase(getAboutUsImage.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getAboutUsImage.fulfilled, (state, action) => {
        state.status = 'idle';
        // console.log('about us iage = ', action.payload);
        state.aboutUsImages = action.payload;
        state.isLoading = false;
      })
      .addCase(getAboutUsImage.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      //GET USER
      .addCase(getUser.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.userProfile = action.payload;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      //GET GARAGES
      .addCase(getGarages.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getGarages.fulfilled, (state, action) => {
        state.status = 'idle';
        state.garages = action.payload;
        state.isLoading = false;
      })
      .addCase(getGarages.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      .addCase(getPayments.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.status = 'idle';
        state.payments = action.payload;
        state.isLoading = false;
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      .addCase(getBanks.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getBanks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.banks = action.payload?.data || [];
        state.isLoading = false;
      })
      .addCase(getBanks.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      //GET BANNERS
      .addCase(getBanners.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.status = 'idle';
        state.banners = action.payload;
        state.isLoading = false;
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      //GET REFFERAL POINT
      .addCase(getRefferalPoint.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getRefferalPoint.fulfilled, (state, action) => {
        state.status = 'idle';
        state.refferal_point = action.payload;
        state.isLoading = false;
      })
      .addCase(getRefferalPoint.rejected, state => {
        state.status = 'failed';
        state.isLoading = false;
      });
  },
});

const persistConfig = {
  key: 'appData',
  storage: AsyncStorage,
  whitelist: ['onboarding'],
};

export const {
  saveFormRegister,
  saveFormDaily,
  toggleLanguages,
  setSearchHistory,
  toggleOnboarding,
  resetFormDaily,
  setServiceType,
  setSubServiceType,
  setFacilityType,
  saveFormAirportTransfer,
  setSelectedVoucher,
  reseFormAirportTransfer,
} = appDataSlice.actions;

export const appDataState = (state: RootState) => state.appData;
export default persistReducer(persistConfig, appDataSlice.reducer);
