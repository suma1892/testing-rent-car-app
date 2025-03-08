import {createSlice} from '@reduxjs/toolkit';
import {IBrands, IPaginationVehicle, IVehicles} from 'types/vehicles';
import {RootState} from '../../store';
import {
  getBrands,
  getTypeOfVehicles,
  getVehicles,
  getVehiclesById,
} from './vehiclesAPI';

interface IInitState {
  data: {
    vehicles: IVehicles[];
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
  vehicles: IVehicles[];
  paginationVehicles: IPaginationVehicle | any;
  brands: IBrands[];
  vehicleById: IVehicles;
  type_vehicles: IVehicles[];
  page: number;
  isError: boolean;
  errorMessage: any;
  isLoading: boolean;
  isLoadingNextPage: boolean;
}

const initialState: IInitState = {
  status: '',
  isLoadingVehicle: false,
  isLoadingNextPageVehicle: false,
  isLoadingBrands: false,
  vehicles: [],

  data: {
    vehicles: [],
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

  type_vehicles: [],
  isLoading: false,
  page: 1,
  isLoadingNextPage: false,
  isError: false,
  errorMessage: '',
  paginationVehicles: {},
  brands: [],
  vehicleById: {
    brand_name: '',
    disablility_allowed: false,
    id: 0,
    license_number: '',
    max_passanger: 0,
    min_suitcase: 0,
    max_suitcase: 0,
    name: '',
    pet_allowed: false,
    photo: [],
    price: 0,
    smoke_allowed: false,
    status: '',
    year: 1999,
    discount_price: 0,
    old_price: 0,
    is_valid_for_order: false,
    minimal_rental_day: 0,
    price_with_driver: 0,
    slash_price: 0,
    status_order: 'available',
    transmission: 'manual',
    category: {
      id: 0,
      name: '',
    },
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
};

export const vehiclesSlice = createSlice({
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
      .addCase(getVehicles.pending, state => {
        if (state.page === 1) {
          state.isLoading = true;
          state.data = {
            vehicles: [],
            pagination: {
              limit: 0,
              last_page: 0,
              next_page: 0,
              page: 0,
              prev_page: 0,
              total: 0,
              total_data: 0,
            },
          };
        }
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(getVehicles.fulfilled, (state, action) => {
        if (state.page === 1) {
          state.isLoading = false;
        } else {
          state.isLoadingNextPage = false;
        }
        state.data = action.payload as any;
      })
      .addCase(getVehicles.rejected, (state, action) => {
        if (state.page === 1) {
          state.isLoading = false;
        } else {
          state.isLoadingNextPage = false;
        }
        state.isError = true;
        state.errorMessage = action.payload;
      })

      //type of vehicles
      .addCase(getTypeOfVehicles.pending, state => {
        state.status = 'loading';
        state.isLoadingVehicle = true;
        state.type_vehicles = [];
      })
      .addCase(getTypeOfVehicles.fulfilled, (state, action) => {
        state.status = 'idle';
        state.type_vehicles = action.payload || [];
        state.isLoadingVehicle = false;
      })
      .addCase(getTypeOfVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoadingVehicle = false;
      })

      // vehicle Detail
      .addCase(getVehiclesById.pending, state => {
        state.status = 'loading';
        state.isLoadingVehicle = true;
        // state.vehicleById = {};
      })
      .addCase(getVehiclesById.fulfilled, (state, action) => {
        state.status = 'idle';
        state.vehicleById = action.payload || [];
        state.isLoadingVehicle = false;
      })
      .addCase(getVehiclesById.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoadingVehicle = false;
      })

      // brands
      .addCase(getBrands.pending, state => {
        state.status = 'loading';
        state.isLoadingBrands = true;
        state.brands = [];
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.status = 'idle';
        state.brands = action.payload || [];
        state.isLoadingBrands = false;
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoadingBrands = false;
      });
  },
});

export const {setPage} = vehiclesSlice.actions;

export const vehiclesState = (state: RootState) => state.vehicles;
export default vehiclesSlice.reducer;
