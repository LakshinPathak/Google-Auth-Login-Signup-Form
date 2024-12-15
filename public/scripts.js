//public/scripts.js
// Handle Registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  try {
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || 'Registration successful');
      // Redirect to login page or dashboard
      window.location.href = `/dashboard.html?username=${username}`;
    } else {
      alert(data.error || 'Registration failed');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An unexpected error occurred.');
  }
});

// Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      alert('Login successful');
      // Optionally store the token
      localStorage.setItem('token', data.token);

      // Redirect to dashboard
      window.location.href = `/dashboard.html?username=${username}`;
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An unexpected error occurred.');
  }
});
