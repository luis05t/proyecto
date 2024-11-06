# Simulador de Notas Musicales

-**Descripción**: Crea una aplicación que simula un piano virtual. Los usuarios pueden hacer clic en teclas para reproducir notas musicales y ver las notas que han tocado. También pueden grabar secuencias de notas y reproducirlas.
- **Habilidades**:

    - **Escribir tu primer componente de React**: Crear un componente `Tecla` que represente cada tecla del piano.
    ## Componente Tecla (Key) en React

### Código Correspondiente

```tsx
i// Importa los hooks React useEffect y useCallback
import React, { useEffect, useCallback } from 'react';

interface KeyProps {
  note: string; // La nota musical que representa la tecla
  pressKey: (note: string) => void; //Indicar que la tecla fue presionada
  releaseKey: (note: string) => void; //Indicar que la tecla fue liberada
  isActive: boolean; // Indica si la tecla está activa (presionada)
  keyboardKey?: string; // La tecla del teclado asociada a esta tecla
  playSound: (note: string) => void; // Función para reproducir el sonido de la nota
}

// Define el componente Key
const Key: React.FC<KeyProps> = ({ note, pressKey, releaseKey, isActive, keyboardKey, playSound }) => {
  // Crea una función de callback para manejar el clic en la tecla
  const handleClick = useCallback(() => {
    pressKey(note); // Llama a la función pressKey pasando la nota
    playSound(note); // Llama a la función playSound pasando la nota
  }, [note, pressKey, playSound]);

  // Agrega un efecto que maneja los eventos de teclado
  useEffect(() => {
    // Crea un objeto que mapea las teclas del teclado a las notas musicales
    const keyToNoteMap: Record<string, string> = {
      'a': 'C4', 
      's': 'D4', 
      'd': 'E4', 
      'f': 'F4', 
      'g': 'G4', 
      'h': 'A4', 
      'j': 'B4'
    };

    // Función para manejar el evento de tecla presionada
    const handleKeyDown = (event: KeyboardEvent) => {
      // Si la tecla se repite, no hacer nada
      if (event.repeat) return;
      // Obtener la nota a reproducir a partir de la tecla presionada
      const noteToPlay = keyToNoteMap[event.key];
      // Si se encontró una nota, llamar a las funciones pressKey y playSound
      if (noteToPlay) {
        pressKey(noteToPlay);
        playSound(noteToPlay);
      }
    };

    // Función para manejar el evento de tecla liberada
    const handleKeyUp = (event: KeyboardEvent) => {
      // Obtener la nota a liberar a partir de la tecla liberada
      const noteToRelease = keyToNoteMap[event.key];
      // Si se encontró una nota, llamar a la función releaseKey
      if (noteToRelease) {
        releaseKey(noteToRelease);
      }
    };

    // Agregar los event listeners a la ventana
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Devolver una función de limpieza que remueve los event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressKey, playSound, releaseKey]);

  // Renderizar el elemento div que representa la tecla
  return (
    <div
      role="button"
      aria-pressed={isActive}
      className={`key ${note.includes('#') ? 'black' : 'white'} ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <span className="note-name" aria-label={`Note ${note}`}>{note}</span>
      {keyboardKey && (
        <span className="keyboard-key" aria-label={`Keyboard key ${keyboardKey}`}>
          {keyboardKey}
        </span>
      )}
    </div>
  );
};

