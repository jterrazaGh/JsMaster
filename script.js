class Login {
    
    #bdUsers = [{ "user": 'js', "password": "p" }];
    constructor() { }

    validarestado() {
        const loginUser = JSON.parse(sessionStorage.getItem('usuarioActivo'));
        this.validarUsuario(loginUser.user, loginUser.password);
    }

    validarUsuario(userdata, passdata) {
        if (userdata === this.#bdUsers[0].user && passdata === this.#bdUsers[0].password) {
            const datosUser = {
                user: userdata,
                password: passdata
            };
            sessionStorage.setItem('usuarioActivo', JSON.stringify(datosUser));
            this.activeUser = userdata;
            puser.innerHTML = `Bienvenido, ${userdata}`;
            userActivo.classList = 'activo';
            userInactivo.classList = 'inactivo';
            txtUser.value = "";
            txtPassword.value = "";
            btnPagar.disabled = false;
        }
        else {
            msgAlert.innerHTML = 'Usuario o clave invalido';
            setTimeout(() => {
                msgAlert.innerHTML = '';
            }, 2000);
        }
    }
    cerrarSesion() {
        sessionStorage.removeItem('usuarioActivo');
        userActivo.classList = 'inactivo';
        userInactivo.classList = 'activo';
        btnPagar.disabled = true;
    }
}
class Productos {
    #bdProducts = [
        { "id": 1300, "title": "Short", "valor": 7000, "cantidad": 5, "image": "image/p1.jpg" },
        { "id": 1301, "title": "Polera", "valor": 3500, "cantidad": 5, "image": "image/p2.jpg" },
        { "id": 1302, "title": "Zapatilla", "valor": 19000, "cantidad": 5, "image": "image/p3.jpg" },
        { "id": 1303, "title": "Medias", "valor": 5000, "cantidad": 5, "image": "image/p4.jpg" },
        { "id": 1304, "title": "Buso", "valor": 14000, "cantidad": 5, "image": "image/p5.jpg" }
    ]
    constructor() { }

    getProductos() {
        localStorage.setItem('stock', JSON.stringify(this.#bdProducts));
        return this.#bdProducts;
    }

    filtrocantidad = (data, keys, fn) =>
        data.filter(fn).map(element =>
            keys.reduce((acc, key) => {
                acc[key] = element[key];
                return acc;
            }, {})
        );

}

class Carrito {
    #articulosCarrito = {};

    constructor() { }

    addProduct = elementoP => {

        const productCompra = {
            id: elementoP.querySelector('.productBtn').dataset.id,
            nombre: elementoP.querySelector('h5').textContent,
            cantidad: 1,
            precio: elementoP.querySelector('p').textContent
        }
        
        const stockCnt = productos.filtrocantidad(stockbd, ['id', 'title', 'cantidad'], item => item.id == productCompra.id);

        if (this.#articulosCarrito.hasOwnProperty(productCompra.id)) {
            if (this.#articulosCarrito[productCompra.id].cantidad + 1 <= stockCnt[0].cantidad) {
                productCompra.cantidad = this.#articulosCarrito[productCompra.id].cantidad + 1;
            }
            else {
                productCompra.cantidad = this.#articulosCarrito[productCompra.id].cantidad;
            }
        }

        this.#articulosCarrito[productCompra.id] = { ...productCompra };
        
        const etiquetaProducto = document.getElementById(elementoP.querySelector('h6').id);
        etiquetaProducto.innerHTML=this.cantidadAgregada(productCompra.id);
        

        this.#showCompra();

    }
    cantidadAgregada = idproducto=>{
        
        if(this.#articulosCarrito[idproducto]) return `Tiene (${this.#articulosCarrito[idproducto].cantidad}) en el carro`;
        else return `Tiene (0) en el carro`;
        
    }

    setlocalData = datoslocales => {
        
        this.#articulosCarrito = datoslocales;
        this.#showCompra();
    }

    #showCompra = () => {
        compraConteiner.innerHTML = '';

        Object.values(this.#articulosCarrito).forEach(producto => {
            compraTemplate.querySelector('th').textContent = producto.id
            compraTemplate.querySelectorAll('td')[0].textContent = producto.nombre
            compraTemplate.querySelectorAll('td')[1].textContent = producto.cantidad
            compraTemplate.querySelector('span').textContent = producto.precio * producto.cantidad

            //botones
            compraTemplate.querySelector('.btnAdd').dataset.id = producto.id
            compraTemplate.querySelector('.btnRemove').dataset.id = producto.id

            const copiaTemplate = compraTemplate.cloneNode(true);
            fragmentTemplete.appendChild(copiaTemplate);
        })
        compraConteiner.appendChild(fragmentTemplete);

        this.#showTotal();

        localStorage.setItem('compra', JSON.stringify(this.#articulosCarrito));
    }

    #showTotal = () => {
        totalConteiner.innerHTML = '';

        if (Object.keys(this.#articulosCarrito).length === 0) {
            totalConteiner.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío</th>
            `
            return
        }
        const tag = 350;
        const envio = 1500;
        // sumar cantidad y sumar totales
        const nCantidad = Object.values(this.#articulosCarrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
        const nPrecio = Object.values(this.#articulosCarrito).reduce((acc, { cantidad, precio }) => acc + (cantidad * tag) + (cantidad * precio), 0)

        totalTemplate.querySelectorAll('td')[0].textContent = nCantidad;
        totalTemplate.querySelectorAll('span')[0].textContent = nPrecio;
        totalTemplate.querySelectorAll('span')[1].textContent = envio;
        totalTemplate.querySelectorAll('span')[2].textContent = nPrecio + envio;

        const copiaTemplate = totalTemplate.cloneNode(true)
        fragmentTemplete.appendChild(copiaTemplate)

        totalConteiner.appendChild(fragmentTemplete)

        const boton = document.querySelector('#vaciar-carrito')
        boton.addEventListener('click', () => {
            this.#articulosCarrito = {}
            this.#showCompra();
        })

    }
    btnDetalle = e => {
        // console.log(e.target.classList.contains('btn-info'))
        if (e.target.classList.contains('btnAdd')) {
            const producto = this.#articulosCarrito[e.target.dataset.id];
            
            const stockCnt = productos.filtrocantidad(stockbd, ['id', 'title', 'cantidad'], item => item.id == producto.id);

            if (producto.cantidad + 1 <= stockCnt[0].cantidad) {
                producto.cantidad++;
            }
            this.#articulosCarrito[e.target.dataset.id] = { ...producto };
            console.log
            const etiquetaProducto = document.getElementById('h'+e.target.dataset.id);
            etiquetaProducto.innerHTML=this.cantidadAgregada(e.target.dataset.id);
        }

        if (e.target.classList.contains('btnRemove')) {
            const producto = this.#articulosCarrito[e.target.dataset.id];
            producto.cantidad--;
            if (producto.cantidad === 0) {
                delete this.#articulosCarrito[e.target.dataset.id];
            } else {
                this.#articulosCarrito[e.target.dataset.id] = { ...producto };
            }
            const etiquetaProducto = document.getElementById('h'+e.target.dataset.id);
            etiquetaProducto.innerHTML=this.cantidadAgregada(e.target.dataset.id);
            
        }
        this.#showCompra();
        e.stopPropagation();
    }

    actualizarStock = () => {
        Object.values(stockbd).forEach(producto => {
            const v = this.#articulosCarrito[producto.id];
            if (v) {
                producto.cantidad = producto.cantidad - this.#articulosCarrito[producto.id].cantidad;
            }
        });
        localStorage.setItem('stock', JSON.stringify(stockbd));
        this.#articulosCarrito = {}
        this.#showCompra();
    }
}

const btnLogIn = document.getElementById('btnLogIn');
const btnLogOut = document.getElementById('btnLogOut');
const btnPagar = document.getElementById('btnPagar');
const btnReset = document.getElementById('btnRestablecerS');

const msgAlert = document.getElementById('messegge');
const msgCompra = document.getElementById('lblmensajeCompra');

const txtUser = document.getElementById('txt_user');
const txtPassword = document.getElementById('txt_password');


const productConteiner = document.getElementById('div_contentProducts');
const compraConteiner = document.getElementById('div_detalleCompra');
const totalConteiner = document.getElementById('div_totalCompra');
const userActivo = document.getElementById('div_activo');
const userInactivo = document.getElementById('div_inactivo');
const dTemporal = document.getElementById('divTemporal');
const dSite = document.getElementById('divSite');

const puCarro= document.getElementById('uCarro');
const puser = document.getElementById('p_activeUser');
const productTemplate = document.getElementById('pTemplate').content;
const compraTemplate = document.getElementById('cTemplate').content;
const totalTemplate = document.getElementById('tTemplate').content;
const fragmentTemplete = document.createDocumentFragment();

const login = new Login();
const productos = new Productos();
const carrito = new Carrito();

let stockbd = [];

btnLogIn.addEventListener('click', () => {
    login.validarUsuario(txtUser.value, txtPassword.value)
});

btnLogOut.addEventListener('click', () => {

    login.cerrarSesion();
});


const mostrarProductos = (bdProducts) => {
    bdProducts.forEach(articulo => {

        if (articulo.cantidad > 0) {
            productTemplate.querySelector('img').setAttribute('src', articulo.image);
            productTemplate.querySelector('h5').textContent = articulo.title;
            productTemplate.querySelectorAll('p')[0].textContent = articulo.valor;
            productTemplate.querySelectorAll('p')[1].textContent = `${articulo.cantidad} Unidades disponibles`;
            productTemplate.querySelector('.productBtn').dataset.id = articulo.id;
            productTemplate.querySelector('h6').id = `h${articulo.id}`;
            
            productTemplate.querySelector('h6').textContent = carrito.cantidadAgregada(articulo.id);
            const copiaTemplate = productTemplate.cloneNode(true);
            fragmentTemplete.appendChild(copiaTemplate);
        }
    });
    productConteiner.appendChild(fragmentTemplete);
}

btnPagar.addEventListener('click', () => {

    const validarItems = Object.keys(JSON.parse(localStorage.getItem('compra'))).length;
    if (validarItems > 0) {
        
        dTemporal.classList = 'siteContent activo';
        dSite.classList = 'siteContent inactivo';
        productConteiner.innerHTML = '';
        
        setTimeout(function () {
            
            carrito.actualizarStock();
            mostrarProductos(stockbd);
            dTemporal.classList = 'siteContent inactivo';
            dSite.classList = 'siteContent activo';

            msgCompra.textContent = 'Compra Exitosa';
            
            setTimeout(function () {
                msgCompra.textContent = '';
            }, 2000);
        }, 3000);

    }
    else {
        msgCompra.textContent = 'No hay productos agregados para comprar';
        setTimeout(function () {
            msgCompra.textContent = '';
        }, 2000);
    }
});

btnReset.addEventListener('click', () => {

    localStorage.removeItem('stock');
    productConteiner.innerHTML = '';
    stockbd = productos.getProductos();
    mostrarProductos(stockbd);

});

compraConteiner.addEventListener('click', e => { carrito.btnDetalle(e) });
productConteiner.addEventListener('click', e => {

    if (e.target.classList.contains('productBtn')) {
        carrito.addProduct(e.target.parentElement);
    }
    e.stopPropagation();
});

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('compra')) {
        carrito.setlocalData(JSON.parse(localStorage.getItem('compra')));
    }

    if (sessionStorage.getItem('usuarioActivo')) {
        login.validarestado();
    }
    if (localStorage.getItem('stock')) {
        stockbd = JSON.parse(localStorage.getItem('stock'));
        mostrarProductos(stockbd);
    }
    else {
        stockbd = productos.getProductos();
        mostrarProductos(stockbd);
    }
});