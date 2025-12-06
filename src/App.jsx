import { Component } from "react";
import { Route, Switch } from "wouter";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container mt-4">
        <Switch>
          {/* Ruta de login */}
          <Route path="/" component={Login} />

          {/* Panel Admin (a futuro tendrá subrutas) */}
          <Route path="/admin" component={Dashboard} />
        </Switch>
      </div>
    );
  }
}
