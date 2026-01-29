#!/bin/bash
# Script de vérification de l'intégration API

echo "🔍 Vérification de l'intégration API MyTone..."
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
PASSED=0
FAILED=0

# Fonction pour vérifier l'existence d'un fichier
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Fichier trouvé: $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Fichier manquant: $1"
        ((FAILED++))
    fi
}

# Fonction pour vérifier une variable d'environnement
check_env() {
    if grep -q "^$1=" .env.local 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Variable d'environnement définie: $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Variable d'environnement manquante: $1"
        echo -e "${YELLOW}  → Ajouter à .env.local: $1=votre_valeur${NC}"
        ((FAILED++))
    fi
}

# Fonction pour vérifier du contenu dans un fichier
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Contenu trouvé dans $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Contenu manquant dans $1"
        ((FAILED++))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 Vérification des fichiers créés"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "lib/api.js"
check_file "hooks/useAuth.js"
check_file "middleware.js"
check_file "components/ExampleAuthComponent.js"
check_file "API_INTEGRATION.md"
check_file "TROUBLESHOOTING.md"
check_file "SETUP_CHECKLIST.md"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔑 Vérification des variables d'environnement"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_env "NEXTAUTH_SECRET"
check_env "NEXTAUTH_URL"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Vérification des modifications"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_content "app/api/auth/[...nextauth]/route.js" "api-mytone.onrender.com/auth/login"
check_content "app/api/signup/route.js" "api-mytone.onrender.com/auth/register"
check_content "package.json" "next-auth"
check_content "package.json" "bcryptjs"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Résumé"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Vérifications réussies: $PASSED${NC}"
echo -e "${RED}✗ Vérifications échouées: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Tout est en place! Vous pouvez commencer à développer.${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "1. Exécutez: npm run dev"
    echo "2. Testez l'inscription sur: http://localhost:3000/signup"
    echo "3. Testez la connexion sur: http://localhost:3000/login/user"
    exit 0
else
    echo -e "${RED}⚠️  Des problèmes ont été détectés. Veuillez les corriger.${NC}"
    echo ""
    echo "Erreurs à corriger:"
    echo "1. Créer les fichiers manquants"
    echo "2. Configurer les variables d'environnement dans .env.local"
    echo "3. Consulter SETUP_CHECKLIST.md pour plus de détails"
    exit 1
fi