// Envuelve el componente Key en React.memo para mejorar el rendimiento
export default React.memo(Key);
```
### ¿Qué hace este fragmento de código?

Este código implementa un componente `Key` en React que representa una tecla de piano en una interfaz de usuario. El componente permite que una tecla se active (cambiando su estilo y reproduciendo un sonido) cuando se hace clic sobre ella o cuando se presiona la tecla correspondiente en el teclado. También maneja la liberación de la tecla, tanto al hacer clic como al soltar la tecla del teclado.

### ¿Cómo cumple con el requisito de la habilidad?

Este componente cumple con el requisito de representar una tecla del piano y asociarla con un sonido y una acción visual (activar o desactivar la tecla). Además, implementa la interacción tanto con el clic del ratón como con las teclas del teclado, permitiendo que el piano sea operado de ambas formas. Utiliza `useEffect` para manejar eventos del teclado y `useCallback` para optimizar la función de clic.

### ¿Por qué es la mejor forma de implementarlo?

La implementación es eficiente y modular. Utiliza el hook `useEffect` para registrar los eventos del teclado y limpiarlos cuando el componente se desmonta, lo que evita posibles pérdidas de memoria. También emplea `useCallback` para evitar la creación innecesaria de funciones en cada renderizado. Esto mejora el rendimiento cuando se tienen múltiples teclas y hace que el código sea fácil de mantener y expandir. Además, la estructura del componente es clara y accesible, utilizando roles y etiquetas `aria` para mejorar la accesibilidad.
#
- **Crear archivos con múltiples componentes**: Crear componentes para el teclado, el área de grabación y la reproducción de las notas.

### Componente Key (Tecla individual)

```typescript
const handleClick = useCallback(() => {
  pressKey(note);               // Llama a la función pressKey con la nota actual
  playSound(note);               // Reproduce el sonido correspondiente a la nota actual
}, [note, pressKey, playSound]); // Memoriza para evitar renders innecesarios

useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;          // Evita que se repita el sonido si la tecla 
    const noteToPlay = keyToNoteMap[event.key]; // Obtiene la nota asignada a la tecla presionada
    if (noteToPlay) {
      pressKey(noteToPlay);          // Activa pressKey para la nota asignada
      playSound(noteToPlay);         // Reproduce el sonido de la nota asignada
    }
  };

  window.addEventListener('keydown', handleKeyDown);  // Agrega un listener para eventos de presionar tecla
  return () => {
    window.removeEventListener('keydown', handleKeyDown); // Limpia el listener cuando el componente se desmonta
  };
}, [pressKey, playSound]);           // Dependencias para volver a ejecutar cuando estos cambien
```

### Componente Keyboard (Conjunto de teclas)

```typescript
return (
  <div className="keyboard" role="region" aria-label="Teclado virtual">
    {notes.map(({ note, type }) => (              // Mapea el array de notas para renderizar cada tecla
      <div
        key={note}                                // Clave única para cada elemento de nota
        role="button"                             // Hace que el div sea accesible como botón
        aria-pressed={activeKeys.includes(note)}  // Indica si la tecla está actualmente activa
        className={`key ${type} ${activeKeys.includes(note) ? 'active' : ''}`} // Asigna clases según el tipo y actividad de la tecla
        onMouseDown={() => pressKey(note)}        // Activa pressKey al presionar el botón del ratón
        onMouseUp={() => releaseKey(note)}        // Activa releaseKey al soltar el botón del ratón
      >
        <span className="note-name">{note}</span>  // Muestra el nombre de la nota dentro de la tecla
      </div>
    ))}
  </div>
);
```

### Componente Recorder (Grabador de secuencia de notas)

```typescript
useEffect(() => {
  if (!playing || sequenceRef.current === null) return;// Si no se está reproduciendo o la secuencia es nula, sale

  if (sequenceRef.current >= recordedNotes.length) { // Si la secuencia supera las notas grabadas
    cleanup();                                       // Detiene la reproducción y reinicia
    return;
  }

  const { timestamp } = recordedNotes[sequenceRef.current]; // Obtiene la marca de tiempo para la nota actual
  const delay = sequenceRef.current === 0 ? 0 : timestamp - recordedNotes[sequenceRef.current - 1].timestamp;                                      // Calcula el retraso en base a las marcas de tiempo
  timeoutRef.current = setTimeout(() => {         // Programa la reproducción de la siguiente nota
    sequenceRef.current! += 1;                   // Avanza a la siguiente nota en la secuencia
  }, delay);

  return () => clearTimeout(timeoutRef.current); // Limpia el temporizador para evitar fugas de memoria
}, [playing, recordedNotes, cleanup]);          // Dependencias para re-ejecutar el efecto
```
## ¿Qué hace este fragmento de código?

Este conjunto de componentes permite al usuario tocar un piano virtual, grabar secuencias de notas con sus tiempos de ejecución y reproducir esas grabaciones. Cada componente desempeña un rol particular:
Key: representa una tecla individual que reproduce un sonido específico.
Keyboard: organiza y maneja un conjunto de teclas, definiendo la disposición del piano.
Recorder: permite grabar las notas presionadas y reproducirlas con la misma cadencia de tiempo en que fueron registradas.

## ¿Cómo cumple con el requisito de la habilidad?

Cada componente utiliza técnicas clave de React como el manejo de props, estados locales, referencias (useRef) y efectos (useEffect) para cumplir con los requisitos:
Key y Keyboard responden a eventos del mouse y teclado, permitiendo una experiencia de usuario fluida en la ejecución de notas.
Recorder utiliza referencias y temporizadores para capturar y reproducir la secuencia de notas en el mismo intervalo en que se grabaron, asegurando precisión en la reproducción.
## ¿Por qué es la mejor forma de implementarlo?

Esta implementación en React es modular y escalable. Cada componente encapsula su funcionalidad, haciendo que el código sea reutilizable y fácil de mantener. Además:
Componentización: El uso de componentes separados para Key, Keyboard, y Recorder permite una clara separación de responsabilidades, manteniendo el código limpio y mejor organizado.
Eficiencia en el manejo de eventos: Los componentes usan useCallback para optimizar el rendimiento y evitar renderizados innecesarios. useEffect y useRef garantizan la ejecución fluida de las secuencias de reproducción.
Experiencia de usuario: La implementación de referencias y temporizadores en Recorder proporciona una experiencia de usuario fiel al momento en que se grabaron las notas, mejorando la interacción general con el piano.

- **Añadir marcado a JavaScript con JSX**: Usar JSX para renderizar el teclado y la interfaz de grabación/reproducción.
### Key
```typescript 
return (
  <div
    role="button" // Marca como botón para accesibilidad
    aria-pressed={isActive} // Indica si está presionada
    className={`key ${note.includes('#') ? 'black' : 'white'} ${isActive ? 'active' : ''}`} // Clases CSS para color y estado
    onClick={handleClick} // Maneja clic para presionar la tecla
  >
    <span className="note-name" aria-label={`Note ${note}`}>{note}</span> 
    {/* Muestra el nombre de la nota */}
    
    {keyboardKey && (
      <span className="keyboard-key" aria-label={`Keyboard key ${keyboardKey}`}>
        {keyboardKey}
      </span>
    )}
    {/* Muestra la tecla del teclado si se proporciona */}
  </div>
);
```
### Keyboard
```typescript 

