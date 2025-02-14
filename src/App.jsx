import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import Links from "./components/Links";
import Header from "./components/Header";
import Room from "./pages/Room";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen font-sans transition-colors duration-300">
        <Header />
        <Routes>
          <Route path="/" element={
            <main>
              <div className="flex flex-col items-center justify-center px-4 py-20">
                <Profile />
                <Links />
              </div>
            </main>
          } />
          <Route path="/public" element={<Room />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;