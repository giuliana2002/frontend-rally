document.getElementById('registroForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    nombre: form.nombre.value,
    email: form.email.value,
    password: form.password.value
  };

  const res = await fetch('http://157.230.56.12:3000/api/usuarios/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (res.ok) {
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    window.location.href = 'login.html';
  } else {
    alert(result.mensaje || 'Error al registrarse');
  }
});
