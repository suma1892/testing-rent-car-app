import {createSlice} from '@reduxjs/toolkit';
import {getAllGarages} from './garagesAPI';

type DataResult = {
  address_details: string;
  end_time: string;
  id: number;
  map_link: string;
  name: string;
  start_time: string;
}

interface IInitState {
  data: DataResult[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: any;
}

const initialState: IInitState = {
  data: [],
  isLoading: false,
  isError: false,
  errorMessage: {}, // kalo retry setelah error, harus hapus errorMessage dan isError!
};

export const garages = createSlice({
  name: 'garages',
  initialState,
  reducers: {
    // reducers goes here
  },
  extraReducers: builder => {
    builder
      .addCase(getAllGarages.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = {};
        state.data = [];
      })
      .addCase(getAllGarages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as any;
      })
      .addCase(getAllGarages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload as any;
      });
  },
});

// export const {  } = Garages.actions;

export default garages.reducer;
