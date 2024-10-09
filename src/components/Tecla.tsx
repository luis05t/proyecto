import React from 'react';

interface TeclaProps {
  nota: string;
  presionarTecla: (nota: string) => void;
  estaActiva: boolean;
}

const Tecla: React.FC<TeclaProps> = ({ nota, presionarTecla, estaActiva }) => {
  const reproducirSonido = (nota: string) => {
    const audio = new Audio(`/sounds/${nota} src/sounds/do.mp3 `); // Ruta de los archivos de sonido
    audio.play();
  };

  const manejarClick = () => {
    presionarTecla(nota);
    reproducirSonido(nota);
  };

  return (
    <div
      className={`tecla blanca ${estaActiva ? 'activa' : ''}`}
      onClick={manejarClick}
    >
      {nota}
    </div>
  );
};

export default Tecla;
