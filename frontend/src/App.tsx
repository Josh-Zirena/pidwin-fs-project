import React from "react";
import { Container } from "@mui/material";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import TopStreaks from "./components/TopStreaks/TopStreaks";
import PasswordSetting from "./components/PasswordSettings/PasswordSettings";
import { UserProvider } from "./contexts/UserContext";

const App: React.FC = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Container maxWidth="lg">
          <Navbar />
          <ToastContainer
            position="bottom-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/password" element={<PasswordSetting />} />
            <Route path="/leaders" element={<TopStreaks />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
