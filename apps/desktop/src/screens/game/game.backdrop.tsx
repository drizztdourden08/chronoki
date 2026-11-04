/* @layer renderer-app @kind component */
import { useProduct } from '@drizztdourden08/brock-react';
import './game.backdrop.css';

const GameBackdrop = () => {
  const product = useProduct();
  return (
    <div className="game-backdrop" aria-hidden="true">
      <img className="game-backdrop__mark" src={product.logos.mark} alt="" />
    </div>
  );
};

export default GameBackdrop;
