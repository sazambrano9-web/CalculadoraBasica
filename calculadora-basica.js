class CalculadoraBasica extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.renderizar();
    }

    renderizar() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Importar Bootstrap 5 CSS dentro del Shadow DOM */
                @import "./css/bootstrap.min.css";

                /* Estilos personalizados */
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

    
            </div>
        `;

        

// Definir el componente personalizado
customElements.define('calculadora-basica', CalculadoraBasica);
   


}
}