import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import bottleneckReducer from './features/bottleneckSlice';

export const store = configureStore({
  reducer: {
    bottleneck: bottleneckReducer,
  },
});

// Types for Redux hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed versions of useDispatch and useSelector hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;