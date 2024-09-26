import React, { useEffect, useState } from "react";
import "@stripe/stripe-js";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Navmenu from "./components/Navmenu";
import ShoppingCart from "./components/ShoppingCart";
import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import { useAppContext } from "./context/Context";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./components/auth/AuthPage";
import { useSharedContext } from "./context/SharedAppContex";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home";
import Contact from "./components/Contact";
import Success from "./components/Success";
import Cancel from "./components/Cancel";

const App = () => {
  const { state, dispatch } = useAppContext();
  const { cartState, isLoading, error } = state;
  const { isNavmenuVisible, closeNavmenu, isUserMenuVisible, closeUserMenu } =
    useSharedContext();
  const [productsWithPriceIds, setProductsWithPriceIds] = useState([]);

  const location = useLocation();

  const priceIds = [
    "price_1Nm6QYK2U361dMY0nitxx8Ub",

    "price_1Nm6SBK2U361dMY00iEirgog",

    "price_1Nm6UqK2U361dMY0X57jZR13",

    "price_1Nm6WHK2U361dMY0aVf0ZjPs",

    "price_1Nm6XqK2U361dMY0YJI6x8WN",

    "price_1Nm6YkK2U361dMY0QE46uIwj",

    "price_1Nm6ZZK2U361dMY0ZbIXnfVZ",

    "price_1Nm6aRK2U361dMY0RKlSCOUD",

    "price_1Nm6bTK2U361dMY0oayevtLH",

    "price_1Nm6c8K2U361dMY0ekRQvc1w",

    "price_1Nm6d2K2U361dMY03Do1ef9V",

    "price_1Nm6d2K2U361dMY03Do1ef9V",

    "price_1Nm6fZK2U361dMY01f0J2h2d",

    "price_1NmY4RK2U361dMY0uWa9LSnw",

    "price_1NmY5LK2U361dMY0ALCdxYKD",

    "price_1NmY6MK2U361dMY03geJgT2I",

    "price_1NmY78K2U361dMY0t8l3bdBs",

    "price_1NmY7qK2U361dMY08D4wmH0J",

    "price_1NmY8uK2U361dMY0ut4yjU38",

    "price_1NmY9kK2U361dMY00bxt5rc7",
  ];

  const fetchData = async () => {
    dispatch({ type: "START_FETCH" });
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      const modifiedData = data.map((product, index) => ({
        ...product,
        price_id: priceIds[index],
      }));
      setProductsWithPriceIds(modifiedData);
      dispatch({ type: "FETCH_SUCCESSFUL", payload: modifiedData });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  location.pathname == "/" && closeNavmenu;

  return (
    <div className="container">
      {isNavmenuVisible && <div className="overlay" onClick={closeNavmenu} />}
      {isUserMenuVisible && (
        <div className="user_overlay" onClick={closeUserMenu} />
      )}
      <ToastContainer position="top-right" autoClose={2000} />
      {location.pathname !== "/" && location.pathname !== "/PaymentPage" && (
        <Navbar cartSize={cartState.length} />
      )}
      <Navmenu isVisible={isNavmenuVisible} />
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error fetching products.</div>
      ) : (
        <>
          <Routes>
            <Route
              path="/"
              element={<Home products={productsWithPriceIds} />}
            />
            <Route
              path="/Products"
              element={
                <ProtectedRoute>
                  <Products
                    cartState={cartState}
                    products={productsWithPriceIds}
                    cartDispatch={dispatch}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="Contact" element={<Contact />} />
            <Route path="/auth/AuthPage" element={<AuthPage />} />
            <Route
              path="/ShoppingCart"
              element={
                <ProtectedRoute>
                  <ShoppingCart cartState={cartState} cartDispatch={dispatch} />
                </ProtectedRoute>
              }
            />
            <Route path="/Success" element={<Success />} />
            <Route path="/Cancel" element={<Cancel />} />
            <Route path="/ProductDetails/:id" element={<ProductDetails />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
