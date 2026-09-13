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
assets/img/                         logos, favicons, image de repli
```

## Ce que contient la page

| Section | Ancre | Contenu |
|---|---|---|
| En-tête | `#hero` | Titre, slogan, CTA « Contactez le chef », chiffres clés |
| Avantages | `#avantages` | Les 6 bénéfices du batch cooking |
| À propos de moi | `#a-propos` | Photo + qui je suis / mon expérience / pourquoi ce service |
| Déroulement | `#deroulement` | Les 4 étapes d'une prestation |
| Mes services | `#services` | Batch cooking à domicile, gestion des courses |
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

L'e-mail est **chef@calasociedad.com**, renseigné dans `index.html`, les deux
pages légales, le bloc `application/ld+json` et la constante `CONFIG.EMAIL` de
`main.js`.

La section contact affiche donc trois informations : WhatsApp, e-mail et zone
d'intervention. Il n'y a volontairement ni horaires ni réseaux sociaux ; pour en
ajouter, dupliquez un `<li>` de `.contact__info`.

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
- durée annoncée : **1 h 30 à 3 h** pour une séance
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

### Les fichiers du logo

Vos deux fichiers d'origine sont conservés tels quels comme masters :

| Fichier | Rôle |
|---|---|
| `cala_logo.png` | master fourni (logo complet, 1681 × 1290) |
| `cala_icon.png` | master fourni (marque seule, 1042 × 1042) |
| `logo.png` | **affiché** dans l'en-tête et le pied de page |
| `mark.png` | **affiché** dans la carte du hero (marque seule) |
| `favicon-64.png` | favicon de l'onglet |
| `apple-touch-icon.png` | icône d'écran d'accueil iOS (180 × 180) |

Les quatre derniers sont dérivés des masters : recadrage sur le tracé puis
redimensionnement — 608 Ko de PNG ramenés à 29 Ko pour l'affichage.
**Si vous remplacez un master, régénérez les dérivés**, sinon le site
continuera d'afficher les anciens. Pensez aussi à reporter les dimensions dans
les attributs `width`/`height` des balises `<img>`, qui réservent la place de
l'image avant son chargement.

Le tracé du logo est vert (`#02533C`). Sur le fond vert du pied de page, il est
rendu en blanc par un filtre CSS (`filter: brightness(0) invert(1)` sur
`.site-footer__logo`), sans fichier supplémentaire — cela fonctionne parce que
le PNG a un fond transparent.

La hauteur de l'en-tête (`--header-h`, 100 px ; 82 px en mobile) est calée sur
celle du logo : un logo de proportions très différentes demande de la revoir.

Polices : Outfit (titres) et Inter (texte), chargées depuis Google Fonts, avec
repli sur les polices système.

## Accessibilité et technique

- HTML sémantique, navigation au clavier, lien d'évitement, `aria-*` sur les
  éléments interactifs.
- Contrastes vérifiés au niveau AA sur l'ensemble des couples texte/fond de la
  palette (y compris le texte vert sur les boutons jaunes et les textes sur
  fond vert).
- `prefers-reduced-motion` respecté : les animations se désactivent.

### Les animations d'apparition

Chaque élément portant la classe `reveal` entre en scène quand il croise la
fenêtre. La variante s'indique par un attribut : `data-reveal="rise"`,
`"left"`, `"right"`, `"scale"` ou `"mask"` (balayage vers le haut, pour les
titres). Les photos ajoutent `media-reveal` : l'image se dévoile de haut en bas
en se dézoomant, et `img-wrap` fait défiler un voile clair tant qu'elle charge.
Les chiffres marqués `data-count` s'incrémentent jusqu'à leur valeur.

Le décalage entre voisins est calculé en JS et posé dans `--reveal-delay`, à
partir de la **position de l'élément dans son groupe** — pas de son ordre
d'arrivée dans l'observateur, sinon deux cartes côte à côte recevraient un
retard différent selon le sens du défilement.

Deux pièges à connaître avant de toucher à ce système :

- **Ne jamais poser `clip-path` sur l'élément observé.** Réduit à zéro, il
  n'intersecte plus la fenêtre : l'observateur ne se déclenche jamais et
  l'élément reste invisible pour toujours. C'est pourquoi le découpage des
  titres porte sur un `<span class="mask-inner">` inséré en JS, et celui des
  photos sur l'`<img>`, jamais sur la figure.
- **Le voile de chargement doit être retiré aussi sur erreur**, sinon une photo
  manquante laisse le balayage tourner indéfiniment.

Sans JavaScript, un bloc `<noscript>` rend tout visible immédiatement : les
apparitions étant pilotées en JS, la page serait sinon entièrement vide.
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
