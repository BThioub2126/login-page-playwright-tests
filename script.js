const VALID_USER = { email: 'testuser@example.com', password: 'Password123' };
const MAX_ATTEMPTS = 3;
let failedAttempts = 0;

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const formError = document.getElementById('form-error');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const spinner = submitBtn.querySelector('.spinner');
const toggleBtn = document.getElementById('toggle-password');

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clearErrors() {
  emailError.textContent = '';
  passwordError.textContent = '';
  formError.hidden = true;
  formError.textContent = '';
  emailInput.classList.remove('invalid');
  passwordInput.classList.remove('invalid');
}

function showFormError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  spinner.hidden = !isLoading;
  btnText.textContent = isLoading ? 'Logging in...' : 'Log In';
}

toggleBtn.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  toggleBtn.textContent = isPassword ? '🙈' : '👁';
  toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  let hasError = false;

  if (!email) {
    emailError.textContent = 'Email is required';
    emailInput.classList.add('invalid');
    hasError = true;
  } else if (!isValidEmail(email)) {
    emailError.textContent = 'Enter a valid email address';
    emailInput.classList.add('invalid');
    hasError = true;
  }

  if (!password) {
    passwordError.textContent = 'Password is required';
    passwordInput.classList.add('invalid');
    hasError = true;
  } else if (password.length < 8) {
    passwordError.textContent = 'Password must be at least 8 characters';
    passwordInput.classList.add('invalid');
    hasError = true;
  }

  if (hasError) return;

  if (failedAttempts >= MAX_ATTEMPTS) {
    showFormError('Account temporarily locked due to too many failed attempts.');
    submitBtn.disabled = true;
    return;
  }

  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    if (email === VALID_USER.email && password === VALID_USER.password) {
      failedAttempts = 0;
      window.location.href = 'dashboard.html';
    } else {
      failedAttempts += 1;
      const remaining = MAX_ATTEMPTS - failedAttempts;
      if (remaining > 0) {
        showFormError(`Invalid email or password. ${remaining} attempt(s) remaining.`);
      } else {
        showFormError('Account temporarily locked due to too many failed attempts.');
        submitBtn.disabled = true;
      }
    }
  }, 400);
});