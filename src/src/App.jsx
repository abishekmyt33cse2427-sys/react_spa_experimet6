import React, { createContext, useContext, useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  NavLink, 
  Navigate, 
  useNavigate 
} from 'react-router-dom';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (username) => setUser({ name: username });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function Home() {
  return (
    <div style={pageStyle}>
      <h1>🏠 Public Home Page</h1>
      <p>Anyone can view this page without logging in.</p>
    </div>
  );
}

function Login() {
  const [usernameInput, setUsernameInput] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      login(usernameInput);
      navigate('/dashboard');
    }
  };

  return (
    <div style={pageStyle}>
      <h1>🔒 Login Page</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input 
          type="text" 
          placeholder="Enter your name..." 
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          style={{ padding: '0.5rem' }}
          required
        />
        <button type="submit" style={buttonStyle}>Log In</button>
      </form>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  return (
    <div style={pageStyle}>
      <h1>📊 Private Dashboard</h1>
      <p>Welcome, <strong>{user.name}</strong>! You are logged in.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={pageStyle}>
      <h1>⚠️ 404 - Page Not Found</h1>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={layoutStyle}>
          <NavBar />
          <main style={mainContentStyle}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={navStyle}>
      <h2>My Auth SPA</h2>
      <div style={linkGroupStyle}>
        <NavLink to="/" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>Home</NavLink>
        <NavLink to="/dashboard" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>Dashboard</NavLink>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#4caf50' }}>👤 {user.name}</span>
            <button onClick={() => { logout(); navigate('/login'); }} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>Logout</button>
          </div>
        ) : (
          <NavLink to="/login" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>Login</NavLink>
        )}
      </div>
    </nav>
  );
}

const layoutStyle = { fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f4f4f9' };
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#333', color: '#fff' };
const linkGroupStyle = { display: 'flex', gap: '15px', alignItems: 'center' };
const linkStyle = { color: '#ccc', textDecoration: 'none' };
const activeLinkStyle = { color: '#fff', textDecoration: 'underline', fontWeight: 'bold' };
const mainContentStyle = { padding: '2rem' };
const pageStyle = { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const buttonStyle = { padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' };
