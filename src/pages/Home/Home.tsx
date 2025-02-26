import { Outlet } from "react-router-dom";
import Navbar from "../Shared/Navbar";
import Footer from "../Shared/Footer";

const Home = () => {
  return (
    <div className="">
      <Navbar />
      <div className="my-20">
        <Outlet></Outlet>
      </div>
      <div className="my-20">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Home;
