# Visuels de marque

Bandeaux LinkedIn : fond vert de marque `#095D40`, logo blanc calé à droite,
touchant le haut et le bas du cadre.

| Fichier | Format | Usage |
|---|---|---|
| `linkedin-banniere-1584x396.png` | 1584 × 396 | photo de couverture d'un **profil personnel** |
| `linkedin-banniere-entreprise-1128x191.png` | 1128 × 191 | couverture d'une **page entreprise** |
| `linkedin-banniere-1584x396-logo-jaune.png` | 1584 × 396 | même visuel, logo en jaune `#FFD439` |

Le logo du dépôt est vert : posé tel quel sur un fond vert, il serait invisible.
Il est donc recoloré en conservant son canal alpha — la couleur est remplacée,
le tracé et son lissage sont intacts.

## Régénérer

Depuis la racine du dépôt, avec ImageMagick :

```sh
# détourage sur seuil, pour ignorer le liseré de lissage du master
BOX=$(convert assets/img/cala_logo.png -alpha extract -threshold 4% -format %@ info:)
convert assets/img/cala_logo.png -crop "$BOX" +repage /tmp/logo-trim.png

# recoloration : toile de la couleur voulue + masque alpha du logo
convert /tmp/logo-trim.png -alpha extract /tmp/mask.png
convert -size $(identify -format "%wx%h" /tmp/logo-trim.png) xc:white /tmp/mask.png \
        -compose CopyOpacity -composite /tmp/logo-blanc.png

# composition : le logo est mis à la hauteur exacte du bandeau
convert /tmp/logo-blanc.png -resize x396 /tmp/l.png
convert -size 1584x396 xc:'#095D40' /tmp/l.png -gravity East -geometry +56+0 -composite \
        -strip brand/linkedin-banniere-1584x396.png
```

La hauteur du logo (`-resize x396`) vaut celle du bandeau : c'est ce qui le fait
toucher le haut et le bas. La marge droite (`+56`) l'écarte du bord sans quoi
le « A » final semblerait coupé.
