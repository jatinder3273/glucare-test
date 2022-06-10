import { createStore, applyMiddleware, Dispatch } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";

// initial states here
const initalState: any = {};

// middleware
const middleware = [thunk];

// creating store
const store = createStore(rootReducer, applyMiddleware(thunk));
export type AppDispatch = typeof store.dispatch | Dispatch<any>;
export default store;
