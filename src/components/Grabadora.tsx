import React, { useEffect, useRef, useState } from 'react';

interface GrabadoraProps {
  notasGrabadas: string[];
  setNotasGrabadas: (notas: string[]) => void;
  tocando: boolean;
  setTocando: (estado: boolean) => void;
}

const Grabadora: React.FC<GrabadoraProps> = ({ notasGrabadas, setNotasGrabadas, tocando, setTocando }) => {
  const [grabando, setGrabando] = useState(false);
  const secuenciaRef = useRef<number | null>(null);

  const empezarGrabacion = () => {
    setNotasGrabadas([]);
    setGrabando(true);
  };

  const detenerGrabacion = () => {
    setGrabando(false);
  };

  const reproducirGrabacion = () => {
    setTocando(true);
    secuenciaRef.current = 0;
  };

  useEffect(() => {
    if (tocando && secuenciaRef.current !== null && secuenciaRef.current < notasGrabadas.length) {
      setTimeout(() => {
        secuenciaRef.current!++;
      }, 500);
    } else if (secuenciaRef.current === notasGrabadas.length) {
      setTocando(false);
      secuenciaRef.current = null;
    }
  }, [tocando, notasGrabadas]);

  return (
    <div className="grabadora">
      <button onClick={empezarGrabacion} disabled={grabando}>
        Grabar
      </button>
      <button onClick={detenerGrabacion} disabled={!grabando}>
        Detener
      </button>
      <button onClick={reproducirGrabacion} disabled={notasGrabadas.length === 0 || tocando}>
        Reproducir
      </button>
    </div>
  );
};

export default Grabadora;
