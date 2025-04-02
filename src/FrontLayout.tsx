import { Outlet } from 'react-router-dom';
import Navigation from "./Navigation";
import Footer from "./Footer";

function FrontLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow pt-32">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default FrontLayout;