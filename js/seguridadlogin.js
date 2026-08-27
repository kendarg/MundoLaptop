document.getElementById('btnCrearUsuario').addEventListener('click', function() {
    document.getElementById('vistaLogin').style.display = 'none';
    document.getElementById('vistaRegistro').style.display = 'block';
});

document.getElementById('bntLogin').addEventListener('click', function() {
    document.getElementById('vistaRegistro').style.display = 'none';
    document.getElementById('vistaLogin').style.display = 'block';
});