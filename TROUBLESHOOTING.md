# Dépannage et Erreurs Courantes

## Erreurs d'authentification

### ❌ "Incorrect email, username or password"
**Cause**: Les identifiants sont incorrects ou l'utilisateur n'existe pas
**Solution**:
- Vérifier que le compte a été créé avec cette email/username
- Vérifier la casse (usernames peuvent être sensibles à la casse)
- Vérifier que le mot de passe est correct

### ❌ "Invalid token" ou "Token verification failed"
**Cause**: Le token JWT est expiré ou invalide
**Solution**:
- Se reconnecter pour obtenir un nouveau token
- Vérifier que `NEXTAUTH_SECRET` est défini en variables d'environnement
- Vérifier que le secret utilisé en production correspond à celui en développement

### ❌ "Aucun utilisateur trouvé"
**Cause**: L'utilisateur n'existe pas dans la base de données du backend
**Solution**:
- Vérifier que l'utilisateur a été créé
- Vérifier l'URL de l'API backend (`https://api-mytone.onrender.com`)

### ❌ "Email already registered" ou "Username already registered"
**Cause**: L'email ou le username est déjà utilisé
**Solution**:
- Choisir un autre email ou username
- Si vous voulez réinitialiser, demander à l'administrateur de supprimer le compte

## Erreurs de connexion API

### ❌ "Impossible de joindre l'API"
**Cause**: L'URL du backend est incorrecte ou le backend est hors ligne
**Solution**:
1. Vérifier l'URL: `https://api-mytone.onrender.com`
2. Tester dans Postman:
   ```
   POST https://api-mytone.onrender.com/auth/login
   Content-Type: application/x-www-form-urlencoded
   
   username=test&password=password123
   ```
3. Vérifier les logs du backend sur Render

### ❌ CORS Error
**Cause**: Le backend n'autorise pas les requêtes du frontend
**Solution**:
1. Vérifier la configuration CORS du backend (`main.py`)
2. Ajouter l'URL du frontend aux origines autorisées:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000", "https://votresite.com"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### ❌ 422 Unprocessable Entity
**Cause**: Les données envoyées ne correspondent pas au format attendu
**Solution**:
- Pour `/auth/login`: Envoyer `username` et `password` en format URL-encoded (pas JSON)
- Pour `/auth/register`: Envoyer les champs JSON: `name`, `surname`, `email`, `username`, `password`

## Erreurs NextAuth

### ❌ "[next-auth][error] NEXTAUTH_SECRET is not set"
**Cause**: Variable d'environnement manquante
**Solution**:
1. Créer un fichier `.env.local` à la racine du projet
2. Ajouter:
   ```
   NEXTAUTH_SECRET=votre_secret_tres_long_et_aleatoire
   NEXTAUTH_URL=http://localhost:3000
   ```
3. Redémarrer le serveur Next.js

### ❌ "Redirect to origin: null not allowed"
**Cause**: `NEXTAUTH_URL` n'est pas configuré correctement
**Solution**:
1. Ajouter à `.env.local`:
   ```
   NEXTAUTH_URL=http://localhost:3000
   ```
2. En production, utiliser l'URL du site:
   ```
   NEXTAUTH_URL=https://votresite.com
   ```

### ❌ Session n'est pas mise à jour
**Cause**: Le composant n'est pas à jour après la connexion
**Solution**:
```javascript
// Utiliser useEffect pour réagir aux changements de session
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function MyComponent() {
  const { data: session } = useSession();
  
  useEffect(() => {
    console.log('Session mise à jour:', session);
  }, [session]);
  
  return <div>...</div>;
}
```

## Erreurs de variables d'environnement

### ❌ Tokens non disponibles
**Cause**: Les tokens ne sont pas stockés dans la session
**Solution**:
1. Vérifier que `authOptions` contient les callbacks JWT corrects
2. Vérifier que `getAccessToken()` et `getRefreshToken()` sont appelés correctement

### ❌ "process.env.NEXTAUTH_SECRET is undefined"
**Cause**: Variable d'environnement non chargée
**Solution**:
1. Créer `.env.local` à la racine du projet (pas dans `/app`)
2. Redémarrer le serveur (`npm run dev`)
3. Vérifier que le fichier n'est pas ignoré dans `.gitignore`

## Débogage

### Activer les logs
```javascript
// Dans .env.local
DEBUG=next-auth:*
```

### Vérifier les tokens
```javascript
import { useAuth } from '@/hooks/useAuth';

export default function DebugComponent() {
  const { getAccessToken, getRefreshToken } = useAuth();
  
  return (
    <div>
      <p>Access Token: {getAccessToken()?.substring(0, 20)}...</p>
      <p>Refresh Token: {getRefreshToken()?.substring(0, 20)}...</p>
    </div>
  );
}
```

### Tester l'API directement
```javascript
// Dans la console du navigateur
const token = localStorage.getItem('auth-token'); // Si stocké localement
fetch('https://api-mytone.onrender.com/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
```

## Support

Si vous avez des problèmes:
1. Vérifier les logs du navigateur (F12 → Console)
2. Vérifier les logs du backend (Render dashboard)
3. Tester l'API avec Postman
4. Vérifier la documentation de [NextAuth.js](https://next-auth.js.org/)
5. Vérifier la documentation de [FastAPI](https://fastapi.tiangolo.com/)
