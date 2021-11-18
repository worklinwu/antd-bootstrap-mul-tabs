import { createContext } from 'react';
import { initialState } from '@/components/pageTabs/reducer';

export default createContext({
  state: initialState,
  dispatch: () => null,
  action: {},
});
