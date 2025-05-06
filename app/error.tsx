'use client';

import React, { useEffect } from 'react';

function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>¡Algo salió mal!</h2>
      <button onClick={() => reset()}>Inténtalo de nuevo</button>
    </div>
  );
}

export default React.memo(Error);
