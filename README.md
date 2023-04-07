# Présentation

## Pour lancer le site

```
npm start dev

```

Lance le site avec nodemon pour permettre de recharger la page à chaque fois que l'on sauvergarde un fichier

## Modules

- nodemon : permet de relancer le site avec les changements que l'on vient de fair e
- ejs : permet d'envoyer des pages html en réponse
- body-parser : permet de reçevoir des données depuis notre application
- mysql2 : permet de faire des requêtes sql
- express-session : permet de stocker des données dans les cookies (s'utilise avec le module cookie-parser)
- uuid : pour générer un uuid qui servira de session id

## Utilisation de Docker

Le fichier docker-compose.yml qui contient la configuration de notre base de donnée ainsi que phpMyAdmin. On va build un environnement à partir de ce fichier avec la commande :

```bash
    docker-compose up -d --build
```

## Fonctionnalités

- Contact

Possibilité de contacter directement l'entreprise et les questions sont enregistrés en base de données

- Panier

+ Utilisation de express-session pour enregistrer le panier dans les coockies

Ajouter des éléments dans son panier et possibilité de supprimer l'élément voulu. La commande n'est envoyée à la base de données que lorsque l'on valide le panier. 

=> Création d'un client si on ne retrouve pas son email dans la base de donnée.

=> Ajout de la commande dans la table order avec l'id de la session, du client et du produit.
