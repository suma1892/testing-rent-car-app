import {createSlice} from '@reduxjs/toolkit';
import {getAirportVehicles, getAirportVehiclesById} from './airportVehiclesAPI';
import {
  IAirportVehicles,
  IPaginationAirportVehicle,
} from 'types/airport-vehicles';
import {RootState} from '../../store';
import {IOperational} from 'types/vehicles';

interface IInitState {
  data: {
    packages: IAirportVehicles[];
    pagination: {
      limit: number;
      next_page: number;
      page: number;
      prev_page: number;
      total: number;
      total_data: number;
      last_page: number;
    };
  };
  status: string;
  isLoadingVehicle: boolean;
  isLoadingNextPageVehicle: boolean;
  isLoadingBrands: boolean;
  packages: IAirportVehicles[];
  paginationAirportVehicles: IPaginationAirportVehicle | any;
  page: number;
  isError: boolean;
  errorMessage: any;
  isLoading: boolean;
  isLoadingNextPage: boolean;
  airportVehicleById: {
    vehicle_name: string;
    category: string;
    description: string;
    disability_allowed: boolean;
    id: number;
    images: string[];
    max_passenger: number;
    max_suitecase: number;
    pet_allowed: boolean;
    price: number;
    price_with_driver: number;
    required_driver: boolean;
    slash_price: number;
    smoke_allowed: boolean;
    disablility_allowed: boolean;
    support_driver: boolean;
    title: string;
    transmission: 'manual' | 'matic';
    vehicle_id: number;
    garage_data: {
      address_details: string;
      end_time: string;
      id: number;
      location_id: number;
      location_name: string;
      map_link: string;
      name: string;
      outside_operational_fee: number;
      outside_operational_service: string[];
      outside_operational_status: boolean;
      start_time: string;
      location_time_zone: string;
      operational: IOperational[];
    };
  };
}

const initialState: IInitState = {
  status: '',
  isLoadingVehicle: false,
  isLoadingNextPageVehicle: false,
  isLoadingBrands: false,
  packages: [],

  data: {
    packages: [],
    pagination: {
      limit: 0,
      last_page: 0,
      next_page: 0,
      page: 0,
      prev_page: 0,
      total: 0,
      total_data: 0,
    },
  },
  airportVehicleById: {
    category: '',
    description: '',
    disability_allowed: false,
    id: 0,
    images: [],
    vehicle_name: '',
    max_passenger: 0,
    max_suitecase: 0,
    pet_allowed: false,
    price: 0,
    price_with_driver: 0,
    required_driver: false,
    slash_price: 0,
    smoke_allowed: false,
    disablility_allowed: false,
    support_driver: false,
    title: '',
    transmission: 'manual',
    vehicle_id: 0,
    garage_data: {
      address_details: '',
      end_time: '',
      id: 0,
      location_id: 0,
      location_name: '',
      map_link: '',
      name: '',
      outside_operational_fee: 0,
      outside_operational_service: [],
      outside_operational_status: false,
      start_time: '',
      location_time_zone: '',
    },
  },
  isLoading: false,
  page: 1,
  isLoadingNextPage: false,
  isError: false,
  errorMessage: '',
  paginationAirportVehicles: {},
};

export const airportVehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setPage: (state, action) => {
      return {...state, isLoadingNextPage: true, page: action.payload};
    },
  },
  extraReducers: builder => {
    builder

      // vehicles
      .addCase(getAirportVehicles.pending, state => {
        if (state.page === 1) {
          state.isLoading = true;
        }
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(getAirportVehicles.fulfilled, (state, action) => {
        if (state.page === 1) {
          state.isLoading = false;
        } else {
          state.isLoadingNextPage = false;
        }
        state.data = action.payload as any;
      })
      .addCase(getAirportVehicles.rejected, (state, action) => {
        if (state.page === 1) {
          state.isLoading = false;
        } else {
          state.isLoadingNextPage = false;
        }
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // vehicle Detail
      .addCase(getAirportVehiclesById.pending, state => {
        state.status = 'loading';
        state.isLoadingVehicle = true;
        // state.vehicleById = {};
      })
      .addCase(getAirportVehiclesById.fulfilled, (state, action) => {
        state.status = 'idle';
        state.airportVehicleById = action.payload || [];
        state.isLoadingVehicle = false;
      })
      .addCase(getAirportVehiclesById.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoadingVehicle = false;
      });
  },
});

export const {setPage} = airportVehiclesSlice.actions;

export const airportVehiclesState = (state: RootState) => state.airportVehicles;
export default airportVehiclesSlice.reducer;
