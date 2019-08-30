export const addToCounter = (store, amount) => {
  const counter = store.state.counter + amount;
  store.setState({ counter });
};

export const LogInOut = (store, isLoggedIn) => {
  const isAuth = isLoggedIn;
  store.setState({ isAuth });
};

export const setUser = (store, userObj) => {
  const user = userObj;
  store.setState({ user });
};
