import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import WorkoutPicker from "./WorkoutPicker";
import App from "./App";
import NotFound from "./NotFound";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={WorkoutPicker} />
      <Route exact path="/workout/:workoutType" component={App} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
