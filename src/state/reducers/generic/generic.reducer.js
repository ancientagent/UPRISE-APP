export const getInitialState = () => ({
  isWaiting: false,
  value: null,
  error: null,
  result: null,
});

export default actionTypeSet => (state = getInitialState(), action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypeSet.Start: return {
      isWaiting: true,
      value: payload,
      error: null,
      result: null,
    };
    case actionTypeSet.Fail: return {
      ...state,
      isWaiting: false,
      error: payload,
    };
    case actionTypeSet.Succeed: return {
      ...state,
      isWaiting: false,
      error: null,
      result: payload,
    };
    case actionTypeSet.Update: {
      return {
        ...state,
        isWaiting: false,
        error: null,
        result: payload,
      };
    }
    case actionTypeSet.Reset:
      return getInitialState();
    default: return state;
  }
};
