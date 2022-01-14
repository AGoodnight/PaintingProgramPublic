import { Route } from "react-router";
import { WIZARD_BASE } from "./constants/wizard.constants";
import LandingPage from "./pages/landing";
import Wizard from "./wizard/wizard";

export const AppRoutes = [
  <Route
    path={"/"}
    exact={true}
    component={LandingPage}
    key={"landing"}
  ></Route>,
  <Route path={WIZARD_BASE.route} component={Wizard} key={"wizard"}></Route>,
];
