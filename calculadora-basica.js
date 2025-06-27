class CalculadoraBasica extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.historial = []; // Inicializar array de historial
        this.renderizar();
    }

    renderizar() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Importar Bootstrap 5 CSS dentro del Shadow DOM */
                @import "./css/bootstrap.min.css";

                /* Estilos personalizados para el componente */
                .contenedor-calculadora {
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 8px 8px rgba(14, 175, 187, 0.88);
                    background-color:rgba(229, 255, 233, 0.88);
                    max-width: 400px;
                    margin: 20px auto;
                    font-family: Arial, sans-serif;
                }
                .grupo-formulario {
                    margin-bottom: 20px;

                }
                .area-resultado {
                    margin-top: 20px;
                    padding: 10px;
                    border: 1px solidrgb(3, 129, 255);
                    border-radius: 5px;
                    background-color:rgb(1, 248, 55);
                    font-size: 1.2em;
                    text-align: center;
                    text-transform: uppercase;
                    
                }
                .mensaje-error {
                    color: #dc3545;
                    font-weight: bold;
                        
                }
                .contenedor-historial {
                    margin-top: 20px;
                    border-top: 1px solid #eee;
                    padding-top: 15px;
                }
                .lista-historial {
                    list-style: none;
                    padding: 0;
                    max-height: 150px;
                    overflow-y: auto;
                    border: 1px solid #e9ecef;
                    border-radius: 5px;
                    background-color: #f8f9fa;
                    margin: 0;
                }
                .lista-historial li {
                    padding: 8px 12px;
                    border-bottom: 1px solid #e9ecef;
                    font-size: 0.9em;
                }
                .lista-historial li:last-child {
                    border-bottom: none;
                }
            </style>
            <div class="contenedor-calculadora">
                <h2 class="mb-4 text-center">Calculadora Básica</h2>
                <div class="grupo-formulario">
                    <label for="num1" class="form-label">Número 1:</label>
                    <input type="number" id="num1" class="form-control" placeholder="Ingrese el primer número">
                </div>
                <div class="grupo-formulario">
                    <label for="num2" class="form-label">Número 2:</label>
                    <input type="number" id="num2" class="form-control" placeholder="Ingrese el segundo número">
                </div>
                <div class="grupo-formulario">
                    <label for="operacion" class="form-label">Operación:</label>
                    <select id="operacion" class="form-select">
                        <option value="suma">Suma (+)</option>
                        <option value="resta">Resta (-)</option>
                        <option value="multiplicacion">Multiplicación (*)</option>
                        <option value="division">División (/)</option>
                    </select>
                </div>
                <button id="btnCalcular" class="btn btn-primary w-100 mb-3">Calcular</button>
                <div class="area-resultado" id="resultado">
                    Esperando cálculo...
                </div>

                <div class="contenedor-historial">
                    <h5 class="text-center">Historial de Operaciones</h5>
                    <ul id="listaHistorial" class="lista-historial">
                        </ul>
                </div>
            </div>
        `;

        this.adjuntarManejadoresEventos();
        this.actualizarHistorialPantalla();
    }

    adjuntarManejadoresEventos() {
        const btnCalcular = this.shadowRoot.getElementById('btnCalcular');
        btnCalcular.addEventListener('click', () => this.realizarCalculo());
    }

    realizarCalculo() {
        const inputNum1 = this.shadowRoot.getElementById('num1');
        const inputNum2 = this.shadowRoot.getElementById('num2');
        const selectOperacion = this.shadowRoot.getElementById('operacion');
        const divResultado = this.shadowRoot.getElementById('resultado');

        const num1 = parseFloat(inputNum1.value);
        const num2 = parseFloat(inputNum2.value);
        const operacion = selectOperacion.value;
        const simboloOperacion = selectOperacion.options[selectOperacion.selectedIndex].text.match(/\((.*?)\)/)[1];

        // Validación de campos vacíos o no numéricos
        if (isNaN(num1) || inputNum1.value.trim() === '') {
            divResultado.innerHTML = '<span class="mensaje-error">Error: El Número 1 no es válido.</span>';
            return;
        }
        if (isNaN(num2) || inputNum2.value.trim() === '') {
            divResultado.innerHTML = '<span class="mensaje-error">Error: El Número 2 no es válido.</span>';
            return;
        }

        let resultado;
        let mensajeError = '';

        switch (operacion) {
            case 'suma':
                resultado = num1 + num2;
                break;
            case 'resta':
                resultado = num1 - num2;
                break;
            case 'multiplicacion':
                resultado = num1 * num2;
                break;
            case 'division':
                if (num2 === 0) {
                    mensajeError = 'Error: No se puede dividir por cero.';
                } else {
                    resultado = num1 / num2;
                }
                break;
            default:
                mensajeError = 'Operación no válida.';
        }

        if (mensajeError) {
            divResultado.innerHTML = `<span class="mensaje-error">${mensajeError}</span>`;
            // No se añade al historial ni se emite evento si hay error
        } else {
            const resultadoFormateado = resultado.toFixed(2);
            divResultado.textContent = `Resultado: ${resultadoFormateado}`;

            // Añadir operación al historial
            const entradaHistorial = `${num1} ${simboloOperacion} ${num2} = ${resultadoFormateado}`;
            this.historial.unshift(entradaHistorial);
            if (this.historial.length > 5) { // últimas 5 operaciones
                this.historial.pop();
            }
            this.actualizarHistorialPantalla();

            // Emitir evento personalizado
            const evento = new CustomEvent('calculoCompletado', {
                detail: {
                    numero1: num1,
                    numero2: num2,
                    operacion: operacion,
                    operacionSimbolo: simboloOperacion,
                    resultado: resultado,
                    resultadoFormateado: resultadoFormateado,
                    historial: this.historial // enviao de todo el historial
                },
                bubbles: true, // Permitir que el evento burbujee por el DOM
                composed: true // Permitir que el evento cruce el límite del Shadow DOM
            });
            this.dispatchEvent(evento);
        }
    }

    actualizarHistorialPantalla() {
        const listaHistorial = this.shadowRoot.getElementById('listaHistorial');
        listaHistorial.innerHTML = ''; // Limpiar historial previo
        if (this.historial.length === 0) {
            listaHistorial.innerHTML = '<li class="text-center text-muted">No hay operaciones registradas.</li>';
            return;
        }
        this.historial.forEach(entrada => {
            const li = document.createElement('li');
            li.textContent = entrada;
            listaHistorial.appendChild(li);
        });
    }
}

// Definir el componente personalizado
customElements.define('calculadora-basica', CalculadoraBasica);

