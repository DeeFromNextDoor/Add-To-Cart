import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const stripePublicKey = import.meta.env.VITE_SECRET_KEY;

const ShoppingCart = ({ cartState, cartDispatch }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  const increaseQuantity = (productId) => {
    const updatedCart = cartState.map((item) => {
      if (item.id === productId && item.quantity) {
        const newQuantity = item.quantity + 1;
        return {
          ...item,
          quantity: newQuantity,
        };
      }
      return item;
    });

    cartDispatch({ type: "UPDATE_CART", payload: updatedCart });
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cartState.map((item) => {
      if (item.id === productId && item.quantity) {
        const newQuantity = item.quantity - 1;
        return {
          ...item,
          quantity: newQuantity,
        };
      }
      return item;
    });

    cartDispatch({ type: "UPDATE_CART", payload: updatedCart });
  };

  const removeItem = (productId) => {
    const updatedCart = cartState.filter((item) => item.id !== productId);
    cartDispatch({ type: "UPDATE_CART", payload: updatedCart });
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cartState.reduce(
        (accumulator, item) => accumulator + item.price * (item.quantity || 1),
        0
      );
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [cartState]);

  const checkoutOptions = {
    lineItems: cartState.map((item) => ({
      price: item.price_id,
      quantity: item.quantity,
    })),
    mode: "payment",
    successUrl: import.meta.env.VITE_SUCCESS_URL,
    cancelUrl: import.meta.env.VITE_CANCEL_URL,
  };

  const handleCheckout = async () => {
    const stripe = await loadStripe(stripePublicKey);

    const { error } = await stripe.redirectToCheckout(checkoutOptions);

    if (error) {
      console.error("Stripe checkout error:", error);
    }
  };

  return (
    <div className="cart_page">
      <div className="cart_content">
        <div className="cart_header">
          <h1>My Shopping Cart</h1>
          <div className="product_props">
            <div className="prop_names">
              <p>Item</p>
              <p>Name</p>
              <p>Quantity</p>
              <p>Remove</p>
              <p>Price</p>
            </div>
          </div>
        </div>
        <div className="products_list">
          {cartState.length > 0 ? (
            <div className="product_cont">
              {cartState.map((item) => (
                <ul key={item.id}>
                  <li>
                    <img src={item.image} alt={item.name} />
                  </li>
                  <li>
                    <p>{item.title.slice(0, 10)}</p>
                  </li>
                  <li>
                    <div className="amount">
                      <button onClick={() => decreaseQuantity(item.id)}>
                        <i className="bi bi-dash-lg"></i>
                      </button>
                      <p>{item.quantity || 1}</p>
                      <button onClick={() => increaseQuantity(item.id)}>
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </li>
                  <li>
                    <button onClick={() => removeItem(item.id)}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </li>
                  <li>
                    <p>${item.price}</p>
                  </li>
                </ul>
              ))}
              <h3 className="product_total">Total ${totalPrice.toFixed(2)}</h3>
              <Link className="pay-now" onClick={handleCheckout}>
                Pay now
              </Link>
            </div>
          ) : (
            <h1 className="cart_empty">Your cart is empty</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
