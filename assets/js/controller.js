// assets/js/controller.js
import CarModel from './model.js';

class CarController {
    constructor() {
        this.model = new CarModel();
        this.cartButton = document.getElementById('cartButton');
        this.cartModal = new bootstrap.Modal(document.getElementById('cartModal'));        
        this.checkoutBtn = document.getElementById('checkoutBtn');

        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.renderCars();
            }, 200);
        });
                
        if (!this.checkoutBtn) {
            console.error('ERROR: Botón checkoutBtn no encontrado en el DOM');
            return;
        }

        if (!this.cartButton || !this.cartModal) {
            console.error('Elementos esenciales no encontrados');
            return;
        }

        this.checkoutBtn.addEventListener('click', () => this.handleCheckout());
        this.cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showCart();
        });
                
        const cartIcon = this.cartButton.querySelector('i.fa-shopping-cart');
        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showCart();
            });
        }
        this.initEvents();
        this.renderCars();
        this.updateCartCount();        
    }
    
    initEvents() {
        // Evento para botones de reserva
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-reserve')) {
                const carId = parseInt(e.target.dataset.id);
                this.addToCart(carId);
            }

            if (e.target.classList.contains('remove-item')) {
                const carId = parseInt(e.target.dataset.id);
                this.removeFromCart(carId);
            }

            if (e.target.id === 'cartButton') {
                this.showCart();
            }
        });
    }

    addToCart(carId) {
        if (this.model.addToCart(carId)) {
            this.showToast('Auto agregado al carrito', 'success');
            this.updateCartCount();
        }
    }

    removeFromCart(carId) {
        if (this.model.removeFromCart(carId)) {
            this.showToast('Auto removido del carrito', 'warning');
            this.updateCartCount();
            this.showCart(); // Actualizar la vista del carrito
        }
    }

    showCart() {
        const cart = this.model.getCart();
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        const checkoutBtn = document.getElementById('checkoutBtn');

        //Si el carrito esta vacio se deshabilita el boton
        if (checkoutBtn) {
            checkoutBtn.disabled = cart.length === 0;
        }

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">No hay autos en el carrito</p>';
            cartTotal.textContent = '$0.00 USD';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="row mb-3 align-items-center">
                    <div class="col-md-4">
                        <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
                    </div>
                    <div class="col-md-6">
                        <h5>${item.name}</h5>
                        <p>${item.type} - $${item.price.toFixed(2)} USD</p>
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            cartTotal.textContent = `$${this.model.getTotal().toFixed(2)} USD`;
        }

        this.cartModal.show();
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        cartCount.textContent = this.model.getCart().length;
    }

    async handleCheckout() {
        
        // Se deshabilita el boton durante el proceso
        this.checkoutBtn.disabled = true;
        const originalText = this.checkoutBtn.innerHTML;
        this.checkoutBtn.innerHTML = 'Procesando...';

        try {
            //Simulacion de pago (2 segundos)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            //Ocultar modal de compra
            this.cartModal.hide();

            //Vacio el carrito
            this.model.clearCart();
            
            //Mostro confirmacion
            this.showPaymentSuccess();
            
            //Se actualiza la data
            this.updateCartCount();
            this.showCart();
            
        } catch (error) {
            console.error('Error en handleCheckout:', error);
            this.showToast('Error al procesar el pago', 'danger');
        } finally {
            //Restauro el boton
            this.checkoutBtn.disabled = false;
            this.checkoutBtn.innerHTML = originalText;
        }
    }

    showPaymentSuccess() {        
        const modalId = 'paymentSuccessModal';
            
        const existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();
        
        // Crear nuevo modal de pago
        const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body text-center p-5">
                        <i class="fas fa-check-circle text-success mb-4" style="font-size: 5rem;"></i>
                        <h3>¡Compra Exitosa!</h3>
                        <p class="mb-4">Tu reserva ha sido confirmada</p>
                        <button class="btn btn-success" data-bs-dismiss="modal">
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        new bootstrap.Modal(document.getElementById(modalId)).show();
    }


    showPaymentSuccess() {
        // Crear modal de éxito
        const successModal = `
            <div class="modal fade" id="paymentSuccessModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center py-4">
                            <div class="mb-4">
                                <i class="fas fa-check-circle text-success" style="font-size: 5rem;"></i>
                            </div>
                            <h3 class="mb-3">¡Pago Exitoso!</h3>
                            <p class="mb-4">Tu reserva ha sido confirmada. Recibirás un correo con los detalles.</p>
                            <div class="d-grid gap-2">
                                <button class="btn btn-success" data-bs-dismiss="modal">
                                    <i class="fas fa-thumbs-up me-2"></i>Entendido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Agregar al DOM
        document.body.insertAdjacentHTML('beforeend', successModal);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('paymentSuccessModal'));
        modal.show();
        
        // Eliminar modal después de cerrar
        document.getElementById('paymentSuccessModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('paymentSuccessModal').remove();
        });
    }


    renderCars() {
        const cars = this.model.getAvailableCars();
        const carouselInner = document.querySelector('.carousel-inner');
        carouselInner.innerHTML = '';

        // Determinar número de cards por slide según el ancho de pantalla
        const cardsPerSlide = window.innerWidth < 768 ? 1 : 
                            window.innerWidth < 992 ? 2 : 3;

        // Divido los autos en grupos
        for (let i = 0; i < cars.length; i += cardsPerSlide) {
            const slideCars = cars.slice(i, i + cardsPerSlide);
            const slideItem = document.createElement('div');
            slideItem.className = `carousel-item ${i === 0 ? 'active' : ''}`;
            
            const row = document.createElement('div');
            row.className = 'row justify-content-center';
            
            slideCars.forEach(car => {
                const col = document.createElement('div');
                col.className = 'col-md-4 mb-4';
                col.innerHTML = this.createCarCard(car);
                row.appendChild(col);
            });
            
            slideItem.appendChild(row);
            carouselInner.appendChild(slideItem);
        }
    
        if (this.carousel) {
            this.carousel.dispose();
        }
        this.carousel = new bootstrap.Carousel(document.getElementById('carsCarousel'));
        }
        
        createCarCard(car) {
            return `
                <div class="col-lg-12 col-md-12 mb-4">
                    <div class="car-card">
                        <img src="${car.image}" class="car-img card-img-top" alt="${car.name}">
                        <div class="card-body p-4">
                            <h5 class="car-title card-title">${car.name}</h5>
                            <div class="container pt-4">
                                <div class="row align-items-start">
                                    <div class="col">
                                        <span class="fs-5">${car.type}</span><br>
                                        ${car.features.map(f => `
                                            <i class="fas ${f === 'A/C' ? 'fa-snowflake' : 'fa-cogs'} feature-icon"></i>
                                            <span class="fs-5">${f}</span><br>
                                        `).join('')}
                                    </div>
                                    <div class="col">
                                        <span class="fs-5">${car.capacity}</span><br/>
                                        <span class="fs-5"><i class="fas fa-suitcase feature-icon"></i> ${car.luggage}</span><br/>
                                        <span><i class="fas fa-door-open feature-icon"></i> <span class="fs-5">${car.doors}</span></span>
                                    </div>                            
                                </div>
                            </div>                    
                            <div class="d-flex justify-content-center pt-4 mb-3">                            
                                <p class="price-tag">$${car.price.toFixed(2)} USD</p>                            
                            </div>
                            <div class="d-flex justify-content-center mb-3">                            
                                <button class="btn reserve-btn btn-reserve" data-id="${car.id}">
                                    RESERVAR AUTO
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    }
   
    showToast(message, type) {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        // Eliminar el toast después de que se cierre
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CarController();
});