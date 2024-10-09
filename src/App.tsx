import React, { useState } from 'react';
import Teclado from './components/Teclado';
import Grabadora from './components/Grabadora';
import './App.css';

// Solo las notas: do, re, mi, fa, sol, la, si
const notasDisponibles = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];

const Piano: React.FC = () => {
  const [teclasActivas, setTeclasActivas] = useState<string[]>([]);
  const [notasGrabadas, setNotasGrabadas] = useState<string[]>([]);
  const [tocando, setTocando] = useState(false);

  const presionarTecla = (nota: string) => {
    setTeclasActivas([...teclasActivas, nota]);
    if (!tocando) {
      setNotasGrabadas([...notasGrabadas, nota]);
    }
  };

  return (
    <div className="piano">
      <Teclado 
        notas={notasDisponibles} 
        presionarTecla={presionarTecla}
        teclasActivas={teclasActivas}
      />
      <Grabadora 
        notasGrabadas={notasGrabadas}
        setNotasGrabadas={setNotasGrabadas}
        tocando={tocando}
        setTocando={setTocando}
      />
    </div>
  );
};

export default Piano;
