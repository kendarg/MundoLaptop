# 💻 MundoLaptop

## 📌 Descripción

**MundoLaptop** es un proyecto de **E-Commerce especializado en la venta de laptops**, diseñado para ofrecer una experiencia de compra moderna y organizada.

La plataforma contempla productos **nuevos, Open Box y usados**, además de diferentes marcas y categorías de equipos.

El proyecto también incluye una **vista administrativa** para gestionar el inventario y agregar o eliminar productos.

---

## 🌐 Links
* Figma: https://www.figma.com/design/9UQ5eKr07aOSYVTVl3Wl9n/Proyecto-integrador?node-id=405-788&t=qXGdXBHURDHmMCYT-1
* Trelo: https://trello.com/invite/b/6a60fc6f01dc7d7a67f2a0be/ATTIdee270f3dd1a1093dbb5e7c3ec82697cF6991244/mundolaptop
* Admin: https://kendarg.github.io/MundoLaptop/

## 🎯 Objetivo del proyecto

El objetivo principal de MundoLaptop es desarrollar una tienda virtual funcional utilizando tecnologías web, aplicando conocimientos de:

* HTML5
* CSS3
* JavaScript
* Bootstrap
* Manipulación del DOM
* Eventos
* Arrays y objetos
* Formularios
* Componentes reutilizables
* Diseño responsive
* Git y GitHub

---

## 🛒 Funcionalidades

### 👤 Vista de usuario

La plataforma cuenta con diferentes secciones destinadas al usuario:

* 🏠 Página principal
* 💻 Visualización de productos
* 👤 Inicio de sesión
* 📝 Registro de usuarios
* 📞 Página de contacto
* 👥 Página "Nosotros"
* 🛒 Carrito de compras
* 🌙 Modo oscuro
* 📱 Diseño adaptable

---

### 🔐 Panel administrativo

El proyecto cuenta con una interfaz destinada a la administración de la tienda.

Desde el panel se pueden realizar acciones como:

* ➕ Agregar productos
* 🗑️ Eliminar productos
* 🏷️ Seleccionar categorías
* 🏢 Seleccionar marcas
* 💰 Establecer precios
* 📦 Administrar stock
* 🔎 Visualizar referencias
* 📊 Consultar el estado del inventario

---

## 📦 Gestión de productos

Los productos se almacenan temporalmente dentro de un array de JavaScript:

```javascript
const inventario = [];
```

Cada producto se representa mediante un objeto:

```javascript
const producto = {
    id: Date.now(),
    nombre,
    serie,
    categoria,
    marca,
    precio: Number(precio),
    stock: Number(stock),
    referencia
};
```

Esto permite manejar cada producto como una estructura de datos independiente.

---

## 📊 Estado del inventario

El sistema determina automáticamente el estado de cada producto dependiendo de su cantidad disponible.

|     Stock | Estado        |
| --------: | ------------- |
|       `0` | 🔴 Sin Stock  |
|   `1 - 5` | 🟡 Poco Stock |
| `6 o más` | 🟢 Buen Stock |

Ejemplo:

```javascript
if(producto.stock == 0){
    estado = "Sin Stock";
}else if(producto.stock <= 5){
    estado = "Poco Stock";
}else{
    estado = "Buen Stock";
}
```

Esto permite identificar rápidamente qué productos necesitan reposición.

---

## ➕ Agregar productos

El administrador puede abrir un formulario para registrar un nuevo producto.

El formulario solicita:

* Nombre del producto
* Número de serie
* Categoría
* Marca
* Precio
* Stock
* Referencia

Antes de guardar el producto, JavaScript verifica que los campos obligatorios estén completos.

```javascript
if(
    nombre === "" ||
    serie === "" ||
    precio === "" ||
    stock === "" ||
    categoria === "Seleccionar..." ||
    marca === "Seleccionar..."
){
    alert("Complete todos los campos");
    return;
}
```

---

## 🗑️ Eliminar productos

Cada producto cuenta con una acción para eliminarlo.

El sistema obtiene el `id` del producto seleccionado:

```javascript
const id = Number(e.target.dataset.id);
```

Después busca el producto dentro del inventario y lo elimina:

```javascript
const indice = inventario.findIndex(
    producto => producto.id === id
);

inventario.splice(indice, 1);
```

Finalmente se vuelve a renderizar la tabla.

---

## 🧩 Componentes reutilizables

El proyecto utiliza archivos HTML independientes para elementos que se repiten en diferentes páginas:

```text
html/
├── navbar.html
└── footer.html
```

Estos componentes son cargados mediante JavaScript utilizando `fetch()`.

La función principal es:

```javascript
async function loadComponents()
```

Esto permite evitar repetir el mismo código HTML en todas las páginas.

---

## 🔗 Navegación dinámica

El sistema también identifica la página actual mediante:

```javascript
data-page
```

y marca automáticamente el enlace correspondiente del menú como activo.

Esto mejora la navegación y la experiencia del usuario.

---

## 🌙 Modo oscuro

El proyecto incluye soporte para modo oscuro.

