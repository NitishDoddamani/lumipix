import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <div className="min-h-screen">
        <AppRoutes />
      </div>

      <Footer />
    </>
  );
}