import { INCREMENT_COUNTER, DECREMENT_COUNTER } from "./testConstants";

const initialState = {
  data: 42
};

const testreducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return { ...state, data: state.data + action.payloads + action.payload };
    case DECREMENT_COUNTER:
      return { ...state, data: state.data - action.payloads - action.payload };
    default:
      return state;
  }
};

export default testreducer;
