import { createContext, useReducer } from "react";

// store wadah untuk menyimpan value/state secara global
export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  cart: {
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    paymentMethod: localStorage.getItem("paymentMethod")
      ? localStorage.getItem("paymentMethod")
      : "",
    // cartItems: [],
    cartItems: localStorage.getItem("cartItems")
      ? //mengambil string JSON dan mengubahnya menjadi objek JavaScript
        JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
};
// fungsi dimana store value/state sehingga reducer sebagai update distore
function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      // add to chart without double countcd
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      // localstorage punya 2 parameter 1 cartItem untuk key 2 nilai string
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };

    // add to cart
    // return {
    //   ...state,
    //   cart: {
    //     ...state.cart,
    //     cartItems: [...state.cart.cartItems, action.payload],
    //   },
    // };
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_CLEAR":
      // change cartItem to empty array
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case "USER_SIGNIN":
      // return data sebelumnya dan perbaruan
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      return {
        // menyimpan sebelumnya dan set userInfo ke 0
        ...state,
        userInfo: null,
        cart: {
          // array kosong to reset
          cartItems: [],
          shippingAddress: {},
          paymentMethod: "",
        },
      };
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
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
