# Visuels de marque

Bandeaux LinkedIn : fond vert `#095D40`, **marque seule** (sans le mot « CALA »)
calée à droite, touchant le haut et le bas du cadre.

| Fichier | Format | Rapport | Usage |
|---|---|---|---|
| `linkedin-banniere-1584x396-jaune.png` | 1584 × 396 | 4:1 | couverture d'un **profil personnel** |
| `linkedin-banniere-1584x396-blanc.png` | 1584 × 396 | 4:1 | idem, marque blanche |
| `linkedin-banniere-entreprise-1128x191-jaune.png` | 1128 × 191 | ≈ 5,9:1 | couverture d'une **page entreprise** |
| `linkedin-banniere-entreprise-1128x191-blanc.png` | 1128 × 191 | ≈ 5,9:1 | idem, marque blanche |

La marque du dépôt est verte : posée telle quelle sur un fond vert, elle serait
invisible. Elle est donc recolorée en conservant son canal alpha — la couleur
est remplacée, le tracé et son lissage restent intacts.

## Le parasite dans `cala_icon.png`

Le master `assets/img/cala_icon.png` contient **un amas de 39 pixels détaché du
tracé** (vers x 644, y 837 dans le fichier d'origine) et un pixel isolé, sans
doute des résidus d'export. Ils sont visibles dès que la marque est agrandie.

Les bandeaux les effacent par analyse des composantes connexes : tout groupe de
pixels de moins de 200 px est retiré, le reste garde son lissage. Le master,
lui, n'a pas été modifié — **le défaut subsiste donc dans le favicon et dans la
marque de la carte du hero du site**. À corriger à la source quand vous
régénérerez le fichier.

## Régénérer

Depuis la racine du dépôt, avec ImageMagick :

```sh
# détourage sur seuil, pour ignorer le liseré de lissage
BOX=$(convert assets/img/cala_icon.png -alpha extract -threshold 4% -format %@ info:)
convert assets/img/cala_icon.png -crop "$BOX" +repage /tmp/mark.png
DIM=$(identify -format "%wx%h" /tmp/mark.png)

# suppression des composantes parasites, lissage préservé
convert /tmp/mark.png -alpha extract -threshold 4% \
  -define connected-components:area-threshold=200 \
  -define connected-components:mean-color=true \
  -connected-components 8 -threshold 50% /tmp/keep.png
convert /tmp/keep.png -morphology Dilate Disk:4 /tmp/keep-d.png
convert /tmp/mark.png -alpha extract /tmp/alpha.png
convert /tmp/alpha.png /tmp/keep-d.png -compose Multiply -composite /tmp/alpha-clean.png

# recoloration puis composition
convert -size $DIM xc:'#FFD439' /tmp/alpha-clean.png -compose CopyOpacity -composite /tmp/mark-jaune.png
convert /tmp/mark-jaune.png -resize x396 /tmp/m.png
convert -size 1584x396 xc:'#095D40' /tmp/m.png -gravity East -geometry +72+0 -composite \
        -strip brand/linkedin-banniere-1584x396-jaune.png
```

La hauteur de la marque (`-resize x396`) vaut celle du bandeau : c'est ce qui la
fait toucher le haut et le bas. La marge droite (`+72`) l'écarte du bord.
