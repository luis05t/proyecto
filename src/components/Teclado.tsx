import React from 'react';
import Tecla from './Tecla';

interface TecladoProps {
  notas: string[];
  presionarTecla: (nota: string) => void;
  teclasActivas: string[];
}

const Teclado: React.FC<TecladoProps> = ({ notas, presionarTecla, teclasActivas }) => {
  return (
    <div className="teclado">
      {notas.map((nota) => (
        <Tecla
          key={nota}
          nota={nota}
          presionarTecla={presionarTecla}
          estaActiva={teclasActivas.includes(nota)}
        />
      ))}
    </div>
  );
};

export default Teclado;
