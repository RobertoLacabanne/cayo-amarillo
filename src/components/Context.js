import React, { useContext } from "react";
import HeroCard from "./heroes/HeroCard";

export const ItemCart = ({ item }) => {

  const { editItemToCart } = useContext(HeroCard);


  const { amount } = item;

  return (
    <div>
      <img src={item.img} alt={item.name} />
      <div>
        <div >
          <p>{item.name}</p>
          <div >
            <button onClick={() => editItemToCart(item._id, "add", amount)}>
              AGREGAR
            </button>
            <button onClick={() => editItemToCart(item._id, "del", amount)}>
              SACAR
            </button>
          </div>
        </div>
        <div >
          <div>{item.amount}</div>
          <p>Total: ${item.amount * item.price}</p>
        </div>
      </div>
    </div>
  );
};