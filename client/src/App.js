import { Fragment } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

const App = () => {
  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </Fragment>
  );
};

export default App;
