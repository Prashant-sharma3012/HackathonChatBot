import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "../components/layout/Landing";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import PrivateRoute from "../components/private-route";
import Dashboard from "../components/dashboard/Dashboard";
import PublicRoute from "../components/public-route";
import PageNotFound from "./pageNotFound";

const Routes = () => {
    return (
        <Switch>
            <PublicRoute path="/login" component={Login} />
            <PublicRoute path="/login?token=id" component={Login} />
            <PrivateRoute exact path="/overview" component={Dashboard} />
            <PublicRoute component={PageNotFound}/>
        </Switch>
    )
}


export default Routes;