return (
  <div className="keyboard" role="region" aria-label="Virtual keyboard">
    {notes.map(({ note, type }) => (
      <div
        key={note} // Clave única para cada tecla
        role="button" // Marca como botón para accesibilidad
        aria-pressed={activeKeys.includes(note)} // Indica si la tecla está presionada
        className={`key ${type} ${activeKeys.includes(note) ? 'active' : ''}`} // Clases CSS para tipo y estado de la tecla
        onMouseDown={() => pressKey(note)} // Función al presionar la tecla con el ratón
        onMouseUp={() => releaseKey(note)} // Función al soltar la tecla con el ratón
        onMouseLeave={() => releaseKey(note)} // Función si se deja de presionar fuera de la tecla
        tabIndex={0} // Habilita la tecla para ser enfocada con el teclado
        aria-label={`Key ${note}`} // Etiqueta accesible para la tecla
      >
        <span className="note-name">{note}</span> 
        {/* Muestra el nombre de la nota en la tecla */}
      </div>
    ))}
  </div>
);
```
### Recorder
```typescript 
return (
  <div className="recorder" role="region" aria-label="Recorder controls">
    {/* Renderiza el botón para iniciar la grabación. El botón se desactiva si ya está grabando */}
    {renderButton(BUTTON_STATES.RECORD, startRecording, recording)} 

    {/* Renderiza el botón para detener la grabación. El botón se desactiva si no está grabando */}
    {renderButton(BUTTON_STATES.STOP, stopRecording, !recording)} 

    {/* Renderiza el botón para reproducir la grabación. El botón se desactiva si no hay notas grabadas o si ya se está reproduciendo */}
    {renderButton(BUTTON_STATES.PLAY, playRecording, !recordedNotes.length || playing)} 
    
    <div className="recorder-status" aria-live="polite">
      {/* Muestra el estado actual de la grabación o la reproducción */}
      {recording && <span>Recording...</span>}
      {playing && <span>Playing...</span>}
    </div>
  </div>
);

