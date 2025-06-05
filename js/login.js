document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    email: form.email.value,
    password: form.password.value
  };

  const res = await fetch('http://157.230.56.12:3000/api/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (res.ok) {
    localStorage.setItem('token', result.token);
    alert('Sesión iniciada');
    window.location.href = 'index.html';
  } else {
    alert(result.mensaje || 'Error al iniciar sesión');
  }
});
