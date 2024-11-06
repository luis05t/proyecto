# Simulador de Notas Musicales

-**Descripción**: Crea una aplicación que simula un piano virtual. Los usuarios pueden hacer clic en teclas para reproducir notas musicales y ver las notas que han tocado. También pueden grabar secuencias de notas y reproducirlas.
- **Habilidades**:

    - **Escribir tu primer componente de React**: Crear un componente `Tecla` que represente cada tecla del piano.

    - **Crear archivos con múltiples componentes**: Crear componentes para el teclado, el área de grabación y la reproducción de las notas.

    - **Añadir marcado a JavaScript con JSX**: Usar JSX para renderizar el teclado y la interfaz de grabación/reproducción.

    - **Añadir llaves con JSX**: Utilizar llaves para manejar las notas que el usuario toca.

    - **Configurar componentes con props**: Pasar la información de las notas y los controles de grabación/reproducción como props entre componentes.

    - **Renderizar condicionalmente**: Mostrar visualmente cuando una tecla es presionada o está siendo reproducida en la secuencia.

    - **Renderizar múltiples componentes a la vez**: Renderizar todas las teclas del teclado utilizando `map`.

    - **Mantener componentes puros**: Asegurar que los componentes `Tecla` no muten el estado directamente, sino que reciban información a través de props.

    - **Entender la UI como árboles**: Organizar las teclas, la grabación y la reproducción de manera jerárquica.

    - **Controlar eventos del usuario**: Capturar eventos para tocar una tecla, grabar una secuencia y reproducir las notas.

    - **Gestionar el estado**: Controlar el estado de las notas grabadas, las teclas presionadas y la reproducción de la secuencia.

    - **Levantar el estado**: Compartir el estado entre los componentes del teclado y la grabadora para que las notas se graben y reproduzcan correctamente.

    - **Sincronización de efectos**: Usar `useEffect` para manejar la reproducción de notas en una secuencia grabada.
    
    - **Acceder a valores del DOM**: Usar `useRef` para asegurarse de que el teclado responda correctamente a la interacción del usuario.