```
## ¿Qué hace este fragmento de código?
Este código utiliza JSX para renderizar un teclado virtual accesible en una aplicación React, con botones para grabar, detener y reproducir notas. Las teclas pueden ser presionadas tanto con el ratón como con el teclado, y se proporciona retroalimentación visual y accesible sobre el estado de cada tecla (presionada o no).

## ¿Cómo cumple con el requisito de la habilidad?
El código cumple con el requisito de "Añadir marcado a JavaScript con JSX" al usar JSX para estructurar el HTML del teclado y los controles de grabación/reproducción, permitiendo combinar la lógica de JavaScript con la estructura de la interfaz de usuario de manera clara y eficiente.

## ¿Por qué es la mejor forma de implementarlo?
JSX es ideal porque permite escribir HTML dentro de JavaScript, facilitando la creación de interfaces dinámicas y reactivas. Además, su integración con React y la gestión del estado hacen que sea fácil manejar interacciones y accesibilidad de manera eficiente.

- **Añadir llaves con JSX**: Utilizar llaves para manejar las notas que el usuario toca.
```typescript  
{notes.map(({ note, type }) => (
  <div
    key={note}  // Clave única para cada tecla, que es la nota
    role="button"  // Marca como botón para accesibilidad
    aria-pressed={activeKeys.includes(note)}  // Indica si la tecla está presionada
    className={`key ${type} ${activeKeys.includes(note) ? 'active' : ''}`}  // Clases dinámicas para el tipo de tecla y su estado (activo o no)
    onMouseDown={() => pressKey(note)}  // Al presionar la tecla, se pasa la nota al manejarla
    onMouseUp={() => releaseKey(note)}  // Al soltar la tecla, se pasa la nota al manejarla
    onMouseLeave={() => releaseKey(note)}  // Si se deja de presionar fuera de la tecla, se pasa la nota al manejarla
    tabIndex={0}  // Permite que la tecla sea enfocada con el teclado
    aria-label={`Key ${note}`}  // Etiqueta accesible para la tecla
  >
    <span className="note-name">{note}</span>  // Muestra el nombre de la nota que el usuario toca (esto es lo que maneja al usuario)
  </div>
))}
```
## ¿Qué hace este fragmento de código?
Este código renderiza un teclado virtual con teclas correspondientes a notas musicales. Cada tecla es interactiva, permitiendo al usuario presionar y soltar notas, y refleja visualmente el estado (presionada o no).

## ¿Cómo cumple con el requisito de la habilidad?
Utiliza llaves con JSX para manejar las notas que el usuario toca, pasando la información de cada nota (por ejemplo, note) a las funciones de interacción (pressKey, releaseKey) y a los elementos visuales (como aria-pressed y className).

## Por qué es la mejor forma de implementarlo?
Es eficiente y limpio porque:

Usa llaves para manejar dinámicamente las notas en el JSX.

Mejora la accesibilidad con atributos como aria-pressed y tabIndex.

Es modular y escalable, lo que facilita agregar más notas o modificar el comportamiento sin complicaciones.

- **Configurar componentes con props**: Pasar la información de las notas y los controles de grabación/reproducción como props entre componentes.
### Key
```typescript 
const Key: React.FC<KeyProps> = ({ note, pressKey, releaseKey, isActive, keyboardKey, playSound }) => {
  const handleClick = useCallback(() => {
    pressKey(note);
    playSound(note);
  }, [note, pressKey, playSound]);

  return (
    <div
      role="button"
      aria-pressed={isActive}
      className={`key ${note.includes('#') ? 'black' : 'white'} ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <span className="note-name">{note}</span>
      {keyboardKey && <span className="keyboard-key">{keyboardKey}</span>}
    </div>
  );
};
```
### Keyboard
```typescript 
const Keyboard: React.FC<KeyboardProps> = ({ notes, pressKey, releaseKey, activeKeys, playSound }) => {
  return (
    <div className="keyboard" role="region" aria-label="Virtual keyboard">
      {notes.map(({ note, type }) => (
        <div
          key={note}
          role="button"
          aria-pressed={activeKeys.includes(note)} // Utiliza la prop activeKeys
          className={`key ${type} ${activeKeys.includes(note) ? 'active' : ''}`} // Utiliza la prop activeKeys
          onMouseDown={() => {
            pressKey(note); // Utiliza la prop pressKey
            playSound(note); // Utiliza la prop playSound
          }}
          onMouseUp={() => releaseKey(note)} // Utiliza la prop releaseKey
          onMouseLeave={() => releaseKey(note)} // Utiliza la prop releaseKey
          tabIndex={0}
          aria-label={`Key ${note}`}
        >
          <span className="note-name">{note}</span>
        </div>
      ))}
    </div>
  );
};
```
### Recorder
```typescript
const Recorder: React.FC<RecorderProps> = ({
  recordedNotes,
  setRecordedNotes,
  playing,
  setPlaying,
  recording,
  setRecording,
  onError
}) => {
```
## ¿Qué hace este fragmento de código?

Recorder: Recibe las propiedades (props) recordedNotes, setRecordedNotes, playing, setPlaying, recording, setRecording, y onError, y maneja la grabación y reproducción de las notas.

Keyboard: Recibe las propiedades (props) notes, pressKey, releaseKey, activeKeys, y playSound, y renderiza las teclas del piano. Permite presionar y soltar las teclas con el ratón o el teclado.

Key: Recibe las propiedades (props) note, pressKey, releaseKey, isActive, keyboardKey, y playSound. Representa una tecla individual y maneja las interacciones con el ratón y el teclado.

## ¿Cómo cumple con el requisito de la habilidad?
Interactividad: Con las propiedades pressKey, releaseKey y playSound, los componentes permiten la interacción del usuario con el piano usando ratón y teclado.

Accesibilidad: Las propiedades como aria-pressed y tabIndex garantizan que las teclas sean accesibles.

Grabación: Recorder usa las propiedades recordedNotes, setRecordedNotes, playing, y setPlaying para manejar la grabación y reproducción.

### ¿Por qué es la mejor forma de implementarlo?
Eficiencia: useCallback y useEffect optimizan el rendimiento al manejar eventos y actualizaciones de manera eficiente.

Accesibilidad: Las propiedades aseguran que el piano sea accesible para usuarios con diferentes necesidades.

Reactividad: Los props permiten que el estado de la aplicación se maneje de manera reactiva, asegurando interacciones fluidas.
#
- **Renderizar condicionalmente**: Mostrar visualmente cuando una tecla es presionada o está siendo reproducida en la secuencia.
- **Renderizar múltiples componentes a la vez**: Renderizar todas las teclas del teclado utilizando `map`.
- **Mantener componentes puros**: Asegurar que los componentes `Tecla` no muten el estado directamente, sino que reciban información a través de props.
- **Entender la UI como árboles**: Organizar las teclas, la grabación y la reproducción de manera jerárquica.
- **Controlar eventos del usuario**: Capturar eventos para tocar una tecla, grabar una secuencia y reproducir las notas.
- **Gestionar el estado**: Controlar el estado de las notas grabadas, las teclas presionadas y la reproducción de la secuencia.
- **Levantar el estado**: Compartir el estado entre los componentes del teclado y la grabadora para que las notas se graben y reproduzcan correctamente.
- **Sincronización de efectos**: Usar `useEffect` para manejar la reproducción de notas en una secuencia grabada.
- **Acceder a valores del DOM**: Usar `useRef` para asegurarse de que el teclado responda correctamente a la interacción del usuario.