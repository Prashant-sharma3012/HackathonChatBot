import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { checkAuthToken } from "./utils";

import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./components/layout/Navbar";
import Routes from "./components/router";
import { StylesProvider } from "@material-ui/core";


checkAuthToken(store);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <StylesProvider injectFirst>
        <Router>
          <div className="App">
            {/* <Navbar /> */}
            <Routes />
          </div>
        </Router>
        </StylesProvider>
      </Provider>
    );
  }
}
export default App;
