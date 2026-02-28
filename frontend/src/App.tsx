import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MenuProvider } from "./context/MenuContext";
import { Header } from "./components/Header";
import { IntroOverlay } from "./components/IntroOverlay";
import { MenuPage } from "./pages/MenuPage";
import { AdminPage } from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <MenuProvider>
        <IntroOverlay />
        <div className="min-h-screen flex flex-col">
          <Header />
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/edit" element={<AdminPage />} />
          </Routes>
        </div>
      </MenuProvider>
    </BrowserRouter>
  );
}

export default App;
