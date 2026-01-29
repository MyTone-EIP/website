/**
 * Exemple: Dashboard protégé
 * Copier ce fichier dans: app/dashboard/page.js
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout, getAccessToken } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;

    // Rediriger si pas authentifié
    if (!isAuthenticated) {
      router.push('/login/user');
      return;
    }

    // Charger le profil complet de l'utilisateur
    const loadUserProfile = async () => {
      try {
        setProfileLoading(true);
        const token = getAccessToken();
        
        const response = await fetch('https://api-mytone.onrender.com/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Impossible de charger le profil');
        }

        const profile = await response.json();
        setUserProfile(profile);
      } catch (err) {
        setError(err.message);
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserProfile();
  }, [isAuthenticated, isLoading, router, getAccessToken]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      setError('Erreur lors de la déconnexion');
    }
  };

  if (isLoading || profileLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // La redirection se fera automatiquement
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255,107,107,0.2)'
        }}>
          <div>
            <h1>Tableau de bord</h1>
            <p style={{ color: '#888', margin: '5px 0 0 0' }}>
              Bienvenue, {user?.name || user?.username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Déconnexion
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,107,107,0.1)',
            color: '#FF6B6B',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid rgba(255,107,107,0.3)'
          }}>
            {error}
          </div>
        )}

        {/* Profil Card */}
        <div style={{
          background: 'rgba(30,30,30,0.8)',
          border: '1px solid rgba(255,107,107,0.2)',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginTop: 0 }}>Informations du profil</h2>
          
          {userProfile ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ color: '#888', marginBottom: '5px', fontSize: '12px', textTransform: 'uppercase' }}>
                  Prénom
                </p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                  {userProfile.name || 'Non défini'}
                </p>
              </div>

              <div>
                <p style={{ color: '#888', marginBottom: '5px', fontSize: '12px', textTransform: 'uppercase' }}>
                  Nom
                </p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                  {userProfile.surname || 'Non défini'}
                </p>
              </div>

              <div>
                <p style={{ color: '#888', marginBottom: '5px', fontSize: '12px', textTransform: 'uppercase' }}>
                  Email
                </p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                  {userProfile.email || 'Non défini'}
                </p>
              </div>

              <div>
                <p style={{ color: '#888', marginBottom: '5px', fontSize: '12px', textTransform: 'uppercase' }}>
                  Username
                </p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                  {userProfile.username || 'Non défini'}
                </p>
              </div>

              {userProfile.phone_number && (
                <div>
                  <p style={{ color: '#888', marginBottom: '5px', fontSize: '12px', textTransform: 'uppercase' }}>
                    Téléphone
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                    {userProfile.phone_number}
                  </p>
                </div>
              )}

              {userProfile.created_at && (
                <div>
                  <p style={{ color: '#888', marginBottom: '5px', fontSize: '12px', textTransform: 'uppercase' }}>
                    Inscrit depuis
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                    {new Date(userProfile.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: '#888' }}>Impossible de charger le profil</p>
          )}
        </div>

        {/* Session Info */}
        <div style={{
          background: 'rgba(30,30,30,0.8)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ marginTop: 0 }}>Informations de session</h3>
          <ul style={{ color: '#888', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
            <li>Session NextAuth active</li>
            <li>Access Token: Présent</li>
            <li>Refresh Token: Présent</li>
            <li>
              Connecté depuis le: {new Date(user?.email || new Date()).toLocaleTimeString('fr-FR')}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
