# 🍃 FlashGreen - Frontend V2

> **Version statique** HTML/CSS/JS, hébergée sur Vercel et optimisée pour réduire l’empreinte écologique du numérique.

## 📃 Description du projet
**FlashGreen** est un projet étudiant en 3e année d'ingénierie informatique dans le cadre du module "Green IT".

Ce repository s'inscrit dans une liste de trois repositories : 
 - https://github.com/AdamChb/flash-green-front
 - https://github.com/AdamChb/flash-green-front-v2
 - https://github.com/AdamChb/flash-green-back

L'objectif de ce projet est de concevoir une application web la moins énergétique possible tout en ayant un frontend, un backend et une base de données.

Ce repository ```https://github.com/AdamChb/flash-green-front-v2``` est celui de la première version du frontend. Hébergé sur *vercel.com* et codé en HTML/CSS/JS, il est la version optimisée du frontend de ce projet, avec optimisation de l'empreinte écologique de notre application.

## 🧑‍💻 Auteurs
Les personnes ayant travaillé sur cette partie du projet sont : 
 - Doryan : [doryan.denis@efrei.net](mailto:doryan.denis@efrei.net)
 - Eva : [eva.marot@efrei.net](mailto:eva.marot@efrei.net)
 - Sacha : [sacha.portal@efrei.net](mailto:sacha.portal@efrei.net)

## 📱 Principales pages :
Le site comporte 5 pages principales :
 - La page d'Accueil : elle sert à présenter l'application Web aux visiteurs ;
 - Les pages S'inscrire/Se connecter ;
 - La page Cartes : accessible uniquement connecté, elle permet de réviser avec les flashcards de l'application ;
 - La page Progression : accessible uniquement connecté, elle permet de voir sa progression personnelle sur l'ensemble des cartes de l'application ;
 - La page Admin : accessible uniquement avec un compte Admin ou Professeur, elle permet de créer/modifier/supprimer les questions et les comptes utilisateurs (seulement pout un compte Admin).

## 📎Installation et déploiement

**Clonage du repo :** 
```bash
git clone https://github.com/AdamChb/flash-green-front.git
```
**Configuration :**
Aucune configuration n'est nécessaire.

**Exécution du projet :**
Lancer un *Live Server* en local sur votre PC.

## 🗂️ Architecture du projet

```
flash-green-front-v2/
│
├─ components/         ← fragments HTML (header, footer, admin, cards…)
├─ css/
│   └─ style.css       ← styles globaux + admin + modals
├─ js/
│   ├─ app.js          ← injection de composants + gestion header
│   ├─ cards.js        ← logique flashcards
│   ├─ progress.js     ← logique progression
│   └─ admin.js        ← CRUD & modals Admin/Professeur
├─ index.html
└─ README.md
```

## 🤝 Contribuer

**Branches & Pull Requests**
- Branches
  - `main` : version “stable” déployée.
  - `feature/xxx` : nouvelles fonctionnalités.
  - `bugfix/xxx` : corrections de bogues.
- Workflow
	 1.	Créer une branche feature/… ou bugfix/….
	 2.	Faire vos commits (voir conventions ci-dessous).
	 3.	Ouvrir une Pull Request vers main.
	 4.	Demander une relecture (assigner des reviewers) et corriger si nécessaire.
	 5.	Après validation, merger et supprimer la branche.

**Conventions de commit**

Nous adoptons le standard Conventional Commits :
```
<type>(<scope>): <description courte>

[description détaillée et/ou breaking changes]

BREAKING CHANGE: …
```
- type : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- scope : partie du code touchée (ex. `admin`, `cards`, `auth`)
- description courte : impérative, sans point final


## 🕒 Historique des contributions

Pour consulter en détail l’historique de chaque membre :
- Rendez-vous dans l’onglet Pull requests du dépôt.
- Chaque PR liste les commits, les fichiers modifiés et les reviewers.
- Vous y verrez qui a travaillé sur quelles fonctionnalités et quand.
