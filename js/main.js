document.addEventListener('DOMContentLoaded', () => {
    // Estado del Carrito
    let carrito = [];
    
    const cartCountEl = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalEl = document.getElementById('cartTotal');
    const btnAbrirCarrito = document.getElementById('btnAbrirCarrito');
    const offcanvasElement = document.getElementById('offcanvasCart');
    const offcanvasCart = new bootstrap.Offcanvas(offcanvasElement);
    const clienteDetalle = document.getElementById('clienteDetalle');

    // 1. Añadir Productos al Carrito
    document.querySelectorAll('.btn-add-cart').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombre = e.currentTarget.getAttribute('data-nombre');
            const precio = parseInt(e.currentTarget.getAttribute('data-precio'));

            const existente = carrito.find(item => item.nombre === nombre);
            if (existente) {
                existente.cantidad += 1;
            } else {
                carrito.push({ nombre, precio, cantidad: 1 });
            }

            actualizarCarrito();
            offcanvasCart.show();
        });
    });

    // 2. Actualizar Interfaz del Carrito
    function actualizarCarrito() {
        // Actualizar contador
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        cartCountEl.textContent = totalItems;

        // Renderizar Lista
        if (carrito.length === 0) {
            cartItemsContainer.innerHTML = `<p class="text-muted text-center py-5">Tu bolsa está vacía.</p>`;
            cartTotalEl.textContent = `$0`;
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        carrito.forEach((item, index) => {
            total += item.precio * item.cantidad;
            const itemEl = document.createElement('div');
            itemEl.className = 'd-flex justify-content-between align-items-center border-bottom pb-2';
            itemEl.innerHTML = `
                <div>
                    <h6 class="mb-0 font-serif fw-bold fs-6">${item.nombre}</h6>
                    <small class="text-muted">$${item.precio.toLocaleString()} x ${item.cantidad}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold">$${(item.precio * item.cantidad).toLocaleString()}</span>
                    <button class="btn btn-sm btn-outline-danger border-0 btn-remove" data-index="${index}">
                        <i class="bi bi-x-circle"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartTotalEl.textContent = `$${total.toLocaleString()}`;

        // Eventos para eliminar ítems
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                carrito.splice(idx, 1);
                actualizarCarrito();
            });
        });
    }

    // 3. Abrir Carrito
    btnAbrirCarrito.addEventListener('click', () => offcanvasCart.show());

    // 4. Copiar Carrito al Formulario
    document.getElementById('btnCheckout').addEventListener('click', () => {
        if (carrito.length === 0) return;
        
        let resumen = carrito.map(i => `${i.cantidad}x ${i.nombre}`).join(', ');
        clienteDetalle.value = `Pedido de la Bolsa: ${resumen}`;
        offcanvasCart.hide();
        document.getElementById('pedido').scrollIntoView({ behavior: 'smooth' });
    });

    // 5. Filtros Dinámicos del Catálogo
    const botonesFiltro = document.querySelectorAll('#filtrosMenu .btn-filter');
    const productos = document.querySelectorAll('.item-producto');

    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', (e) => {
            botonesFiltro.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const categoria = e.currentTarget.getAttribute('data-categoria');

            productos.forEach(prod => {
                if (categoria === 'todos' || prod.getAttribute('data-categoria') === categoria) {
                    prod.style.display = 'block';
                } else {
                    prod.style.display = 'none';
                }
            });
        });
    });

    // 6. Formulario de Pedido
    const form = document.getElementById('formPedidoCompleto');
    const alerta = document.getElementById('alertaConfirmacion');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alerta.classList.remove('d-none');
            form.reset();
            carrito = [];
            actualizarCarrito();

            setTimeout(() => {
                alerta.classList.add('d-none');
            }, 6000);
        });
    }
});