# CCSA Commandit - Portail de Commandes Interne

Ce projet est un portail web interne pour gérer les commandes de fournitures, matériel informatique et autres équipements au sein de Christian Constantin SA.

## Fonctionnalités

- Authentification sécurisée (domaine @christian-constantin.ch)
- Formulaires de commande pour différentes catégories :
  - Papeterie
  - Matériel informatique
  - Mobilier de bureau (à venir)
  - Autres fournitures (à venir)
- Envoi automatique des commandes par email à l'équipe IT
- Interface utilisateur moderne et responsive

## Prérequis

- Node.js 18+ et npm
- Serveur SMTP pour l'envoi d'emails

## Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-organisation/ccsa-commandit.git
   cd ccsa-commandit
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Créer un fichier `.env.local` à la racine du projet avec les variables suivantes :
   ```
   # Configuration JWT
   JWT_SECRET=votre-secret-jwt-tres-securise

   # Configuration SMTP
   EMAIL_HOST=smtp.votreserveur.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=noreply@christian-constantin.ch
   EMAIL_PASSWORD=votre-mot-de-passe
   ```

## Développement

Pour lancer le serveur de développement :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Déploiement en production

1. Construire l'application :
   ```bash
   npm run build
   ```

2. Démarrer le serveur de production :
   ```bash
   npm start
   ```

Pour un déploiement sur un serveur, nous recommandons d'utiliser PM2 ou un service similaire pour maintenir l'application en fonctionnement.

## Structure du projet

```
src/
|-- app/
|   |-- api/             # Routes API (backend)
|   |-- commande/        # Pages de commande par catégorie
|   |-- components/      # Composants réutilisables
|   |-- context/         # Contextes React (auth, etc.)
|   |-- services/        # Services d'API
|   |-- globals.css      # Styles globaux
|   |-- layout.tsx       # Layout principal
|   |-- page.tsx         # Page d'accueil
|   |-- providers.tsx    # Fournisseurs de contexte
|
|-- public/              # Fichiers statiques
```

## Personnalisation

- Les couleurs et styles peuvent être modifiés dans `tailwind.config.js`
- Le logo et autres éléments visuels dans `public/`

## Sécurité

Cette application utilise :
- JWT pour l'authentification
- Validation d'email de domaine (@christian-constantin.ch)
- HTTPS recommandé en production

## Support

Pour toute assistance technique, contactez l'équipe IT à it@christian-constantin.ch.