import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../store';
import {
  IAirportLocationResult,
  IRentalLocationResult,
  IService,
} from 'types/rental-location.types';
import {
  getAirportLocation,
  getAirportLocationZone,
  getRentalLocation,
  getServices,
} from './rentalLocationAPI';

interface IInitState {
  status: string;
  isLoading: boolean;
  data: IRentalLocationResult[];
  airportData: IAirportLocationResult[];
  airportZoneData: IAirportLocationResult[];
  errors: any;
  services: IService[];
  rentalLocationParams: {
    service_id: number;
    sub_service_id: number;
    facility_id: number;
  };
}

const initialState: IInitState = {
  status: '',
  isLoading: false,
  data: [],
  errors: {},
  airportData: [],
  airportZoneData: [],
  services: [],
  rentalLocationParams: {
    service_id: 0,
    sub_service_id: 0,
    facility_id: 0,
  },
};

export const rentalLocationSlice = createSlice({
  name: 'rentalLocation',
  initialState,
  reducers: {
    setRentalLocationParams: (state, action) => {
      return {
        ...state,
        rentalLocationParams: {
          ...state.rentalLocationParams,
          ...action.payload,
        },
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getServices.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.status = 'idle';
        state.services = action.payload;
        state.isLoading = false;
      })
      .addCase(getServices.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      .addCase(getRentalLocation.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getRentalLocation.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(getRentalLocation.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      .addCase(getAirportLocation.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getAirportLocation.fulfilled, (state, action) => {
        state.status = 'idle';
        state.airportData = action.payload;
        state.isLoading = false;
      })
      .addCase(getAirportLocation.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      .addCase(getAirportLocationZone.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getAirportLocationZone.fulfilled, (state, action) => {
        state.status = 'idle';
        state.airportZoneData = action.payload;
        state.isLoading = false;
      })
      .addCase(getAirportLocationZone.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      });
  },
});

export const {setRentalLocationParams} = rentalLocationSlice.actions;

export const rentalLocationState = (state: RootState) => state.rentalLocation;
export default rentalLocationSlice.reducer;
