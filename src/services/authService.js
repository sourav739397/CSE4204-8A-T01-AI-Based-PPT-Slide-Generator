/**
 * Authentication Service
 * Provides client-side user management, secure SHA-256 password hashing with salt,
 * session persistence, profile management, and demo accounts.
 */

const USERS_KEY = 'slidegenius_users_v2';
const SESSION_KEY = 'slidegenius_session_v2';

// Simple salt for client-side hashing
const AUTH_SALT = 'slidegenius_secure_salt_2026_';

/**
 * Hash password with salt using Web Crypto SHA-256
 */
async function hashPassword(password) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(AUTH_SALT + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    // Fallback if crypto.subtle is unavailable
    let hash = 0;
    const str = AUTH_SALT + password;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
  }
}

// Built-in Demo User Credentials (Password: Password123!)
const DEMO_USER = {
  id: 'user_demo_default',
  name: 'Alex Rivera',
  email: 'demo@slidegenius.ai',
  passwordHash: '8b4568e27c7f428448ebf5195bba7ad32128795dbdf495bf4e37ea35678ebfd7', // 'Password123!'
  role: 'Product Lead',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  createdAt: '2026-01-15T09:00:00.000Z',
  bio: 'Designing modern AI workflows and high-impact executive slide decks.',
  geminiApiKey: ''
};

/**
 * Get all registered users from storage
 */
export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const initialUsers = [DEMO_USER];
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    const users = JSON.parse(raw);
    if (!Array.isArray(users) || users.length === 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify([DEMO_USER]));
      return [DEMO_USER];
    }
    // Ensure demo user is present
    if (!users.some(u => u.email === DEMO_USER.email)) {
      users.unshift(DEMO_USER);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
  } catch (e) {
    console.error('Failed to read users from storage:', e);
    return [DEMO_USER];
  }
}

/**
 * Save users list to storage
 */
function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to storage:', e);
  }
}

/**
 * Get currently authenticated session
 */
export function getCurrentSession() {
  try {
    // Check localStorage first, then sessionStorage
    let raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      raw = sessionStorage.getItem(SESSION_KEY);
    }
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Register a new user
 */
export async function registerUser({ name, email, password, role = 'Creator' }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanName = (name || '').trim();

  if (!cleanName) {
    throw new Error('Please enter your full name.');
  }
  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const users = getUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('An account with this email already exists. Please sign in instead.');
  }

  const passwordHash = await hashPassword(password);
  const newUser = {
    id: 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    name: cleanName,
    email: cleanEmail,
    passwordHash,
    role: role.trim() || 'Creator',
    avatar: null, // Will generate initials avatar
    createdAt: new Date().toISOString(),
    bio: 'SlideGenius AI presentation designer',
    geminiApiKey: ''
  };

  users.push(newUser);
  saveUsers(users);

  // Automatically start session
  const session = {
    user: sanitizeUser(newUser),
    token: 'jwt_mock_' + Date.now().toString(36),
    loggedAt: new Date().toISOString()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return session.user;
}

/**
 * Login user
 */
export async function loginUser(email, password, rememberMe = true) {
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error('Please enter your email address.');
  }
  if (!password) {
    throw new Error('Please enter your password.');
  }

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    throw new Error('No account found with this email. Please check your spelling or sign up.');
  }

  const inputHash = await hashPassword(password);

  // Check demo user exception or direct hash match
  const isMatch = (user.passwordHash === inputHash) ||
    (user.email === DEMO_USER.email && password === 'Password123!');

  if (!isMatch) {
    throw new Error('Incorrect password. Please try again or use the demo login.');
  }

  const session = {
    user: sanitizeUser(user),
    token: 'jwt_mock_' + Date.now().toString(36),
    loggedAt: new Date().toISOString()
  };

  if (rememberMe) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    sessionStorage.removeItem(SESSION_KEY);
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.removeItem(SESSION_KEY);
  }

  return session.user;
}

/**
 * Demo login helper
 */
export async function loginAsDemo() {
  const users = getUsers();
  let demo = users.find(u => u.email === DEMO_USER.email);
  if (!demo) {
    demo = DEMO_USER;
    users.unshift(demo);
    saveUsers(users);
  }

  const session = {
    user: sanitizeUser(demo),
    token: 'jwt_mock_demo_' + Date.now().toString(36),
    loggedAt: new Date().toISOString()
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session.user;
}

/**
 * Logout user
 */
export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Update user profile
 */
export function updateUserProfile(userId, updates) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) {
    throw new Error('User not found');
  }

  const allowedUpdates = ['name', 'role', 'bio', 'avatar', 'geminiApiKey'];
  const updatedUser = { ...users[index] };

  for (const key of allowedUpdates) {
    if (updates[key] !== undefined) {
      updatedUser[key] = updates[key];
    }
  }

  users[index] = updatedUser;
  saveUsers(users);

  // Update active session if it is current user
  const currentSession = getCurrentSession();
  if (currentSession?.user?.id === userId) {
    currentSession.user = sanitizeUser(updatedUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(currentSession));
  }

  return sanitizeUser(updatedUser);
}

/**
 * Change password
 */
export async function changeUserPassword(userId, oldPassword, newPassword) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters.');
  }

  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }

  const oldHash = await hashPassword(oldPassword);
  if (user.passwordHash !== oldHash && !(user.email === DEMO_USER.email && oldPassword === 'Password123!')) {
    throw new Error('Current password does not match.');
  }

  user.passwordHash = await hashPassword(newPassword);
  saveUsers(users);
  return true;
}

/**
 * Reset password (forgot password flow)
 */
export async function resetPassword(email, newPassword) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) throw new Error('Please enter your email.');
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters.');
  }

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    throw new Error('No user registered with this email.');
  }

  user.passwordHash = await hashPassword(newPassword);
  saveUsers(users);
  return true;
}

/**
 * Sanitize user object (exclude sensitive password hash)
 */
function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
