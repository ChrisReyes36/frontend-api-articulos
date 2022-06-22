const btn_limpiar = document.getElementById("btn_limpiar");
const btn_enviar = document.getElementById("btn_enviar");
const form_articulos = document.getElementById("form_articulos");
const tbody_articulos = document.getElementById("tbody_articulos");
const url = "http://127.0.0.1:8000/api/articulos/";

const obtenerArticulos = async () => {
    const respuesta = await fetch(url);

    const articulos = await respuesta.json();

    let html = "";

    articulos.forEach((articulo) => {
        html += `
            <tr>
                <td>$${articulo.precio}</td>
                <td>${articulo.stock}</td>
                <td>${articulo.descripcion}</td>
                <td class="text-center">
                    <button class="btn btn-outline-primary btn-sm" onclick="obtenerArticulo(${articulo.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="confirmarEliminado(${articulo.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tbody_articulos.innerHTML = html;
};

const obtenerArticulo = async (id) => {
    const respuesta = await fetch(`${url}${id}/`);

    const articulo = await respuesta.json();

    form_articulos.articulo_id.value = articulo.id;
    form_articulos.articulo_precio.value = articulo.precio;
    form_articulos.articulo_stock.value = articulo.stock;
    form_articulos.articulo_descripcion.value = articulo.descripcion;
};

const confirmarEliminado = (id) => {
    Swal.fire({
        title: "¿Seguro/a desea eliminar el artículo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarArticulo(id);
        }
    });
};

const eliminarArticulo = async (id) => {
    const respuesta = await fetch(`${url}${id}/`, {
        method: "DELETE",
    });

    const articulo = await respuesta.json();

    if (articulo.status === "success") {
        alerta(articulo.title, articulo.message, "success");
        obtenerArticulos();
    } else {
        alerta(articulo.title, articulo.message, "error");
    }
};

const guardarArticulo = async () => {
    const respuesta = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            descripcion: form_articulos.articulo_descripcion.value,
            precio: form_articulos.articulo_precio.value,
            stock: form_articulos.articulo_stock.value,
        }),
    });

    const articulo = await respuesta.json();

    if (articulo.status === "success") {
        alerta(articulo.title, articulo.message, "success");
        obtenerArticulos();
        limpiarFomulario();
    } else {
        alerta(articulo.title, articulo.message, "error");
    }
};

const guardarArticuloEditado = async () => {
    const respuesta = await fetch(
        `${url}${form_articulos.articulo_id.value}/`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                descripcion: form_articulos.articulo_descripcion.value,
                precio: form_articulos.articulo_precio.value,
                stock: form_articulos.articulo_stock.value,
            }),
        }
    );

    const articulo = await respuesta.json();

    if (articulo.status === "success") {
        alerta(articulo.title, articulo.message, "success");
        obtenerArticulos();
        limpiarFomulario();
    } else {
        alerta(articulo.title, articulo.message, "error");
    }
};

const alerta = (titel, text, icon) => {
    Swal.fire({
        title: `${titel}`,
        text: `${text}`,
        icon: `${icon}`,
        showConfirmButton: false,
        timer: 2500,
        allowOutsideClick: false,
    });
};

const limpiarFomulario = () => {
    form_articulos.reset();
    form_articulos.articulo_id.value = "";
};

document.addEventListener("DOMContentLoaded", obtenerArticulos);

btn_enviar.addEventListener("click", (e) => {
    e.preventDefault();
    if (form_articulos.articulo_id.value === "") {
        guardarArticulo();
    } else {
        guardarArticuloEditado();
    }
});

btn_limpiar.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarFomulario();
});
