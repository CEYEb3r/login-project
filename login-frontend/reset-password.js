console.log('password.js loaded');
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username= document.getElementById('username').value;
    const newPassword=document.getElementById('newPassword').value;
    const messageDiv= document.getElementById('resetMessage');

    try{
        const res = await fetch('http://localhost:3000/reset-password',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, newPassword})
        });

        const data= await res.json();
        messageDiv.textContent= data.message;

        if (res.ok){
            messageDiv.className= 'success';
        } else {
            messageDiv.className= 'fail';
        } 
    } catch(err){
        console.error('Error:', err);
        messageDiv.textContent= 'Something went wrong';
        messageDiv.className= 'fail';
    }

})