import React, { Ref, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { WIZARD_BASE } from "../constants/wizard.constants";
import { CursorProvider } from "../cursor.context";
import useCursorPosition from "../hooks/useCursorPosition";
import ConfirmModal from "../notifications/modal";
import { STARTING_STEP } from "../wizard/wizard.context";

const Layout: React.FC = ({ children }) => {
  const location = useLocation();
  const [cursorPosition, setCursorPosition] = useState<number[]>([]);
  const { getPosition } = useCursorPosition();
  const [activeLink, setActiveLink] = useState<string>();
  const usingMapBox: boolean = process.env.REACT_APP_USE_MAP_BOX === "true";
  const layoutContainer: Ref<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveLink(location.pathname.toString());
  }, [location, activeLink]);

  const handleMouseMove = (event: unknown) => {
    setCursorPosition(getPosition(event as MouseEvent));
  };

  const isActive = (activeLink: string | undefined) => {
    if (activeLink && WIZARD_BASE.route) {
      return activeLink?.indexOf(WIZARD_BASE.route) > -1 ? "uk-active" : "";
    }
    return "";
  };

  return (
    <CursorProvider value={{ x: cursorPosition[0], y: cursorPosition[1] }}>
      <div ref={layoutContainer} onMouseMove={handleMouseMove}>
        <div data-uk-section>
          <div className="uk-margin">
            <div className="uk-tab">
              <li className={activeLink === "/" ? "uk-active" : ""}>
                <NavLink
                  isActive={(match, location) => {
                    return match?.url === location.pathname;
                  }}
                  to={"/"}
                >
                  Getting Started
                </NavLink>
              </li>
              <li className={isActive(activeLink)}>
                <NavLink
                  isActive={(match, location) => {
                    return match?.url === location.pathname;
                  }}
                  to={WIZARD_BASE.route + STARTING_STEP.route}
                >
                  {usingMapBox ? "Identify" : "Drawing Canvas"}
                </NavLink>
              </li>
            </div>
          </div>
        </div>
        <div data-uk-section>
          <div data-uk-container>{children}</div>
        </div>
      </div>
      <ConfirmModal />
    </CursorProvider>
  );
};

export default Layout;
