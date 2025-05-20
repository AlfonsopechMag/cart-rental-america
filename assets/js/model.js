class CarModel {
    constructor() {
        this.cart = [];
    }

    // Obtener todos los autos disponibles
    getAvailableCars() {
        return [
            {
                id: 1,
                name: "CHEVROLET ONIX 1.0",
                type: "Auto Económico",
                features: ["A/C", "Manual"],
                capacity: "5 pasajeros",
                luggage: "2 maletas",
                doors: "4 puertas",
                price: 32.00,
                image: "assets/img/CHEVROLET-Onix.jpg"
            },
            {
                id: 2,
                name: "CHEVROLET AVEO 1.4",
                type: "Auto Compacto",
                features: ["A/C", "Automático"],
                capacity: "5 pasajeros",
                luggage: "2 maletas",
                doors: "4 puertas",
                price: 38.00,
                image: "assets/img/aveo.jpg"
            },
            {
                id: 3,
                name: "VOLKSWAGEN VENTO 2.0",
                type: "Sedán Ejecutivo",
                features: ["A/C", "Automático"],
                capacity: "5 pasajeros",
                luggage: "3 maletas",
                doors: "4 puertas",
                price: 45.00,
                image: "assets/img/vento.jpg"
            },
            {
                id: 4,
                name: "NISSAN KICKS 1.6",
                type: "SUV Compacta",
                features: ["A/C", "Automático"],
                capacity: "5 pasajeros",
                luggage: "4 maletas",
                doors: "4 puertas",
                price: 50.00,
                image: "assets/img/nissan_kicks.jpg"
            },
            {
                id: 5,
                name: "TOYOTA HILUX 3.0",
                type: "Camioneta 4x4",
                features: ["A/C", "Automático"],
                capacity: "5 pasajeros",
                luggage: "Caja grande",
                doors: "4 puertas",
                price: 65.00,
                image: "assets/img/hilux.jpg"
            },
            {
                id: 6,
                name: "BMW SERIE 3 2.0",
                type: "Lujo Ejecutivo",
                features: ["A/C", "Automático"],
                capacity: "5 pasajeros",
                luggage: "3 maletas",
                doors: "4 puertas",
                price: 85.00,
                image: "assets/img/bmw.jpg"
            }
        ];
    }

    // Agregar auto al carrito
    addToCart(carId) {
        const car = this.getAvailableCars().find(c => c.id === carId);
        if (car) {
            this.cart.push({...car});
            return true;
        }
        return false;
    }

    // Eliminar auto del carrito por id
    removeFromCart(carId) {
        const index = this.cart.findIndex(item => item.id === carId);
        if (index !== -1) {
            this.cart.splice(index, 1);
            return true;
        }
        return false;
    }

    // Obtener carrito
    getCart() {
        return this.cart;
    }

    //Vaciar carrito
    clearCart() {
        this.cart = [];
    }

    // Calcular total
    getTotal() {
        return this.cart.reduce((total, item) => total + item.price, 0);
    }

    
}

export default CarModel;