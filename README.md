# Cala — site vitrine du chef à domicile

Site vitrine d'un cuisinier à domicile spécialisé dans le **batch cooking** à Paris
et en banlieue sud. Objectif : la prise de contact.

Site statique, sans dépendance ni build : trois fichiers, un dossier d'images.
Il s'ouvre en double-cliquant sur `index.html` et s'héberge partout
(GitHub Pages, Netlify, Vercel, OVH, o2switch…).

```
index.html               la page complète
assets/css/styles.css    styles
assets/js/main.js        interactions + configuration
assets/img/              logo, favicon, image de repli
```

## Ce que contient la page

| Section | Ancre | Contenu |
|---|---|---|
| En-tête | `#hero` | Titre, slogan, CTA « Contactez le chef », chiffres clés |
| Avantages | `#avantages` | Les 4 bénéfices du batch cooking |
| Déroulement | `#deroulement` | Les 4 étapes d'une prestation |
| Services | `#services` | Cuisine à domicile, courses, cours de cuisine |
| Crédit d'impôt | `#credit-impot` | Les 50 %, avec exemple de calcul |
| Galerie | `#galerie` | 6 photos, agrandissables au clic |
| FAQ | `#faq` | 8 questions fréquentes |
| Contact | `#contact` | Formulaire + coordonnées |

## À personnaliser avant la mise en ligne

### 1. Les coordonnées (obligatoire)

Ce sont des valeurs d'exemple, à remplacer partout dans `index.html` :

- `06 00 00 00 00` — téléphone (aussi dans `href="tel:+33600000000"`)
- `contact@cala-chef.fr` — e-mail (aussi dans le bloc `application/ld+json` en bas de page)

### 2. La ville affichée dans le titre

Le titre s'adapte à la ville visée. Elle se change en un seul endroit,
en haut de `assets/js/main.js` :

```js
var CONFIG = {
  ENDPOINT: null,
  EMAIL: 'contact@cala-chef.fr',
  VILLE: 'Paris'          // ← « Simplifiez vos repas avec un chef à domicile à … »
};
```

Pratique pour décliner une page par commune (Montrouge, Clamart, Antony…) :
il suffit de dupliquer la page et de changer `VILLE`.

### 3. Le formulaire de contact

Par défaut (`ENDPOINT: null`), le formulaire **valide les champs puis ouvre le
logiciel de messagerie du visiteur** avec la demande pré-remplie. Cela fonctionne
sans serveur, mais tout le monde n'a pas de client mail configuré.

Pour recevoir les demandes directement par e-mail, créez un formulaire sur
[Formspree](https://formspree.io) (gratuit jusqu'à 50 messages/mois) ou
[Basin](https://usebasin.com), puis renseignez l'URL fournie :

```js
ENDPOINT: 'https://formspree.io/f/xxxxxxx'
```

Les champs envoyés : `nom`, `email`, `tel`, `ville`, `prestation`,
`personnes`, `message`, `consent`.

### 4. Les photos

Les photos actuelles sont des **images libres de droits appelées à distance**
(Unsplash), présentes uniquement pour la mise en page. Elles doivent être
remplacées par les vraies photos du chef : ce sont elles qui font vendre.

1. Déposez vos images dans `assets/img/` (format paysage, ~1600 px de large,
   compressées via [Squoosh](https://squoosh.app)).
2. Dans `index.html`, remplacez chaque `src="https://images.unsplash.com/…"`
   par `src="assets/img/mon-plat.jpg"`.
3. Adaptez le texte `alt=""` : il décrit la photo pour Google et les lecteurs d'écran.

Si une photo est indisponible, un visuel de repli discret s'affiche
automatiquement (`assets/img/placeholder.svg`) : jamais d'image cassée.

### 5. Les mentions légales

Un site professionnel doit afficher des mentions légales (identité, statut,
SIRET, hébergeur) et une politique de confidentialité, puisque le formulaire
collecte des données personnelles. À ajouter avant la mise en ligne.

## Le crédit d'impôt : à faire vérifier

La page annonce 50 % de crédit d'impôt au titre des services à la personne.
Cet avantage suppose une activité **déclarée services à la personne**
(déclaration ou agrément selon le cas). Les montants et plafonds cités
(12 000 €, exemple à 200 € la séance) sont indicatifs : à confirmer avec votre
comptable et à ajuster à vos tarifs réels avant publication.

## Design

Repris du logo : le bleu encre `#17276E`, un trait fin, beaucoup de blanc cassé
`#FBF9F5`, aucune ombre inutile. La fleur de calla est un tracé SVG défini une
seule fois (`<symbol id="cala-mark">` en haut de `index.html`) et réutilisée
dans l'en-tête, la carte du hero et le pied de page — la modifier à un endroit
la met à jour partout.

Polices : Outfit (titres) et Inter (texte), chargées depuis Google Fonts, avec
repli sur les polices système.

## Accessibilité et technique

- HTML sémantique, navigation au clavier, lien d'évitement, `aria-*` sur les
  éléments interactifs, contrastes conformes AA.
- `prefers-reduced-motion` respecté : les animations se désactivent.
- Galerie utilisable au clavier (Tab + Entrée), fermeture par Échap.
- Balises Open Graph, `LocalBusiness` en JSON-LD, favicon SVG.
- Responsive de 320 px à grand écran.

## Mise en ligne rapide (GitHub Pages)

Dans les réglages du dépôt : **Settings → Pages → Branch: `main` / `root`**.
Le site est publié en une minute, aucune configuration supplémentaire.

## Pistes d'évolution

- Une page par commune desservie (voir `VILLE`) pour le référencement local.
- Des témoignages clients — à n'ajouter qu'une fois les avis réellement reçus.
- Une grille tarifaire, si les prix sont fixes.
