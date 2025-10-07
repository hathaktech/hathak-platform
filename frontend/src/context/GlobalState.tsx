"use client";

import { createContext, useReducer, ReactNode } from 'react';

interface State {
  cart: any[];
  user: any | null;
}

const initialState: State = { cart: [], user: null };

export const GlobalContext = createContext<any>(initialState);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const reducer = (state: State, action: any) => {
    switch (action.type) {
      case 'SET_USER': return { ...state, user: action.payload };
      case 'ADD_TO_CART': return { ...state, cart: [...state.cart, action.payload] };
      case 'REMOVE_FROM_CART': return { ...state, cart: state.cart.filter(i => i.id !== action.payload) };
      default: return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return <GlobalContext.Provider value={{ state, dispatch }}>{children}</GlobalContext.Provider>;
};
