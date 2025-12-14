import "./Shoes.scss";
import { nanoid } from "nanoid";

import Input from "../Input/Input";

function Shoes({ updateSize, addShoe, removeShoe, shoes }) {
  const shoeComps = shoes.map((input, index) => {
    const label = `Shoe size / person ${index + 1}`;
    const shoeInput = (
      <article className="shoes__form" key={input.id}>
        <Input
          label={label}
          type="text"
          customClass="shoes__input"
          name={input.id}
          handleChange={updateSize}
          maxLength={2}
        />
        {/* data-testid added for testing: needed to find and click remove shoe buttons for each player */}
        <button
          className="shoes__button shoes__button--small"
          onClick={() => {
            removeShoe(input.id);
          }}
          data-testid={`remove-shoe-${index}`}
        >
          -
        </button>
      </article>
    );

    return shoeInput;
  });

  return (
    <section className="shoes">
      <header>
        <h2 className="shoes__heading">Shoes</h2>
      </header>
      {shoeComps}
      {/* data-testid added for testing: needed to find and click the add shoe button */}
      <button
        className="shoes__button"
        onClick={() => {
          addShoe(nanoid());
        }}
        data-testid="add-shoe-button"
      >
        +
      </button>
    </section>
  );
}

export default Shoes;
