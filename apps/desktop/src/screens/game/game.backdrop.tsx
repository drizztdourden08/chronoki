/* @layer renderer-app @kind component */
import { useProduct } from '@drizztdourden08/brock-react';
import { Box, Image } from '@drizztdourden08/tessera/primitives';
import './game.backdrop.css';

const GameBackdrop = () => {
  const product = useProduct();
  return (
    <Box className="game-backdrop" aria-hidden="true">
      <Image className="game-backdrop__mark" src={product.logos.mark} alt="" />
    </Box>
  );
};

export default GameBackdrop;