La preferencia del usuario se almacena utilizando:

```javascript
localStorage.setItem("modo", oscuro);
```

De esta forma, el navegador puede recordar la configuración seleccionada.

También se cambia el icono entre:

```text
🌙 Modo oscuro
☀️ Modo claro
```

---

## 🔑 Sistema de inicio de sesión

El proyecto cuenta con una interfaz de inicio de sesión mediante un panel modal.

El usuario puede:

* Abrir el panel de login.
* Cerrar el panel.
* Cerrar haciendo clic fuera de la ventana.
* Cerrar utilizando la tecla `Escape`.
* Acceder al formulario de creación de cuenta.

La interacción se controla mediante JavaScript y clases CSS.

---

## 📁 Estructura del proyecto

```text
MundoLaptop/
│
├── assets/
│   └── inicio/
│       ├── carrito.svg
│       ├── crown.svg
│       ├── delivery_truck_speed.svg
│       ├── headset_mic.svg
│       ├── history.svg
│       └── pagina-contacto/
│
├── css/
│   ├── admin.css
│   ├── contacto.css
│   ├── dark.css
│   ├── footer.css
│   ├── index-styles.css
│   ├── login.css
│   ├── navbar.css
│   └── Nosotros.css
│
├── html/
│   ├── contacto.html
│   ├── footer.html
│   ├── login.html
│   ├── navbar.html
│   └── Nosotros.html
│
├── img/
│   ├── productos
│   ├── nosotros/
│   └── svg/
│
├── Js/
│   ├── admin.js
│   ├── cambiDeVsion.js
│   ├── loginuser.js
│   ├── navbar.js
│   └── reutilizacion.js
│
├── index.html
└── README.md
```

---

## 🛠️ Tecnologías utilizadas

### HTML5

Utilizado para crear la estructura y contenido de las páginas.

### CSS3

Utilizado para:

* Diseño visual.
* Responsive Design.
* Modales.
* Menús.
* Panel administrativo.
* Modo oscuro.

### JavaScript

Utilizado para:

* Manipulación del DOM.
* Eventos.
* Formularios.
* Gestión de productos.
* Inventario.
* Login.
* Modales.
* Componentes reutilizables.
* `localStorage`.

### Bootstrap

Se utiliza **Bootstrap 5** para facilitar la creación de:

* Tablas.
* Botones.
* Formularios.
* Navbar.
* Layout.
* Elementos responsive.

También se utilizan **Bootstrap Icons**.

---

## 🚀 Instalación y ejecución

### 1. Clonar el proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
```

### 2. Entrar al proyecto

```bash
cd MundoLaptop
```

### 3. Ejecutar con Live Server

Se recomienda utilizar la extensión **Live Server** de Visual Studio Code.

También puedes ejecutar un servidor local con Python:

```bash
python -m http.server 5500
```

Después abre:

```text
http://localhost:5500
```

> ⚠️ El proyecto utiliza `fetch()` para cargar componentes HTML reutilizables, por lo que no se recomienda abrir directamente los archivos mediante `file://`.

---

## 🌿 Ramas del proyecto

El repositorio fue organizado utilizando diferentes ramas para facilitar el trabajo colaborativo:

```text
main
├── admin
├── kendarg
├── ramarhonald
├── sergio-rama
└── walter
```

Esto permite que cada integrante pueda trabajar en funcionalidades específicas sin afectar directamente la rama principal.

---

## 👥 Integrantes

* **Kendarg Real**
* **Rhonald Stevend Parra**
* **Sergio Montaño**
* **Walter Montoya**

---

## 🔮 Próximas mejoras

Entre las funcionalidades que podrían agregarse posteriormente:

* 🗄️ Conexión con una base de datos.
* 🔐 Autenticación real de usuarios.
* 🛒 Carrito funcional.
* 💳 Sistema de pagos.
* 📦 Gestión de pedidos.
* 👤 Administración de clientes.
* 🏷️ Gestión completa de categorías.
* ✏️ Edición de productos.
* 🔎 Buscador de productos.
* 🔃 Filtros por marca y categoría.
* 📊 Dashboard con estadísticas.
* 💾 Persistencia del inventario.
* 🔌 API para conectar frontend y backend.

---

## 📚 Aprendizajes

Este proyecto permitió practicar conceptos importantes del desarrollo web:

* Manipulación del DOM.
* Programación con eventos.
* Funciones y callbacks.
* Arrays.
* Objetos.
* Formularios.
* Validaciones.
* Template literals.
* `fetch()`.
* Programación asíncrona.
* `async/await`.
* `localStorage`.
* Componentes reutilizables.
* Diseño responsive.
* Trabajo colaborativo con Git.

---

## 📄 Estado del proyecto

🚧 **En desarrollo**

MundoLaptop se encuentra en proceso de construcción y puede continuar evolucionando hasta convertirse en un E-Commerce completo con backend, base de datos, autenticación y sistema de compras.

---

## 👨‍💻 Autores

**MundoLaptop Team**

Proyecto desarrollado con fines educativos y como práctica de desarrollo web Frontend.
