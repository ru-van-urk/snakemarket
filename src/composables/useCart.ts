import { useState } from "nuxt/app";

type CartItem = {
  ProductID: number;
  quantity: number;
};

const useCart = () => {
  const cart = useState<CartItem[]>("cart", () => []);

  function addToCart(ProductID: number) {
    const isInCart = cart.value.find((item) => item.ProductID === ProductID);

    let newCart = [...cart.value, { ProductID, quantity: 1 }];

    if (isInCart) {
      newCart = [
        ...cart.value.filter((item) => item.ProductID !== ProductID),
        { ...isInCart, quantity: isInCart.quantity + 1 },
      ];
    }

    cart.value = newCart;
  }

  function removeFromCart(ProductID: number) {
    const isInCart = cart.value.find((item) => item.ProductID === ProductID);

    if (!isInCart) return;

    let newCart = [
      ...cart.value.filter((item) => item.ProductID !== ProductID),
      { ProductID, quantity: isInCart.quantity - 1 },
    ];

    if (isInCart.quantity === 1) {
      newCart = cart.value.filter((item) => item.ProductID !== ProductID);
    }

    cart.value = newCart;
  }

  function getQuantity(ProductID: number) {
    const cartItem = cart.value.find((item) => item.ProductID === ProductID);
    return cartItem ? cartItem.quantity : 0;
  }

  return { cart, addToCart, removeFromCart, getQuantity };
};

export default useCart;
