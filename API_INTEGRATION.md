# Intégration API - Guide d'utilisation

## Vue d'ensemble

Votre site Next.js est maintenant entièrement intégré avec l'API FastAPI backend pour :
- ✅ Création de comptes utilisateurs (inscription)
- ✅ Connexion avec tokens JWT
- ✅ Gestion des sessions

## Flux d'authentification

### 1. **Inscription (Signup)**
```javascript
// Route: POST /api/signup
// Le frontend envoie les données à l'API backend
// L'API retourne le nouvel utilisateur avec les tokens JWT
```

**Endpoint backend**: `POST /auth/register`
**Fichier frontend**: `/app/api/signup/route.js`

### 2. **Connexion (Login)**
```javascript
// Utilisation du hook useAuth
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { login, user, isAuthenticated } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login('user@email.com', 'password123');
      // Utilisateur connecté
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };
}
```

**Endpoint backend**: `POST /auth/login`
**Fichier frontend**: `/app/api/auth/[...nextauth]/route.js`

## Fichiers clés créés/modifiés

### 1. `/lib/api.js` - Utilitaire API
Contient les fonctions réutilisables pour communiquer avec l'API backend :
- `signup(userData)` - Créer un compte
- `login(identifier, password)` - Se connecter
- `getCurrentUser(token)` - Récupérer l'utilisateur actuel
- `refreshAccessToken(refreshToken)` - Rafraîchir le token d'accès
- `logout(refreshToken)` - Déconnecter

**Utilisation** :
```javascript
import { login, signup, getCurrentUser } from '@/lib/api';

// Signup
const user = await signup({
  name: 'Jean',
  surname: 'Dupont',
  email: 'jean@example.com',
  username: 'jeandupont',
  password: 'password123'
});

// Login
const tokens = await login('jeandupont', 'password123');
console.log(tokens.access_token);

// Get current user
const user = await getCurrentUser(accessToken);
```

### 2. `/hooks/useAuth.js` - Hook React
Hook personnalisé pour gérer l'authentification dans vos composants :

**Disponible** :
```javascript
import { useAuth } from '@/hooks/useAuth';

const { 
  session,        // Session NextAuth complète
  status,         // 'authenticated' | 'unauthenticated' | 'loading'
  isAuthenticated, // boolean
  isLoading,      // boolean
  user,           // Données utilisateur
  login,          // Fonction login(identifier, password)
  logout,         // Fonction logout()
  getAccessToken, // Récupère le token d'accès JWT
  getRefreshToken // Récupère le token de rafraîchissement
} = useAuth();
```

### 3. `/app/api/auth/[...nextauth]/route.js` - Configuration NextAuth modifiée
- Appelle maintenant l'API backend pour authentifier l'utilisateur
- Stocke les tokens JWT (access_token et refresh_token)
- Récupère les données utilisateur depuis le backend

## Appels API personnalisés

Si vous avez besoin d'appeler directement l'API backend :

```javascript
import { apiCall } from '@/lib/api';

// Exemple: appel à un endpoint personnalisé
const data = await apiCall('/users/profile', {
  method: 'GET',
  token: accessToken  // Optionnel: ajoute l'Authorization header
});
```

## Architecture de sécurité

1. **Frontend** → Envoie identifiants → **NextAuth**
2. **NextAuth** → Valide via → **API Backend**
3. **API Backend** → Génère & retourne → **JWT Tokens**
4. **NextAuth** → Stocke dans → **Session JWT**
5. **Frontend** → Peut accéder via → `useAuth()` hook

## Tokens JWT

Les tokens sont automatiquement gérés par NextAuth :

```javascript
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { getAccessToken, getRefreshToken } = useAuth();
  
  const accessToken = getAccessToken();    // Token d'accès court terme
  const refreshToken = getRefreshToken();  // Token pour renouvellement
  
  // Utiliser pour les requêtes API
  const response = await fetch('https://api-mytone.onrender.com/auth/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
}
```

## Endpoints API disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Créer un compte |
| POST | `/auth/login` | Se connecter |
| GET | `/auth/me` | Récupérer l'utilisateur courant |
| POST | `/auth/refresh` | Rafraîchir le token d'accès |
| POST | `/auth/logout` | Déconnecter |
| POST | `/auth/verify-email` | Vérifier si l'email existe |
| POST | `/auth/verify-username` | Vérifier si le username existe |
| POST | `/auth/forgot-password` | Demander réinitialisation mot de passe |
| POST | `/auth/reset-password` | Réinitialiser le mot de passe |

## Variables d'environnement requises

Dans `.env.local` :
```
NEXTAUTH_SECRET=votre_secret_tres_long_et_aleatoire
NEXTAUTH_URL=http://localhost:3000
```

## Gestion des erreurs

```javascript
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function LoginForm() {
  const [error, setError] = useState('');
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Erreur d\'authentification');
    }
  };
}
```

## Points importants

✅ L'inscription crée automatiquement les tokens
✅ La connexion utilise l'API backend (plus de BDD locale)
✅ Les tokens sont stockés de manière sécurisée (HttpOnly en production)
✅ NextAuth gère automatiquement le cycle de vie des tokens
✅ Tous les appels API sont authentifiés automatiquement

## Prochaines étapes

1. Tester la connexion et l'inscription sur votre environnement local
2. Vérifier les variables d'environnement
3. Adapter l'URL de l'API si nécessaire (`https://api-mytone.onrender.com`)
4. Implémenter des pages protégées avec middleware NextAuth
5. Ajouter la gestion du rafraîchissement automatique des tokens
