# Cala — site vitrine du chef à domicile

Site vitrine d'un cuisinier à domicile spécialisé dans le **batch cooking** à Paris
et en banlieue sud. Objectif : la prise de contact.

Site statique, sans dépendance ni build : trois fichiers, un dossier d'images.
Il s'ouvre en double-cliquant sur `index.html` et s'héberge partout
(GitHub Pages, Netlify, Vercel, OVH, o2switch…).

```
index.html                          la page complète
mentions-legales.html               page légale (à compléter)
politique-de-confidentialite.html   page légale (à compléter)
assets/css/styles.css               styles
assets/css/legal.css                styles des pages légales
assets/js/main.js                   interactions + configuration
assets/img/                         logo, favicon, image de repli
```

## Ce que contient la page

| Section | Ancre | Contenu |
|---|---|---|
| En-tête | `#hero` | Titre, slogan, CTA « Contactez le chef », chiffres clés |
| Avantages | `#avantages` | Les 6 bénéfices du batch cooking |
| À propos de moi | `#a-propos` | Photo + qui je suis / mon expérience / pourquoi ce service |
| Déroulement | `#deroulement` | Les 4 étapes d'une prestation |
| Mes services | `#services` | Batch cooking à domicile, gestion des courses, cours de batch cooking |
| Crédit d'impôt | `#credit-impot` | Éligibilité aux 50 %, avec exemple de calcul |
| Galerie | `#galerie` | 6 photos, agrandissables au clic |
| Zone d'intervention | `#zone` | Communes desservies + carte Google Maps |
| FAQ | `#faq` | 9 questions fréquentes + bouton WhatsApp |
| Contact | `#contact` | Formulaire, coordonnées, réseaux sociaux |

## À personnaliser avant la mise en ligne

### 1. Les coordonnées

Le contact se fait par WhatsApp : **+33 7 80 74 31 05**, renseigné dans la
section contact, sous la FAQ, dans le pied de page et dans le bloc
`application/ld+json`. Le lien utilise le format `https://wa.me/33780743105`
— numéro international, sans espaces ni « + ». Il n'y a plus de lien
`tel:` sur le site.

Restent à remplacer, ce sont des valeurs d'exemple :

- `contact@cala-chef.fr` — e-mail, dans `index.html`, les deux pages légales,
  le bloc `application/ld+json` et la constante `CONFIG.EMAIL` de `main.js`
- `https://www.facebook.com/` et `https://www.instagram.com/` — liens des réseaux
  sociaux, présents dans la section contact **et** dans le pied de page

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

Les champs envoyés : `nom`, `prenom`, `tel`, `email`, `ville`, `prestation`,
`message`, `consent`. Obligatoires : nom, téléphone, e-mail, ville, message et
la case de consentement.

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

### 5. Les tarifs annoncés

⚠️ **Tous les prix de la page sont des exemples repris des maquettes fournies**, et
non vos tarifs réels. À vérifier et à ajuster avant publication :

- « semaine d'essai à partir de **70 €** » — bandeau du hero, carte de service,
  liste déroulante du formulaire
- « facture de **150 €**, vous ne réglez que **75 €** » — section crédit d'impôt
- durées annoncées : **1 h 30 à 3 h** pour une séance, **3 h** pour un atelier
- « liste de **30 recettes** »

Les maquettes de référence annonçaient à la fois 60 € et 70 € pour la semaine
d'essai : la valeur 70 € a été retenue partout, à confirmer.

### 6. La zone d'intervention et la carte

La liste des communes (`.zone__cities`) et la carte sont réglées sur Paris et la
banlieue sud. La carte est un simple `iframe` Google Maps, sans clé d'API :

```
https://www.google.com/maps?q=48.8000,2.3400&z=11&hl=fr&output=embed
```

Le `q=` porte des **coordonnées** et non un nom de ville : centrer sur
« Paris » placerait la capitale au milieu du cadre et couperait la banlieue sud.
Le point 48.80 / 2.34 place Paris dans le haut du cadre, la banlieue sud occupant
le reste. Pour déplacer le secteur, changez ces deux nombres ; `z=` règle le zoom
(11 = environ 22 km de haut).

La hauteur de l'`iframe` (`.zone__map iframe`, minimum 420 px) est calée sur ce
cadrage : la réduire fait sortir Massy et Palaiseau du bas de la carte.

Si la carte ne se charge pas (Google bloqué, visiteur hors ligne), un texte de
repli s'affiche à sa place. À noter : cet `iframe` dépose des cookies Google —
c'est signalé dans la politique de confidentialité, et il peut être remplacé par
une image statique si vous préférez éviter le sujet.

### 7. Le texte « À propos de moi »

Les trois paragraphes (qui je suis / mon expérience / pourquoi ce service) sont
repris des maquettes : ce sont des textes génériques. Réécrivez-les à la première
personne avec votre vrai parcours — c'est la section qui crée la confiance.

### 8. Les mentions légales

Les pages `mentions-legales.html` et `politique-de-confidentialite.html` sont des
**squelettes** : chaque mention « à compléter » doit être remplie (identité,
statut, SIRET, hébergeur, numéro de déclaration services à la personne). La
politique de confidentialité décrit le formulaire de contact et la carte Google ;
adaptez-la à vos outils réels.

## Le crédit d'impôt : à faire vérifier

La page annonce 50 % de crédit d'impôt au titre des services à la personne, y
compris la mention « tout le monde est éligible » et l'avance immédiate. Cet
avantage suppose une activité **déclarée services à la personne** (déclaration
ou agrément selon le cas), et les conditions réelles dépendent de la situation
de chaque client. À faire valider par votre comptable avant publication, en même
temps que les tarifs (voir plus haut).

## Design

Deux couleurs de marque, déclarées en haut de `assets/css/styles.css` :

| Variable | Valeur | Usage |
|---|---|---|
| `--green` | `#095D40` | titres, texte, fonds sombres (crédit d'impôt, pied de page) |
| `--accent` | `#FFD439` | boutons, surlignage du titre, badges, puces sur fond vert |
| `--green-deep` | `#06432E` | survols verts |
| `--accent-deep` | `#F0C220` | survols jaunes |
| `--cream` / `--sand` | `#FCFAF4` / `#F3EFE4` | fonds de page et sections alternées |
| `--tint` / `--tint-warm` | `#E8F0EB` / `#FFF3CF` | aplats très pâles (vert / jaune) |

Le jaune est réservé à l'action : tous les boutons d'appel sont jaunes à texte
vert, jamais l'inverse — du jaune sur blanc ou du blanc sur jaune serait
illisible. Changer une couleur de marque se fait donc en un seul endroit.

La fleur de calla est un tracé SVG défini une seule fois
(`<symbol id="cala-mark">` en haut de `index.html`) et réutilisée dans
l'en-tête, la carte du hero et le pied de page : la modifier à un endroit la met
à jour partout. Elle utilise `currentColor`, donc elle prend la couleur de son
contexte (verte sur fond clair, blanche sur fond vert).

Polices : Outfit (titres) et Inter (texte), chargées depuis Google Fonts, avec
repli sur les polices système.

## Accessibilité et technique

- HTML sémantique, navigation au clavier, lien d'évitement, `aria-*` sur les
  éléments interactifs.
- Contrastes vérifiés au niveau AA sur l'ensemble des couples texte/fond de la
  palette (y compris le texte vert sur les boutons jaunes et les textes sur
  fond vert).
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
- Une grille tarifaire complète, si les prix sont fixes.
