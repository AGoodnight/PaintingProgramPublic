import React from "react";
import { Route } from "react-router-dom";
import { WIZARD_BASE } from "../constants/wizard.constants";
// import { STEPS_TO_USE } from "./wizard.context";
// import { WizardStep, WizardStepDefinition } from "../models/wizard.models";
import ArtBoardResolver from "../resolvers/artBoardResolver";
import ArtBoardStep from "./artboard_step";

// export const WizardRoutes = Object.keys(STEPS_TO_USE).map((stepKey: string) => {
//   const stepDef: WizardStepDefinition | undefined =
//     STEPS_TO_USE[stepKey as WizardStep];
//   if (stepDef) {
//     return (
//       <ArtBoardResolver>
//         <Route
//           path={WIZARD_BASE.route + stepDef.route}
//           key={stepKey}
//           render={() => {
//             return <div>{React.createElement(stepDef.component, {})}</div>;
//           }}
//         />
//       </ArtBoardResolver>
//     );
//   } else {
//     return null;
//   }
// });

export const WizardRoutes = [
  <ArtBoardResolver>
    <Route
      path={WIZARD_BASE.route + "/:title"}
      component={ArtBoardStep}
    ></Route>
  </ArtBoardResolver>,
];
