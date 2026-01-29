'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Exemple de composant utilisant l'authentification
 * Copier et adapter ce code selon vos besoins
 */
export default function ExampleAuthComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    getAccessToken 
  } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Effet au chargement
  useEffect(() => {
    if (isLoading) return;
    
    if (isAuthenticated && user) {
      console.log('Utilisateur connecté:', user);
    }
  }, [isAuthenticated, isLoading, user]);

  // Exemple 1: Connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // Redirection automatique après connexion
      router.push('/');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  // Exemple 2: Déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    }
  };

  // Exemple 3: Appel API avec le token d'accès
  const fetchUserProfile = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        setError('Pas de token disponible');
        return;
      }

      const response = await fetch('https://api-mytone.onrender.com/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Impossible de récupérer le profil');
      }

      const profile = await response.json();
      console.log('Profil utilisateur:', profile);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <h2>Bienvenue, {user?.name || user?.username}!</h2>
        <p>Email: {user?.email}</p>
        <p>Username: {user?.username}</p>
        
        <button onClick={fetchUserProfile}>
          Récupérer mon profil
        </button>
        
        <button onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    );
  }

  // Formulaire de connexion
  return (
    <div>
      <h2>Se connecter</h2>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div>
          <label>Email ou Username</label>
          <input
            type="text"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

/**
 * AUTRES EXEMPLES D'UTILISATION
 */

// Exemple: Composant protégé (nécessite authentification)
export function ProtectedComponent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  return <div>Contenu protégé</div>;
}

// Exemple: Barre de navigation
export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Hello {user?.name}</span>
          <button onClick={logout}>Déconnexion</button>
        </>
      ) : (
        <>
          <a href="/login/user">Connexion</a>
          <a href="/signup">Inscription</a>
        </>
      )}
    </nav>
  );
}

// Exemple: Appel API authentifié personnalisé
export async function fetchWithAuth(url, options = {}, accessToken) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    }
  });
}
