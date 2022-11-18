import { createContext, useReducer } from "react";

// store wadah untuk menyimpan value/state secara global
export const Store = createContext();

const initialState = {
  cart: {
    cartItems: [],
  },
};
// fungsi dimana store value/state sehingga reducer sebagai update distore
function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      // add to chart without double count
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      return { ...state, cart: { ...state.cart, cartItems } };

      // add to cart
      // return {
      //   ...state,
      //   cart: {
      //     ...state.cart,
      //     cartItems: [...state.cart.cartItems, action.payload],
      //   },
      // };
    default:
      return state;
  }
}
export function StoreProvider(props) {
  // dispatch adalah proses pengambilan instruksi reducer
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
