import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        <AppRoutes />
      </div>

      <Footer />
    </>
  );
}