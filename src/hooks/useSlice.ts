import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, sliceActionsCombined, ActionTypes, ActionState } from '../state/store';
import { Draft } from '@reduxjs/toolkit';

// Define a type for the actions of each slice
type SliceActions<T> = {
  [K in keyof T]: (...args: any[]) => any;
};

const useSlice = <T extends keyof RootState>(sliceName: T) => {
  const dispatch = useDispatch<AppDispatch>();

  // Type the sliceState based on the provided sliceName
  const sliceState = useSelector((state: RootState) => state[sliceName]);
  

  // Access the actions of the selected slice and type them correctly
  const actions = sliceActionsCombined[sliceName] as SliceActions<typeof sliceActionsCombined[T]>;

  // Create bound actions that dispatch each action
  const boundActions = Object.keys(actions).reduce((acc, key) => {
    acc[key as keyof typeof actions] = (...args: any[]) =>
      dispatch(actions[key as keyof typeof actions](...args));
    return acc;
  }, {} as { [K in keyof typeof actions]: (...args: Parameters<typeof actions[K]>) => ReturnType<typeof actions[K]> });

  
  
  return { ...sliceState as ActionState[typeof sliceName], ...boundActions as ActionTypes[typeof sliceName] };
};

export default useSlice;
