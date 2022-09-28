import React, { useContext } from "react";
import HeroCard from "./heroes/HeroCard";

export const ItemCart = ({ item }) => {

  const { editItemToCart } = useContext(HeroCard);


  const { id } = item;

  return (
    <div>
      <img src={item.img} alt={item.name} />
      <div>
        <div >
          <p>{item.name}</p>
          <div >
            <button onClick={() => editItemToCart(item._id, "add", id)}>
              AGREGAR
            </button>
            <button onClick={() => editItemToCart(item._id, "del", id)}>
              SACAR
            </button>
          </div>
        </div>
        <div >
          <div>{item.id}</div>
          <p>Total: ${item.id * item.superhero}</p>
        </div>
      </div>
    </div>
  );
};