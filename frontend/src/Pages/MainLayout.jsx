import { Outlet } from "react-router-dom";
import NavbarComponents from "../Components/NavbarComponents.jsx";
import FooterComponents from "../Components/FooterComponents.jsx";      

const MainLayout = () => {
  return (
    <>      
        <NavbarComponents />
        <Outlet />
        <FooterComponents />
    </>
  );
}

export default MainLayout;