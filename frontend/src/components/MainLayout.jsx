import { Outlet } from "react-router-dom";
import HeroNavbar from "./HeroNavbar";

function MainLayout() {
  return (
    <>
      <HeroNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;