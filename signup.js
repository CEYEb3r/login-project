const signupForm = document.getElementById('signupForm');
const messageDiv = document.getElementById('signupMessage');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;

  try {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    messageDiv.textContent = data.message;

    if (response.ok) {
      messageDiv.className='success';
      signupForm.reset();
    } else {
      messageDiv.className= 'error';
    }
  } catch (err) {
    messageDiv.textContent = 'Error signing up.';
    messageDiv.className= 'fail';
  }
});
