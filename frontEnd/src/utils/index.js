import axios from "axios";
import { setCurrentUser, logoutUser } from "../actions/authActions";
import jwt_decode from "jwt-decode";


export const setAuthToken = token => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};


export const checkAuthToken = (store) => {
  // Check for token to keep user logged in
  if (localStorage.jwtToken) {
    // Set auth token header auth
    const token = localStorage.jwtToken;
    console.log("-------token-------", token)
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
      // Logout user
      store.dispatch(logoutUser());
      // Redirect to login
      window.location.href = "./login";
    }
  }
}