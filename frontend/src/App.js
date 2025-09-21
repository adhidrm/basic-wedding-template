import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import WeddingInvitation from "./pages/WeddingInvitation";
import { Toaster } from "./components/ui/toaster";
import { AnalyticsRouterListener, ConsentBanner } from "./analytics";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WeddingInvitation />} />
          </Routes>
          <AnalyticsRouterListener />
        </BrowserRouter>
        <Toaster />
        <ConsentBanner />
      </div>
    </ThemeProvider>
  );
}

export default App;