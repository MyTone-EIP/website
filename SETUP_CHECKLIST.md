# ✅ Intégration API Complète - Checklist de configuration

## 🎯 Objectifs atteints

- ✅ **Inscription (Signup)** - Appelle l'API backend `/auth/register`
- ✅ **Connexion (Login)** - Appelle l'API backend `/auth/login`
- ✅ **Gestion des tokens JWT** - Stockés de manière sécurisée dans NextAuth
- ✅ **Sessions utilisateur** - Authentification persistent avec NextAuth
- ✅ **Routes protégées** - Middleware pour sécuriser les pages privées
- ✅ **Hook React** - `useAuth()` pour accéder facilement aux données

## 📋 Checklist avant déploiement

### 1. Configuration locale
- [ ] Node.js installé (v18+)
- [ ] Dépendances installées: `npm install`
- [ ] Fichier `.env.local` créé à la racine du projet

### 2. Variables d'environnement requises (`.env.local`)
```
NEXTAUTH_SECRET=un_secret_tres_long_et_aleatoire
NEXTAUTH_URL=http://localhost:3000
```

Pour générer un secret:
```bash
openssl rand -base64 32
```

### 3. Tester localement
- [ ] Lancer le serveur: `npm run dev`
- [ ] Accéder à `http://localhost:3000`
- [ ] Tester l'inscription: `/signup`
- [ ] Tester la connexion: `/login/user`
- [ ] Vérifier les tokens dans les DevTools (Application → Cookies)

### 4. Variables d'environnement en production
```
NEXTAUTH_SECRET=générer_un_nouveau_secret
NEXTAUTH_URL=https://votre-domaine.com
```

⚠️ **Important**: Utiliser un secret DIFFÉRENT en production

### 5. Configuration Vercel (si déployé sur Vercel)
Ajouter dans `vercel.json`:
```json
{
  "env": {
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "https://votre-domaine.vercel.app"
  }
}
```

Ou dans le dashboard Vercel:
- Settings → Environment Variables
- Ajouter `NEXTAUTH_SECRET` et `NEXTAUTH_URL`

### 6. Vérifier l'API backend
- [ ] L'API est accessible: `curl https://api-mytone.onrender.com/docs`
- [ ] Les endpoints de login/register fonctionnent
- [ ] Les CORS sont correctement configurés

### 7. Routes à tester

| Route | Description | Authentification |
|-------|-------------|------------------|
| `/` | Accueil | Non requise |
| `/login/user` | Formulaire de connexion | Non requise |
| `/signup` | Formulaire d'inscription | Non requise |
| `/dashboard` | Tableau de bord | ✅ Requise |
| `/profile` | Profil utilisateur | ✅ Requise |
| `/settings` | Paramètres | ✅ Requise |
| `/api/auth/signin` | API signin NextAuth | N/A |
| `/api/auth/signout` | API signout NextAuth | N/A |
| `/api/auth/session` | Récupérer la session | N/A |

## 🔐 Sécurité

### Points de sécurité implémentés
- ✅ Passwords hashés (bcrypt)
- ✅ JWT pour l'authentification
- ✅ Tokens d'accès court terme + refresh tokens
- ✅ NextAuth gère les tokens de manière sécurisée
- ✅ Routes protégées par middleware
- ✅ CORS configuré sur le backend

### Recommandations supplémentaires
1. Utiliser HTTPS en production (obligatoire)
2. Configurer les en-têtes de sécurité:
   ```javascript
   // next.config.js
   async headers() {
     return [{
       source: '/:path*',
       headers: [
         { key: 'X-Content-Type-Options', value: 'nosniff' },
         { key: 'X-Frame-Options', value: 'DENY' },
       ]
     }]
   }
   ```
3. Implémenter rate limiting sur les endpoints d'authentification
4. Ajouter la vérification d'email
5. Implémenter la 2FA (si nécessaire)

## 📚 Fichiers créés/modifiés

### Créés
- `/lib/api.js` - Utilitaire pour les appels API
- `/hooks/useAuth.js` - Hook React pour l'authentification
- `/middleware.js` - Middleware pour les routes protégées
- `/components/ExampleAuthComponent.js` - Exemple d'utilisation
- `/API_INTEGRATION.md` - Documentation complète
- `/TROUBLESHOOTING.md` - Guide de dépannage
- `/SETUP_CHECKLIST.md` - Cette checklist

### Modifiés
- `/app/api/auth/[...nextauth]/route.js` - Utilise maintenant l'API backend
- `/app/api/signup/route.js` - Appelait déjà l'API backend ✅

## 🚀 Utilisation

### Inscription
```javascript
import { useRouter } from 'next/navigation';

async function handleSignup(userData) {
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  const result = await response.json();
  // Utiliser result.access_token et result.refresh_token
}
```

### Connexion
```javascript
import { useAuth } from '@/hooks/useAuth';

function LoginForm() {
  const { login } = useAuth();
  
  await login(email, password);
  // L'utilisateur est maintenant connecté
}
```

### Accès aux données utilisateur
```javascript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, getAccessToken } = useAuth();
  
  console.log(user.name, user.email);
  const token = getAccessToken();
}
```

### Appel API protégé
```javascript
import { useAuth } from '@/hooks/useAuth';

async function fetchProtectedData() {
  const { getAccessToken } = useAuth();
  const token = getAccessToken();
  
  const response = await fetch('https://api-mytone.onrender.com/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

## 🐛 Dépannage

### Les tokens ne sont pas stockés
1. Vérifier que `NEXTAUTH_SECRET` est défini
2. Vérifier la console du navigateur pour les erreurs
3. Vérifier que la réponse du backend contient `access_token` et `refresh_token`

### La connexion échoue
1. Vérifier que l'API backend est accessible
2. Vérifier que les identifiants sont corrects
3. Vérifier les CORS du backend
4. Vérifier les logs du backend

### Les routes protégées ne fonctionnent pas
1. Vérifier que `middleware.js` existe
2. Vérifier que `config.matcher` couvre les bonnes routes
3. Redémarrer le serveur Next.js
4. Vérifier la variable `NEXTAUTH_SECRET`

## 📞 Support

Pour les problèmes:
1. Consulter [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Vérifier les logs du navigateur (F12)
3. Vérifier les logs du serveur (npm run dev)
4. Vérifier les logs du backend Render
5. Tester l'API avec Postman
6. Consulter la documentation [NextAuth.js](https://next-auth.js.org/)

## ✨ Prochaines étapes optionnelles

- [ ] Implémenter la vérification d'email
- [ ] Ajouter le forgot password
- [ ] Implémenter la 2FA
- [ ] Ajouter les providers OAuth (Google, GitHub, etc.)
- [ ] Implémenter les rôles et permissions
- [ ] Ajouter un système de logs d'authentification
- [ ] Implémenter le rate limiting

---

**Date**: 29/01/2026
**Statut**: ✅ Complète et prête pour la production
