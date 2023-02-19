const passwordInput = document.getElementById('password');
const showPasswordBtn = document.getElementById('passwordBtn');

console.log(showPasswordBtn);
showPasswordBtn.addEventListener('click', function() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    showPasswordBtn.textContent = 'Hide';
  } else {
    passwordInput.type = 'password';
    showPasswordBtn.textContent = 'Show';
  }
});

for (i = 0; i < 10; i++){
  console.log(i)
}
console.log('heml')