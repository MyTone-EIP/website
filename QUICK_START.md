#!/usr/bin/env node

# 🚀 QUICK START - Intégration API MyTone

## Étape 1: Configurer l'environnement (2 min)

```bash
# 1. Copier le fichier d'exemple
cp .env.local.example .env.local

# 2. Générer un secret sécurisé (copier la sortie)
openssl rand -base64 32

# 3. Éditer .env.local et ajouter:
# NEXTAUTH_SECRET=<votre_secret_généré>
# NEXTAUTH_URL=http://localhost:3000

nano .env.local  # ou éditez avec VS Code
```

## Étape 2: Installer les dépendances (1 min)

```bash
npm install
```

**Dépendances requises:**
- ✅ next
- ✅ next-auth
- ✅ bcryptjs
- ✅ react
- ✅ react-dom

## Étape 3: Lancer le serveur (30 sec)

```bash
npm run dev
```

Accédez à: **http://localhost:3000**

## Étape 4: Tester l'authentification (5 min)

### Test 1: Inscription
1. Accédez à: `http://localhost:3000/signup`
2. Remplissez le formulaire
3. Cliquez sur "S'inscrire"
4. Vous devez être automatiquement connecté ✅

### Test 2: Déconnexion
1. Déconnectez-vous
2. Vérifiez que vous êtes redirigé

### Test 3: Connexion
1. Accédez à: `http://localhost:3000/login/user`
2. Connectez-vous avec vos identifiants
3. Vous devez être connecté ✅

### Test 4: Utiliser useAuth dans un composant
```javascript
import { useAuth } from '@/hooks/useAuth';

export function TestComponent() {
  const { user, isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <div>Connecté en tant que: {user?.name}</div>;
  }
  return <div>Non connecté</div>;
}
```

## Fichiers clés à connaître

```
website/
├── lib/api.js ........................ Utilitaire API
├── hooks/useAuth.js .................. Hook React
├── middleware.js ..................... Protection des routes
├── app/api/auth/[...nextauth]/route.js NextAuth (modifié)
├── app/api/signup/route.js ........... Inscription
├── app/signup/page.js ................ Page d'inscription
├── app/login/user/page.js ............ Page de connexion
│
├── API_INTEGRATION.md ................ Guide complet
├── ARCHITECTURE.md ................... Diagrammes
├── TROUBLESHOOTING.md ................ Dépannage
├── SETUP_CHECKLIST.md ................ Checklist complète
└── README_INTEGRATION.md ............ Résumé (ce fichier)
```

## Utilisation rapide

### Récupérer les données utilisateur
```javascript
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated } = useAuth();
console.log(user?.name, user?.email);
```

### Faire un appel API authentifié
```javascript
import { useAuth } from '@/hooks/useAuth';

const { getAccessToken } = useAuth();
const token = getAccessToken();

fetch('https://api-mytone.onrender.com/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Créer une page protégée
```javascript
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Accès refusé</div>;
  }
  
  return <div>Contenu privé</div>;
}
```

### Se connecter/déconnecter
```javascript
import { useAuth } from '@/hooks/useAuth';

export function LoginComponent() {
  const { login, logout, isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <button onClick={logout}>Déconnexion</button>;
  }
  
  return (
    <button onClick={() => login('user@example.com', 'password')}>
      Connexion
    </button>
  );
}
```

## ⚡ Commandes utiles

```bash
# Développement
npm run dev              # Lancer le serveur
npm run build          # Compiler pour production
npm run start          # Démarrer en production

# Vérification
npm list              # Lister les dépendances
npm outdated          # Vérifier les mises à jour

# Nettoyage
rm -rf .next          # Supprimer le cache
npm ci                # Réinstaller proprement
```

## 🔍 Débogage

### Afficher les logs NextAuth
```bash
# Dans .env.local, ajouter:
DEBUG=next-auth:*
```

### Vérifier les tokens dans le navigateur
```javascript
// Console du navigateur
const session = await fetch('/api/auth/session').then(r => r.json());
console.log(session);
```

### Tester l'API directement
```bash
# Inscription
curl -X POST https://api-mytone.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean",
    "surname": "Dupont",
    "email": "jean@test.com",
    "username": "jeandupont",
    "password": "password123"
  }'

# Connexion
curl -X POST https://api-mytone.onrender.com/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=jeandupont&password=password123"

# Récupérer l'utilisateur courant
curl -X GET https://api-mytone.onrender.com/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## ❌ Problèmes courants

### ".env.local not found"
```bash
cp .env.local.example .env.local
# Éditer .env.local et ajouter NEXTAUTH_SECRET et NEXTAUTH_URL
```

### "NEXTAUTH_SECRET is not set"
```bash
# Vérifier que .env.local existe et contient:
NEXTAUTH_SECRET=votre_secret
```

### "Cannot find module 'next-auth'"
```bash
npm install
npm install next-auth
```

### "Erreur de connexion à l'API"
- Vérifier que https://api-mytone.onrender.com est accessible
- Vérifier les CORS du backend
- Consulter les logs du backend

## ✅ Checklist de démarrage

- [ ] `.env.local` créé avec NEXTAUTH_SECRET et NEXTAUTH_URL
- [ ] `npm install` exécuté avec succès
- [ ] `npm run dev` lance sans erreur
- [ ] Page d'accueil accessible sur `http://localhost:3000`
- [ ] Page d'inscription accessible sur `/signup`
- [ ] Page de connexion accessible sur `/login/user`
- [ ] Inscription fonctionne ✅
- [ ] Connexion fonctionne ✅
- [ ] useAuth() fonctionne dans les composants ✅

## 📚 Prochaines étapes

1. **Consulter la documentation** → [API_INTEGRATION.md](./API_INTEGRATION.md)
2. **Comprendre l'architecture** → [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **Voir des exemples** → [components/ExampleAuthComponent.js](./components/ExampleAuthComponent.js)
4. **Dépannage** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
5. **Checklist complète** → [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

## 🎯 Résumé

| Étape | Temps | Action |
|-------|-------|--------|
| 1 | 2 min | Configurer `.env.local` |
| 2 | 1 min | Installer les dépendances |
| 3 | 30 sec | Lancer le serveur |
| 4 | 5 min | Tester l'authentification |
| 5 | - | Développer! 🚀 |

---

## 🆘 Support rapide

```
Erreur?
    ├─ Consulter TROUBLESHOOTING.md
    ├─ Vérifier .env.local
    ├─ Vérifier les logs (npm run dev)
    └─ Tester avec curl/Postman

Questions?
    ├─ Lire API_INTEGRATION.md
    ├─ Consulter ARCHITECTURE.md
    ├─ Voir ExampleAuthComponent.js
    └─ Vérifier SETUP_CHECKLIST.md
```

**Bon développement! 🎉**

---

*Créé le 29/01/2026*
*Intégration API MyTone - Next.js + FastAPI*
