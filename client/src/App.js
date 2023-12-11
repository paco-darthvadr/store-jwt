import { useState, useEffect } from "react";
import {  Routes, Route, Link } from "react-router-dom";
import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Signup from "./components/Signup";
import About from "./components/About";
import Cancel from "./components/Cancel";
import Store from "./components/Store";
import Success from "./components/Success";
import Wallets from "./components/Wallets";
import Support from "./components/Support";
import Products from "./components/Products";
import Home from "./components/Home";
import Private from "./components/Private";
import Footer from "./component/Footer";
//import NavbarComponent from './component/Navbar';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from 'react-bootstrap';
import CartProvider from './CartContext';

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li>

        {currentUser && (
            <li className="nav-item">
              <Link to={"/private"} className="nav-link">
                Private
              </Link>
            </li>
          )}
          <div/>

          {currentUser && (
            <li className="nav-item">
              <Link to={"/products"} className="nav-link">
               Products
              </Link>
            </li>
          )}
          <div/>

          {currentUser && (
            <li className="nav-item">
              <Link to={"/wallets"} className="nav-link">
               Wallets
              </Link>
            </li>
          )}
          <div/>

          {currentUser && (
            <li className="nav-item">
              <Link to={"/support"} className="nav-link">
               Support
              </Link>
            </li>
          )}
          <div/>

          {currentUser && (
            <li className="nav-item">
              <Link to={"/about"} className="nav-link">
                About
              </Link>
            </li>
          )}
          <div/>

        {currentUser ? (
          <div className="navbar-nav ms-auto">
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                Logout
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/signup"} className="nav-link">
                Sign up
              </Link>
            </li>
          </div>
        )}
        </div>
      </nav>
      <CartProvider>
      <Container>
      <div className="container mt-3">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/private" element={<Private />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/About" element={<About />} />
              <Route path="/Cancel" element={<Cancel />} />
              <Route path="/Store" element={<Store />} />
              <Route path="/Success" element={<Success />} />
              <Route path="/Wallets" element={<Wallets />} />
              <Route path="/Support" element={<Support />} />
              <Route path="/Products" element={<Products />} />
            </Routes>
          </div>
        </div>
      </div>
    </Container>
    </CartProvider>
      <Footer />
    </div>
  );
}

export default App;
