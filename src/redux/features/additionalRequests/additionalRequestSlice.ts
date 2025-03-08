import {createSlice} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';
import {getAdditionalRequests} from './additionalRequestAPI';
import {AdditonalProduct} from 'types/additional-items.types';

interface IInitState {
  data: AdditonalProduct[];
  isLoading: boolean;
  isLoadingNextPage: boolean;
  isError: boolean;
  errorMessage: any;
  pagination: {
    limit: number;
    next_page: number;
    page: number;
    prev_page: number;
    total: number;
    total_page: number;
  };
  page: number;
}

const initialState: IInitState = {
  data: [],
  isLoading: false,
  isLoadingNextPage: false,
  isError: false,
  errorMessage: {}, // kalo retry setelah error, harus hapus errorMessage dan isError!
  pagination: {
    limit: 0,
    next_page: 0,
    page: 0,
    prev_page: 0,
    total: 0,
    total_page: 0,
  },
  page: 1,
};

export const additionalRequest = createSlice({
  name: 'additionalRequest',
  initialState,
  reducers: {
    // reducers goes here
    setPage: (state, action) => {
      return {...state, isLoadingNextPage: true, page: action.payload};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAdditionalRequests.pending, state => {
        if (state.page === 1) {
          state.isLoading = true;
        }
        state.isError = false;
        state.errorMessage = {};
        state.data = [];
      })
      .addCase(getAdditionalRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as any;
      })
      .addCase(getAdditionalRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data as any;
        state.pagination = action.payload.pagination as any;
      });
  },
});

export const {setPage} = additionalRequest.actions;
export const additionalRequestState = (state: RootState) =>
  state.additionalRequest;
export default additionalRequest.reducer;
