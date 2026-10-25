
const API_URL = 'http://localhost:3000';
const isAuthPage = document.getElementById('auth-section') !== null;

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const formTitle = document.getElementById('form-title');
const toggleAuth = document.getElementById('toggle-auth');
const toggleMessage = document.getElementById('toggle-message');

const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

const authSection = document.getElementById('auth-section');
const profileSection = document.getElementById('profile-section');
const profileMessage = document.getElementById('profile-message');

const authLink = document.getElementById('auth-link');
const userStatus = document.getElementById('user-status');
const logoutButton = document.getElementById('logout-button');

const loginButton = document.getElementById('login-submit');
const signupButton = document.getElementById('signup-submit');

let showingLogin = true;


function validateCredentials(email, password) {
  if (!email || !password) {
    return 'Email and password are required.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  return '';
}


function setButtonLoading(button, isLoading, normalText, loadingText) {
  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : normalText;
}


if (isAuthPage) {

  toggleAuth.addEventListener('click', () => {
    showingLogin = !showingLogin;

    loginForm.hidden = !showingLogin;
    signupForm.hidden = showingLogin;

    formTitle.textContent = showingLogin
      ? 'Login to ShopLite'
      : 'Create your ShopLite account';

    toggleMessage.textContent = showingLogin
      ? "Don't have an account?"
      : 'Already have an account?';

    toggleAuth.textContent = showingLogin ? 'Sign up' : 'Login';

    loginError.textContent = '';
    signupError.textContent = '';
  });


  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (signupButton.disabled) return;

    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    const validationError = validateCredentials(email, password);

    if (validationError) {
      signupError.textContent = validationError;
      return;
    }

    signupError.textContent = '';
    setButtonLoading(
      signupButton,
      true,
      'Create account',
      'Creating account...'
    );

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('An account with this email already exists.');
        }

        if (response.status === 400) {
          throw new Error(
            data.error || data.message || 'Please check your signup details.'
          );
        }

        throw new Error(
          data.error || data.message || 'Could not create your account.'
        );
      }

      loginError.textContent =
      'Account created successfully! Please log in.';
      signupError.textContent = '';

      signupForm.reset();

      showingLogin = true;
      loginForm.hidden = false;
      signupForm.hidden = true;

      formTitle.textContent = 'Login to ShopLite';
      toggleMessage.textContent = "Don't have an account?";
      toggleAuth.textContent = 'Sign up';
    } catch (error) {
      signupError.textContent =
        error.message === 'Failed to fetch'
          ? 'Could not connect to ShopLite. Check that the backend is running.'
          : error.message;
    } finally {
      setButtonLoading(
        signupButton,
        false,
        'Create account',
        'Creating account...'
      );
    }
  });


  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (loginButton.disabled) return;

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const validationError = validateCredentials(email, password);

    if (validationError) {
      loginError.textContent = validationError;
      return;
    }

    loginError.textContent = '';
    setButtonLoading(loginButton, true, 'Login', 'Logging in...');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(
            data.error || data.message || 'Please check your login details.'
          );
        }

        if (response.status === 401) {
          throw new Error('Invalid email or password.');
        }

        throw new Error(data.error || data.message || 'Login failed.');
      }

      setToken(data.token);
      loginError.textContent = '';

      await updateAuthUI();
    } catch (error) {
      loginError.textContent =
        error.message === 'Failed to fetch'
          ? 'Could not connect to ShopLite. Check that the backend is running.'
          : error.message;
    } finally {
      setButtonLoading(loginButton, false, 'Login', 'Logging in...');
    }
  });
}


async function updateAuthUI() {
  if (!isLoggedIn()) {
    authLink.hidden = false;
    userStatus.textContent = '';
    logoutButton.hidden = true;

    if (isAuthPage) {
      authSection.hidden = false;
      profileSection.hidden = true;
    }

    return;
  }

  authLink.hidden = true;
  logoutButton.hidden = false;
  userStatus.textContent = 'Loading account...';

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (response.status === 401) {
      clearToken();
      authLink.hidden = false;
      userStatus.textContent = '';
      logoutButton.hidden = true;

      if (isAuthPage) {
        authSection.hidden = false;
        profileSection.hidden = true;
        loginError.textContent =
          'Your session has expired. Please log in again.';
      }

      return;
    }

    if (!response.ok) {
      throw new Error('Could not load your account. Please try again.');
    }

    const data = await response.json();

    userStatus.textContent = data.user.email;

    if (isAuthPage) {
      profileMessage.textContent = `Logged in as ${data.user.email}`;
      authSection.hidden = true;
      profileSection.hidden = false;
    }
  } catch (error) {

    userStatus.textContent = 'Unable to load account';
    console.error('Could not load account:', error);

    if (isAuthPage) {
      loginError.textContent = error.message;
    }
  }
}


logoutButton.addEventListener('click', () => {
  clearToken();

  if (isAuthPage) {
    loginForm.reset();
    signupForm.reset();
    loginError.textContent = '';
    signupError.textContent = '';
  }

  authLink.hidden = false;
  userStatus.textContent = '';
  logoutButton.hidden = true;

  if (isAuthPage) {
    authSection.hidden = false;
    profileSection.hidden = true;
  }
});


updateAuthUI();
