const form = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.textContent = data.message;
      messageDiv.className= 'success';
    } else {
      messageDiv.textContent = data.message;
      messageDiv.className= 'error';
    }
  } catch (err) {
    console.error('Error:', err);
    messageDiv.textContent = 'Something went wrong.';
    messageDiv.className= 'fail';
  }
});
