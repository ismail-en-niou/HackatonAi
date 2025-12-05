| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         |              | Page 107 sur 207 |

## 7.  Fonctionnement du processus : Concentration

## 7.1. Concentration Introduction

L'acide phosphorique est concentré dans l'évaporateur en bouillant sous vide. À n'importe quelle température  donnée,  une  pression  spécifique  est  requise  pour  faire  bouillir  l'acide  à  une concentration spécifique. Les paramètres de contrôle principaux dans le cadre du processus de concentration figurent dans le tableau ci-dessous.

Le processus utilise du condensat de traitement en boucle fermée pour refroidir le processus. Le lavage des gaz à deux étages est inclus pour éliminer le FSA dans le flux de condensat de traitement en circulation. Le FSA peut être vendu ou neutralisé pour être mis au rebut.

| Variable    | Contrôlé par                                      |
|-------------|---------------------------------------------------|
| Pression    | Purge d'air vers le condensateur de l'évaporateur |
| Température | Débit de vapeur vers l'échangeur de chaleur       |

Avec une capacité donnée, suffisamment de vapeur doit être fournie pour obtenir la température d'acide requise et suffisamment de condensat de traitement doit être fourni pour condenser les gaz bouillis à partir de le bouilleur.

Il y a trois échelons d'évaporation J, K et L identiques dans lesquels chacun est configuré comme indiqué ci-dessous.

Composants principaux :
Section d'alimentation :
Entrée d'acide (Feed acid)
Vapeur (Steam)
Réchauffeur (Heater)
Pompe de circulation (Circulation pump)
Zone de réaction et séparation :
Chambre flash (Flash chamber) - grand réservoir cylindrique central
Séparateur d'entraînement (Entrainment separator)
Épurateurs FSA (FSA scrubbers)
Section de condensation :
Condenseur évaporateur (Evaporator condenser)
Condenseur éjecteur (Ejector condenser)
Flux MP Steam (vapeur moyenne pression)
Équipements auxiliaires :
Pompe à produit (Product pump)
Pompe à vide (Vacuum pump)
Puisard du joint du condenseur (Condenser seal sump)
Flux du procédé :
Le condensat entre dans le système
L'acide et la vapeur sont chauffés et traités dans la chambre flash
Les vapeurs passent par les séparateurs et épurateurs
Le condensat de procédé est récupéré
L'acide produit (Product acid) sort du système

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         |              | Page 108 sur 207 |

L'équipement de protection individuel requis pour la zone de concentration est le suivant

Protection des yeux obligatoire, protection auditive obligatoire dans cette zone, casques de sécurité obligatoires, chaussures de sécurité obligatoires dans cette zone.

## 7.2. Fonctionnement normal

## 7.2.1. Généralités

Les évaporateurs sont utilisés sous vide afin que la température ne dépasse jamais 88°C pour faire  bouillir  l'acide.  Il  s'agit  de  la  température  limite  pour  la  membrane  en  caoutchouc  dans l'évaporateur.

Une fois  la  pression  configurée  dans  le  bouilleur,  le  point  d'ébullition  de  l'acide  augmente  à mesure  que  l'acide  est  plus  concentré  en  raison  de  l'évaporation  de  l'eau.  Le  graphique  cidessous indique la relation entre la concentration d'acide, la pression absolue de l'évaporateur et le point d'ébullition de l'acide.

Afin de maintenir la concentration d'acide souhaitée, le taux de vapeur est ajusté pour maintenir la bonne température de fonctionnement. En général, la température est maintenue à un niveau constant et la pression absolue est modifiée pour contrôler la concentration d'acide.

## 7.2.2. Concentration d'acide

## 7.2.2.1. Refroidisseur de condensat (404J/K/L AE01)

Le refroidisseur de condensat est un échangeur de chaleur à coquilles et tubes fourni pour chaque échelon d'évaporation. L'acide phosphorique peu concentré provenant des réservoirs d'alimentation  de  l'évaporateur  est  utilisé  pour  refroidir  le  condensat  de  vapeur  à  partir  du récepteur de condensat (404J/K/L AR03). L'acide préchauffé diminue la consommation de vapeur requise  pour  les  chauffages  de  l'évaporateur  (404J/K/L  AE02)  et  conserve  le  condensat  en l'empêchant de s'enflammer dans le réservoir de récupération de condensat. Les températures de refoulement de l'acide phosphorique et du condensat sont indiquées par le TI-408 et le TI-409, respectivement.

Si un tube fuit dans le refroidisseur de condensat, la conductivité est indiquée par l'AI-210, 310, 410 pour les échelons J, K et L, respectivement. La conductivité élevée-élevée sur cette boucle de régulation est interverrouillée pour fermer les vannes LV-201/301/401-A et ouvrir les vannes LV-201/301/401-B. Cela détourne le condensat contaminé du collecteur de condensat vers le réservoir d'eau de lavage (413AAR01).

<!-- image -->

<!-- image -->

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         |              | Page 109 sur 207 |

## 7.2.2.2. Bouilleur de l'évaporateur (404J/K/L AD01)

Le bouilleur de l'évaporateur fonctionne sous vide pour conserver l'acide phosphorique à son point d'ébullition. La pression absolue dans le bouilleur de l'évaporateur est contrôlée par le PIC242, le PIC-342 et le PIC-442 pour les échelons J, K et L, respectivement, qui établissent le volume de purge d'air dans le système à vide via le PV-242, le PV-342 et le PV-442 pour les échelons J, K et L, respectivement. La pression doit être suffisamment basse pour que l'acide pulpe au niveau de concentration souhaité et à une température d'environ 82°C. La combinaison requise de pression et de température variera en fonction de la teneur en impuretés de l'acide.

La pression élevée ou basse dans le bouilleur déclenchera également une alarme via le PAH/L242, 342 et 442 pour les échelons J, K et L, respectivement.

Évitez les modifications subites de température ou de pression dans le bouilleur étant donné que cela peut entraîner une ébullition incontrôlée et un entraînement excessif à partir du bouilleur.

L'acide produit déborde du bouilleur de l'évaporateur et est pompé vers le stockage par la pompe à produit de l'évaporateur (404J/K/L AP05). L'alarme de niveau élevé dans le bouilleur (LAH-241, 341, 441 pour les échelons J, K et L, respectivement) doit émettre un signal d'avertissement si le débit  de  produit  est  arrêté  en  raison  de  problèmes  de  la  pompe  ou  d'une  obstruction  de  la conduite. Le débit d'acide produit est mesuré et calculé par le FI/FQI-250, 350,  450 pour les échelons J, K et L, respectivement.

Une pompe de vidange commune est utilisée pour vider les évaporateurs. Le refoulement de la pompe de vidange d'évaporateur (407AAP07) peut être envoyé vers n'importe lequel des bassins de distribution à 54 % (414AAS01) ou le réservoir d'eau de lavage (413AAR01).

De l'agent antimousse peut être ajouté dans les conduites d'alimentation de l'évaporateur. Si suffisamment d'agent antimousse est ajouté dans le réacteur, il est normalement inutile d'ajouter de l'agent antimousse supplémentaire dans les évaporateurs. Le système d'agent antimousse est une unité d'emballage du fournisseur avec un équipement de préparation commun et des pompes d'alimentation individuelles vers chaque évaporateur.

## 7.2.2.3. Chauffage de l'évaporateur (404J/K/L AE02)

Le chauffage de l'évaporateur (404J/K/L AE02) est un échangeur de chaleur vertical à coquilles et tubes qui utilise de la vapeur à basse pression pour chauffer l'acide phosphorique recyclé dans l'évaporateur.  La  vapeur  vers  l'échangeur  de  chaleur  utilise  les  boucles  de  contrôle  de  la température (TIC/TV-223, TIC/TV-323 et TIC/TV-423 pour les échelons J, K et L, respectivement) afin  de  maintenir  la  température  requise  dans  le  bouilleur.  La  température  du  système  est mesurée à deux endroits dans l'évaporateur. Une mesure est effectuée dans la branche inférieure de chaque bouilleur par les TE-244, 344, 444 et l'autre mesure a lieu après chaque chauffage de l'évaporateur par les TE-223, 323, 423.

Une électrovanne fermera la soupape de contrôle de la vapeur si la pompe de circulation de l'évaporateur s'arrête ou si la température de l'acide (TIC-223, TIC-323 et TIC-423) refoulée par le  chauffage  atteint  88°C.  Une  fonction  de  sécurité  dans  cet  interverrouillage  empêchera  de réinitialiser l'électrovanne à moins que les conditions suivantes soient remplies :

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         |              | Page 110 sur 207 |

- Le  contrôleur  de  débit  de  vapeur  pour  l'échelon  spécifique  (FI-221,  FI-321  et  FI-421) affiche zéro.
- La soupape de contrôle du débit de vapeur pour l'échelon spécifique (TV-223, TV-323 et TV-423) est fermée.

Ces conditions empêchent une poussée de vapeur subite dans l'échangeur de chaleur lors du redémarrage.

Lorsque le chauffage de l'évaporateur est neuf et que les tubes sont propres, la pression dans la coquille peut être basse (0,2 à 0,3 bar g) et est mesurée par le PI-228, le PI-328 et le PI-428 pour les échelons J, K et L, respectivement. Lorsque du tartre s'accumule dans les tubes, la pression augmente. Lorsque la pression dans la coquille du chauffage atteint environ 1 bar g avec le débit de vapeur nominal, un ébouillantage est requis. L'augmentation de la pression est une preuve de tartre, provenant également d'une diminution du coefficient de transfert de chaleur. Un coefficient de transfert de chaleur plus faible empêchera l'acide de se concentrer.

Le débit de vapeur vers le chauffage doit être augmenté lentement pour éviter un choc thermique et mécanique susceptible d'entraîner une rupture des tubes en graphite fragiles. Après un arrêt prolongé, il est très important de préchauffer le chauffage lentement.

L'acide  dans  l'évaporateur  est  constamment  recyclé  à  un  taux  élevé  (11 000  m 3 /h).  Le  débit circule vers le haut à travers le chauffage, dans le bouilleur, et vers le bas vers l'aspiration de la pompe de circulation (404J/K/L AP04). Du côté du refoulement de la pompe, avant le chauffage, un filtre  est  installé pour  piéger les grosses particules de tartre qui risqueraient d'obstruer les tubes de l'échangeur de chaleur.

Afin d'empêcher la surchauffe de l'acide, le débit de vapeur sera automatiquement arrêté si la pompe s'arrête.

## 7.2.2.4. Séparateur d'entraînement (404J/K/L AS02)

Le séparateur d'entraînement (404J/K/L AS02) récupère l'acide phosphorique entraîné dans le flux de vapeur à partir du bouilleur de l'évaporateur. L'acide phosphorique est renvoyé vers la conduite de débordement à partir du bouilleur vers la pompe à produit de l'évaporateur (404J/K/L AP05).

La vapeur entre à travers un port sur le côté de la cuve et crée un cyclone à l'intérieur qui remonte sur les côtés et est refoulé par la sortie située au fond. Le cyclone obtenu jette les particules plus denses sur les parois de la cuve qui reviennent sous l'effet de la gravité vers la conduite de débordement qui alimente la conduite d'aspiration de la pompe à produit de l'évaporateur.

## 7.2.2.5. Récepteur de condensat (404J/K/L AR03)

Le condensat provenant de chaque chauffage de l'évaporateur est collecté dans le récepteur de condensat (404J/K/L AR03) et pompé sous le contrôle de niveau (LIC-201, 301 et 401 pour les échelons  J,  K  et  L,  respectivement)  dans  le  refroidisseur  de  condensat  vers  le  réservoir  de récupération de condensat (404AAR08).

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         |              | Page 111 sur 207 |

Le condensat est surveillé en termes de conductivité au niveau de chaque évaporateur par les AI-202, AI-302 et AI-402 dans le récepteur de condensat dans la conduite de refoulement de la pompe à condensat (404J/K/L AP03) et par les AI-210, 310 et 410 dans les canalisations après le refroidisseur de condensat pour les échelons J, K et L, respectivement.

Toute fuite ou rupture de tube dans le chauffage de l'évaporateur entraînera une augmentation de la conductivité et sera détectée par les AI-202, 302 et 402. Une fuite dans le refroidisseur de condensat sera détectée par les AI-210, 310 et 410 sans relevé de conductivité élevée par les AI-202, 302 et 402. Ces boucles de contrôle sont interverrouillées sur conductivité élevée-élevée afin  que  le  condensat  soit  automatiquement  réacheminé  avec  les  déchets  jusqu'à  ce  que  le problème soit résolu, en ouvrant les valves de niveau LV-201/301/401-B et en fermant la vanne LV-201/301/401-A pour les échelons J, K et L, respectivement.

La  majorité  du  condensat  dans  le  réservoir  de récupération  de  condensat  est  aspirée  par  la pompe de retour de condensat (404A A/KP08) vers la batterie limite sous le contrôle de niveau (LIC-081 et LV-081-A/B) avec une petite partie allant vers le désurchauffeur sous le contrôle de température  (TIC/TV-068,  108  et  128  pour  les  échelons  J,  K  et  L,  respectivement).  Si  une conductivité élevée est détectée dans le réservoir de récupération de condensat (404AAR08) par l'AI-082,  une  vanne  de  décharge (LV-081B),  contrôlée  par  l'interverrouillage  I-131,  s'ouvre  et envoie le condensat contaminé vers le réservoir d'eau de lavage (413AAR01).

Le débit total d'alimentation de vapeur vers l'usine est mesuré par les FI-063, 103, 123 et traverse une station de contrôle (PIC/PV-066, 106 et 126) avant de passer à travers le désurchauffeur et le séparateur, et avant d'aller vers chaque chauffage de l'évaporateur. Les caractéristiques de la vapeur vers les évaporateurs seront normalement contrôlées à environ 2,0 barg et à 136°C. Le débit de vapeur sera automatiquement arrêté à une température élevée (TAHH-068, 108 et 128 pour les échelons J, K et L, respectivement) à partir du désurchauffeur ou du déclenchement de la pompe de retour de condensat.

## 7.2.3.  Récupération de FSA

## 7.2.3.1. Laveur de FSA (404J/K/L AD02)

La vapeur sortant du séparateur d'entraînement (404J/K/L AS02) traverse les deux étages du laveur de FSA avant d'être condensée dans le condensateur d'évaporateur (404J/K/L AD03). Les gaz entrent d'abord dans le laveur de FSA (404J/K/L AD02) où ils sont lavés avec un flux de recyclage de FSA concentré à partir du réservoir d'étanchéité de FSA (404J/K/L AR06). Le FSA concentré est constitué d'acide peu concentré pompé à partir du réservoir d'étanchéité de FSA peu concentré (404J/K/L AR09) et ajouté au réservoir d'étanchéité de FSA sur le contrôle de niveau  par  les  LIC/LV-261,  361,  461.  Les  LALL-261,  361,  461  sont  interverrouillés  avec  les pompes  de  lavage  de  FSA  (404J/K/L  AP06)  pour  s'arrêter  sur  le  niveau  bas-bas  dans  les réservoirs d'étanchéité de FSA.

Le FSA est refoulé par le système via un courant de dérive à partir des pompes de lavage de FSA et envoyé vers les réservoirs de déplacement de FSA (404B A/BR01) lorsque la densité du FSA en circulation atteint le point de contrôle de FSA produit. Ce flux est contrôlé par la boucle de contrôle de densité DIC/DV-270, 370, 470. Le débit de FSA vers les réservoirs de déplacement

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         |              | Page 112 sur 207 |

de FSA est indiqué et calculé par les FI/FQI-272, 372, 472. Le débit de FSA vers le laveur de FSA est indiqué par les FI-277, 377, 477.

## 7.2.3.2. Laveur de FSA peu concentré (404J/K/L AD04)

La vapeur sortant du laveur de FSA entre dans le laveur de FSA peu concentré (404J/K/L AD04) où il est lavé avec un flux de recyclage de FSA peu concentré à partir du réservoir d'étanchéité de FSA peu concentré (404J/K/L AR09). L'eau de traitement acide provenant du laveur des gaz est ajoutée sur le contrôle de niveau dans le réservoir d'étanchéité de FSA peu concentré comme eau d'appoint. Les LIC/LV-501, 521, 541 contrôlent le débit d'eau de traitement acide vers les réservoirs d'étanchéité de FSA peu concentré. Les LALL-501, 521, 541 sont interverrouillés avec les pompes de lavage de FSA peu concentré (404J/K/L AP12) pour s'arrêter sur le niveau basbas dans les réservoirs d'étanchéité de FSA peu concentré.

L'acide peu concentré est transféré à partir des réservoirs d'étanchéité d'acide peu concentré correspondant afin de maintenir le niveau dans les réservoirs d'étanchéité de FSA.

## 7.2.4.  Condensation

## 7.2.4.1. Condensateur d'évaporateur (404J/K/L AD03)

Les gaz provenant du laveur de FSA peu concentré entrent dans le condensateur d'évaporateur où un pulvérisateur de condensat de traitement est utilisé pour éliminer les gaz condensables. Les gaz condensables et le condensat de traitement sont renvoyés au système de condensat de traitement via le puisard d'étanchéité du condensateur. Les gaz non-condensables sont éliminés par l'échelon à vide composé d'un éjecteur de vapeur, d'un condensateur interne et d'une pompe à vide.

Le condensateur d'évaporateur (404J/K/L AD03) est un condensateur barométrique à contact direct  utilisant  le  condensat  de  traitement  provenant  du  bassin  chaud  (425EAR02)  pour condenser les gaz provenant du laveur de FSA peu concentré. Une boucle de contrôle de débit (FIC/FV-281, 381 et 481 pour les échelons J, K et L, respectivement) située sur la conduite d'eau de  refroidissement  sert  à  contrôler  le  débit  du  condensat  de  traitement  de  façon  à  ne  pas dépasser une température de refoulement maximale de 46°C.

Une  alarme  de  température  élevée,  TAH-283,  383  et  483  pour  les  échelons  J,  K  et  L, respectivement, signale toute température excessive dans la branche inférieure du condensateur.

## 7.2.4.2. Éjecteur de vapeur (404J/K/L AC02)

Le  système  d'éjection  de  vapeur  est  fourni  pour  chaque  échelon  de  clarification.  L'éjecteur introduit un flux à basse pression dans le flux de vapeur sortant du condensateur de l'évaporateur. Ensuite, ce flux de vapeur est condensé avec le condensat de traitement à partir du bassin chaud. La vapeur allant vers l'éjecteur est contrôlée par les PIC/PV-288, 388, 488 pour les échelons J, K  et  L,  respectivement.  Les  PV-288,  388,  488  sont  interverrouillés  avec  les  alarmes  de température élevée-élevée sur les gaz évacués de l'éjecteur (TAHH-289, 389, 489) et la branche inférieure  provenant  de  l'éjecteur  (TAHH-282,  382,  482)  pour  les  échelons  J,  K  et  L, respectivement.

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         | AFC1         | Page 113 sur 207 |

## 7.2.4.3. Pompe à vide de l'évaporateur (404J/K/L AC01)

La  pompe à vide de l'évaporateur est une pompe à vide à anneau liquide. Le condensat de traitement provenant du bassin chaud (425EAR02) sert à former l'anneau liquide. La pression interne  du  bouilleur  de  l'évaporateur  est  contrôlée  par  les  PIC/PV-242,  342  et  442  pour  les échelons J, K et L, respectivement, via une purge d'air dans le flux de gaz avant d'entrer dans la pompe à vide. Le débit de condensat de traitement allant vers la pompe à vide est indiqué par les FI-293, 393, 493 pour les échelons J, K et L, respectivement. La pompe à vide est interverrouillée pour s'arrêter à un débit faible-faible de condensat de traitement.

## 7.2.5. Tableaux de contrôle

| Écoulements pour chaque évaporateur (3 en marche)   | Écoulements pour chaque évaporateur (3 en marche)   | Écoulements pour chaque évaporateur (3 en marche)   | Écoulements pour chaque évaporateur (3 en marche)   | Écoulements pour chaque évaporateur (3 en marche)   | Écoulements pour chaque évaporateur (3 en marche)   |   Écoulements pour chaque évaporateur (3 en marche) | Écoulements pour chaque évaporateur (3 en marche)   | Écoulements pour chaque évaporateur (3 en marche)   |
|-----------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------|
| Taux de production d'évaporation (t/j de P 2 O 5 )  | 200                                                 | 240                                                 | 280                                                 | 320                                                 | 360                                                 |                                                 400 | 440                                                 | 480                                                 |
| Débit d'alimentation de l'évaporateur m 3 /h        | 23                                                  | 27,6                                                | 32,2                                                | 36,8                                                | 41,4                                                |                                                  46 | 50,6                                                | 55,2                                                |
| Débit de produit de l'évaporateur m 3 /h            | 9                                                   | 10,8                                                | 12,6                                                | 14,4                                                | 16,2                                                |                                                  18 | 19,8                                                | 21,6                                                |
| Flux de vapeur à basse pression t/h                 | 19,5                                                | 23,4                                                | 27,3                                                | 31,2                                                | 35,1                                                |                                                  39 | 42,9                                                | 46,8                                                |

## Notes :

les débits ci-dessus sont indiqués par évaporateur, en supposant que trois évaporateurs fonctionnent et incluent de la pulpe recyclée à un taux de 38 t/j de P2O5

* Un minimum de 600 m 3 /h est requis pour entraîner les gaz non-condensables

## 7.3. Démarrage normal

| Concentration   | Concentration                                                                                                            | Concentration                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|-----------------|--------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Étape           | Consignes                                                                                                                | Remarques                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 1               | Vérifiez le contenu du système                                                                                           | Vérifiez que tout l'équipement et les conduites sont propres et vides et que toutes les vannes sont fermées.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 2               | Confirmez et réglez tous les paramètres d'instrumentation du plan d'étanchéité de pompe s'y rapportant selon les besoins | Consultez l'Annexe 13.7 pour obtenir les informations et les procédures associées.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 3               | Remplissez le bouilleur avec de l'acide à 54%                                                                            | Communiquez avec les opérateurs dans la zone de clarification pour vous assurer que suffisamment d'acide à 28 % est disponible pour faire fonctionner l'usine et que suffisamment d'acide à 54 % est disponible pour remplir le bouilleur. Vérifiez que la pompe de remplissage de l'évaporateur est alignée sur le bon évaporateur. Démarrez la pompe de remplissage de l'évaporateur et remplissez le bouilleur jusqu'au niveau de débordement normal. Ouvrez la soupape d'aspiration et la vanne de prélèvement sur la conduite d'acide produit. Lorsque de l'acide commence à sortir de la vanne de prélèvement, fermez les deux vannes et arrêtez d'ajouter de l'acide à 54 % dans le système. |

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         |              | Page 114 sur 207 |

| Consignes                                                                                                                           | Remarques                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Démarrez la pompe de circulation de l'évaporateur                                                                                   | Faites couler l'eau d'étanchéité vers la pompe avant le démarrage. Après le démarrage, vérifiez la pompe et l'ampérage.                                                                                                                                                                                                                                                                                                                                                                        |
| Faites couler le condensat de traitement vers le condensateur de l'évaporateur                                                      | Réglez le débit sur la valeur nominale.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Démarrez le débit d'eau de traitement acide vers le réservoir d'étanchéité de FSA peu concentré et le réservoir d'étanchéité de FSA | Communiquez avec les opérateurs dans la zone du laveur des gaz pour vous assurer qu'il y a suffisamment d'eau de traitement acide disponible pour remplir les réservoirs d'étanchéité.                                                                                                                                                                                                                                                                                                         |
| Démarrez la pompe de lavage de FSA peu concentré et la pompe de lavage de FSA                                                       | Faites couler l'eau d'étanchéité vers la pompe avant le démarrage.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Démarrez la pompe à vide de démarrage de l'évaporateur                                                                              | Réglez le régulateur de vide en mode manuel et fermez lentement la vanne de purge d'air. Configurez le contrôleur de pression sur 76 mm Hg abs, qui devrait fonctionner à la pression de fonctionnement normale.                                                                                                                                                                                                                                                                               |
| Démarrez la pompe d'alimentation de l'évaporateur                                                                                   | Démarrez la pompe lentement (par ex. à un débit de 50 %) en mode de contrôle manuel.                                                                                                                                                                                                                                                                                                                                                                                                           |
| Démarrez la pompe à produit de l'évaporateur                                                                                        | Assurez-vous que les vannes sont alignées pour transférer vers la bonne destination dans la zone de clarification à 54 %. Surveillez le débit.                                                                                                                                                                                                                                                                                                                                                 |
| Démarrez le chauffage de l'évaporateur Il                                                                                           | est important de faire cela lentement, sinon vous risquez d'endommager l'échangeur de chaleur. Commencez à préchauffer lentement le chauffage en utilisant d'abord la soupape de dérivation manuelle autour de la soupape de contrôle du flux de vapeur à basse pression. Après avoir obtenu la pression de consigne du système, vidangez le résidu de condensat du collecteur.                                                                                                                |
| Ajustez la vapeur pour correspondre au débit d'acide                                                                                | Augmentez progressivement le débit de vapeur à basse pression à un taux de 50 %.                                                                                                                                                                                                                                                                                                                                                                                                               |
| Démarrez la pompe à condensat                                                                                                       | Démarrez la pompe lorsque le niveau apparaît dans le récepteur de condensat. Mettez le contrôle de niveau en mode automatique. Détournez le condensat d'abord vers la fosse.                                                                                                                                                                                                                                                                                                                   |
| Vérifiez la concentration d'acide.                                                                                                  | Prélevez de l'acide en circulation à intervalles réguliers. Ajustez le débit de vapeur à basse pression et envoyez le débit d'acide de sorte que la concentration de l'acide augmente progressivement pour atteindre la valeur nominale et que le débit dans la pompe à produit de l'évaporateur reste constant. Notez le débit de vapeur, la pression de vapeur ainsi que la pression de fonctionnement de l'évaporateur et la température toutes les demi- heures lors du démarrage initial. |
| Orientez le condensat vers le réservoir de récupération                                                                             | Vérifiez la conductivité du condensat. Si elle est inférieure à la limite acceptable, vous pouvez détourner l'écoulement vers le réservoir de récupération. Si l'instrumentation de la conductivité fonctionne correctement, passez en mode de contrôle automatique.                                                                                                                                                                                                                           |
| Augmentez le débit                                                                                                                  | Augmentez le débit à intervalles de 10% jusqu'à atteindre le taux nominal (consultez le tableau de contrôle dans la section précédente). Laissez le système se stabiliser entre les augmentations de débit.                                                                                                                                                                                                                                                                                    |
| Arrêtez la pompe à vide de démarrage de l'évaporateur pression du système                                                           | Lorsque le système est stable, arrêtez la pompe à vide et surveillez la pour vous assurer que le fonctionnement de l'usine reste stable.                                                                                                                                                                                                                                                                                                                                                       |

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         |              | Page 115 sur 207 |

## 7.4. Arrêt normal et ébouillantage

## 7.4.1. Généralités

L'acide envoyé dans l'évaporateur contient des quantités de saturation de gypse dissout et de sels de fluosilicate. Pendant l'évaporation de l'acide, la concentration de ces solides augmente de  manière  appréciable  en  entraînant  une  précipitation  continue  de  solides  sous  forme  de particules en suspension et de tartre adhérent.

Les particules en suspension s'écoulent avec l'acide produit et ont un impact négligeable sur les performances de l'évaporateur. Mais le tartre adhérent augmente progressivement en épaisseur et a plusieurs effets néfastes sur les performances de l'évaporateur. Lorsqu'il se forme sur les surfaces de transfert de chaleur, il agit en tant qu'isolant et, par conséquent, réduit la transmission de chaleur entre la vapeur et l'acide. Lorsque l'épaisseur du tartre s'accumule sur les surfaces internes des tubes du chauffage, elle réduit le débit de liquide pompé dans les tubes. Lorsque du tartre se forme sur les parois internes du bouilleur, il peut s'effriter et passer dans la pompe de circulation et, si les particules sont assez petites pour traverser le filtre, elles circulent vers les tubes du chauffage et ont tendance à limiter davantage le débit de liquide dans le chauffage.

Les difficultés susmentionnées indiquent le besoin évident d'augmenter la pression du côté de la coquille du chauffage de l'évaporateur afin de maintenir la capacité nominale de l'évaporateur. Le taux  de  formation  de  tartre  a  tendance  à  augmenter  avec  le  temps  et,  tôt  ou  tard,  il  devient nécessaire d'arrêter et d'ébouillanter l'ensemble de l'unité.

## 7.4.2. Arrêt normal

Dans la plupart des cas, un arrêt normal est requis afin de réaliser un ébouillantage normal. Même lorsque  la  raison  principale  d'un  arrêt  normal  n'est  pas  liée  à  un  besoin  d'ébouillantage  (par exemple,  le  manque  d'acide  d'alimentation  ou  de  stockage  d'acide  évaporé),  il  convient généralement de faire suivre l'arrêt d'un ébouillantage.

Un arrêt  normal  implique :  l'arrêt  du  débit  d'acide,  l'arrêt  du  débit  de  vapeur  de  chauffage,  le relâchement du vide dans le système d'évaporateur et la vidange de contenu de l'évaporateur dans le stockage d'acide à 54 %.

En règle générale, arrêtez l'échelon d'évaporation de la manière suivante :

1. Vérifiez le niveau dans le réservoir de clarification à 54 % pour vous assurer qu'il peut accepter environ 180 m 3  d'acide provenant de l'évaporateur.
2. Arrêtez la pompe d'alimentation de l'évaporateur.
3. Arrêtez la pompe d'acide concentré.
4. Arrêtez le débit de vapeur à basse pression vers le chauffage de l'évaporateur.
5. Arrêtez la pompe de condensat.
6. Réduisez progressivement le vide dans le système, d'abord en mode automatique, puis en ouvrant manuellement la vanne de purge d'air.
7. Arrêtez le débit de condensat de traitement vers le condensateur de l'évaporateur
8. Arrêtez la pompe de circulation de l'évaporateur. Pour dissiper la chaleur résiduelle dans l'échangeur de chaleur, la pompe de circulation devrait continuer à fonctionner pendant au moins 30 minutes après avoir arrêté le débit de vapeur à basse pression.
9. À  l'aide  de  la  pompe  de  vidange  d'évaporateur,  pompez  complètement  le  système d'évaporateur (bouilleur et échangeur de chaleur) via le bassin de distribution à 54 % du clarificateur dans le réservoir de clarification à 54 %.

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         | AFC1         | Page 116 sur 207 |

## 7.4.3. Ébouillantage

Le tartre de gypse et de sel de fluosilicate qui se dépose sur les surfaces internes de l'évaporateur n'est  que  légèrement  soluble  dans  l'eau.  L'eau  ambiante  circulant  dans  un  évaporateur  peut dissoudre le tartre, mais très lentement. Le tartre est plus soluble dans l'eau chaude que dans l'eau froide ;  par  conséquent, le fait de chauffer l'eau en circulation pourrait réduire dans une certaine mesure le temps de détartrage. L'ébullition réelle de l'eau en circulation augmente la turbulence et, par conséquent, réduirait davantage le temps de détartrage. Enfin, l'ajout d'acide sulfurique dans l'eau en circulation à environ 5 % du poids produit un niveau de pH plus favorable (inférieur à 1,0) pour dissoudre le tartre et réduit le temps d'ébouillantage requis à une durée raisonnable (entre 8 et 16 heures).

L'ébouillantage prévu doit avoir lieu environ une fois toutes les deux ou trois semaines. Chaque ébouillantage  doit  être  minutieux  et  complet  pour  que  l'unité  soit  détartrée  à  la  fin  de l'ébouillantage.

La formation de tartre se produit à deux endroits principaux sur les parois internes des tubes de  l'échangeur  de  chaleur  et  sur  les  parois  internes  du  le  bouilleur.  Un  nettoyage  idéal  doit complètement dissoudre tout le tartre dans la solution d'ébouillantage. Un nettoyage pratique élimine tout le tartre sur les parois mais redépose du tartre libre mais non dissout dans la conduite inférieure de circulation horizontale située avant le filtre. Ce tartre libre peut être évacué via les trous d'homme situés en face de la pompe de circulation après le drainage des unités.

Dans la plupart des cas, un arrêt normal est suivi d'un ébouillantage normal et tout l'acide doit être drainé du le bouilleur et du chauffage. En option, l'équipement peut simplement être rincé à l'eau. Des raccords d'eau de traitement sont prévus aux endroits suivants :

- vers la conduite d'alimentation de l'évaporateur
- vers le bouilleur (à l'aide d'un grand pulvérisateur)
- vers le séparateur d'entraînement (à l'aide d'un grand pulvérisateur)

Suite  à  un  arrêt  normal,  un  ébouillantage  normal  (sans  acide  sulfurique)  utilise  la  séquence suivante :

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         |              | Page 117 sur 207 |

|   ZONE DE CONCENTRATION PROCÉDURE D'ÉBOUILLANTAGE | ZONE DE CONCENTRATION PROCÉDURE D'ÉBOUILLANTAGE                                | ZONE DE CONCENTRATION PROCÉDURE D'ÉBOUILLANTAGE                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|---------------------------------------------------|--------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|                                                 1 | Préparez l'ébouillantage                                                       | Attendez au moins une heure après l'arrêt normal et pompez l'unité pour la laisser refroidir. Fermez le robinet de vidange entre le chauffage et le bouilleur et ouvrez l'évent atmosphérique situé sur le chauffage. Fermez la vanne de purge manuelle sur la boucle de contrôle du vide. Fermez la vanne vers la pompe de vidange de l'évaporateur. Fermez la vanne dans la conduite de débordement du bouilleur.                                                                                        |
|                                                 2 | Inspectez le haut du chauffage                                                 | Ouvrez le trou d'homme dans la chambre supérieure de liquide du chauffage de l'évaporateur et vérifiez que les tubes ne sont pas bouchés. Avant l'ébouillantage, la matière dans le système est généralement molle. Toutefois, après l'ébouillantage, la matière dans le système est généralement collée et difficile à éliminer. Nettoyez les obstructions à l'aide d'une lance à eau à haute pression.                                                                                                   |
|                                                 3 | Remplissez le bouilleur d'eau                                                  | Vous pouvez ajouter de l'eau de traitement via la connexion dans la conduite d'alimentation et/ou la connexion du pulvérisateur dans le bouilleur et le séparateur d'entraînement. Ajoutez de l'eau jusqu'à ce que le niveau soit un mètre au-dessus du niveau de débordement. Vous pouvez vérifier cela en ouvrant les vannes dans la conduite de débordement et la conduite de prélèvement sur l'évacuation de la pompe à produit de l'évaporateur. Fermez ces vannes lorsque l'eau a atteint ce niveau. |
|                                                 4 | Démarrez la pompe de circulation de l'évaporateur                              | Vérifiez le bon fonctionnement du système d'étanchéité mécanique et ouvrez l'eau de barrage avec la pompe avant le démarrage.                                                                                                                                                                                                                                                                                                                                                                              |
|                                                 5 | Faites couler le condensat de traitement vers le condensateur de l'évaporateur | Réglez le débit sur la valeur normale.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|                                                 6 | Préparez le débit de démarrage                                                 | Fermez l'évent atmosphérique sur le chauffage et ouvrez le robinet de vidange situé entre le chauffage et le bouilleur. Configurez le contrôleur de pression de l'évaporateur sur une pression absolue d'environ 290 mm Hg. Cela permet de s'assurer que la température n'augmente pas trop.                                                                                                                                                                                                               |
|                                                 7 | Démarrez le débit de vapeur vers le chauffage                                  | Démarrez le débit de vapeur à basse pression vers le chauffage à bas régime (environ 2 000 kg/h). Ajustez le débit de vapeur selon les besoins pour faire bouillir l'eau (à 75°C environ) dans un délai de trois heures maximum (4 000 à 5000 kg/h prévus). Observez et notez régulièrement la température dans la branche inférieure du bouilleur ( TI-244 Ensemble J, TI-344 Ensemble K, TI-444 Ensemble L)                                                                                              |
|                                                 8 | Procédez à l'ébouillantage pendant la durée souhaitée                          | Prolongez la circulation dans l'évaporateur et le débit de vapeur pendant environ 8 heures, en maintenant la température à environ 75°C. Si vous souhaitez atteindre une température plus élevée, augmentez la pression du système en conséquence, mais ne dépassez pas 85°C. Ajoutez de l'eau de traitement via la buse de pulvérisation, tel que nécessaire pour maintenir le niveau                                                                                                                     |
|                                                 9 | Arrêtez l'ébouillantage                                                        | Arrêtez la vapeur à basse pression vers le chauffage Cassez le vide en mettant le contrôle de pression en mode manuel et en ouvrant lentement la vanne de purge d'air jusqu'à ouverture complète                                                                                                                                                                                                                                                                                                           |

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         | AFC1         | Page 118 sur 207 |

| ZONE DE CONCENTRATION PROCÉDURE D'ÉBOUILLANTAGE   | ZONE DE CONCENTRATION PROCÉDURE D'ÉBOUILLANTAGE   | ZONE DE CONCENTRATION PROCÉDURE D'ÉBOUILLANTAGE                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|---------------------------------------------------|---------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 10 Pompez le                                      | système                                           | Vérifiez le bon fonctionnement du système d'étanchéité mécanique de la pompe et ouvrez valve sur la conduite allant vers la pompe de vidange d'évaporateur et fermez la vanne de refoulement. Démarrez la pompe et ouvrez lentement la vanne de refoulement pour transférer la solution de lavage vers le réservoir d'eau de lavage Il est recommandé de rincer occasionnellement la pompe à produit et la tuyauterie à ce stade en pompant la solution de lavage vers la section de lavage du bassin de distribution à 54 %                       |
| Inspectez le système                              |                                                   | 11 Une fois le drainage terminé, ouvrez et inspectez ce qui suit : la section horizontale de la conduite de circulation sous le chauffage. Vérifiez qu'il n'y ait pas de tartre. Rincez avec le flexible d'eau. le filtre nettoyez selon les besoins Abaissez le trou d'homme sur le bouilleur. Inspectez la cuve et le dispositif d'arrêt du tourbillon. Les trous d'homme en haut et en bas du chauffage. Inspectez les tubes pour voir s'ils sont tous ouverts. Dans le cas contraire, nettoyez à nouveau avec la lance à eau à haute pression. |
| 12 Effectuez la                                   | maintenance de routine C'est le moment            | idéal pour entretenir et/ou nettoyer le chauffage, la pompe de circulation, les condensateurs, etc. conformément aux consignes du manufacturer.                                                                                                                                                                                                                                                                                                                                                                                                    |
| 13                                                | Préparez le démarrage                             | Fermez tous les trous d'homme et remettez les vannes en position de démarrage.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

## 7.5. Arrêt d'urgence

Même si un arrêt normal  permet généralement  de  réaliser  un ébouillantage  normal,  un  arrêt d'urgence  peut  être  requis  dans  plusieurs  circonstances.  En  outre,  alors  qu'un  arrêt  normal présente l'avantage d'être planifié et supervisé, un arrêt d'urgence peut nécessiter une action immédiate de la part d'un opérateur seul.

Les circonstances exigeant un arrêt d'urgence sont imprévisibles, mais les exemples suivants indiquent certaines causes potentielles : la perte de vide, la perte de circulation d'acide, la perte d'alimentation d'acide, la rupture d'un tube de chauffage, la rupture d'une conduite, une panne de courant, la perte d'alimentation d'eau  de  refroidissement, la perte de  vapeur,  la perte d'alimentation d'air de l'instrument et la défaillance de la pompe d'acide produit.

Étant donné que les causes potentielles d'initiation d'un arrêt d'urgence sont nombreuses, il n'est pas  pratique  de  fournir  des  procédures  d'arrêt  progressives  qui  s'adapteraient  à  toutes  les situations d'urgence. Par conséquent, ce manuel ne présente que certaines directives générales pour gérer un arrêt d'urgence.

Seules  certaines  urgences  présentent  un  danger.  Certaines  mesures  d'urgence  sont  déjà préprogrammées dans les dispositifs de contrôle de l'usine et le fait de connaître de manière générale les différentes boucles de contrôle est utile.

Certaines directives d'arrêt d'urgence incluent :

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         | AFC1         | Page 119 sur 207 |

1. l'arrêt du débit de vapeur à basse pression vers l'échangeur de chaleur immédiatement dans une situation d'arrêt d'urgence.
2. Arrêtez l'alimentation d'acide à 28 % vers l'évaporateur immédiatement après avoir arrêté le débit de vapeur.
3. Si possible, laissez fonctionner la pompe de circulation pour éviter de surchauffer l'acide à l'intérieur des tubes de chauffage (en raison de la chaleur résiduelle dans la masse des tubes et la plaque tubulaire).
4. Si  possible,  maintenez  le  vide  dans  le  système  pour  induire  un  refroidissement  par vaporisation  de  l'acide  et  limiter  le  risque  de  points  chauds  localisés  qui  pourraient endommager la membrane en caoutchouc.
5. Arrêtez la pompe à condensat lorsque le débit de condensat est terminé.
6. S'il  est  nécessaire  d'arrêter  l'évaporateur  pendant  une  période  prolongée,  drainez l'évaporateur comme pour un ébouillantage.

Le  démarrage après un arrêt d'urgence pourrait  consister simplement  à  réinitialiser  quelques contrôleurs et à ouvrir une ou deux vannes pour la remise en service. En revanche, le démarrage pourrait impliquer un ébouillantage complet et des réparations de maintenance éventuelles de l'équipement affecté.

La  première  étape  lors  du  démarrage  après  un  arrêt  d'urgence  est  un  diagnostic  visant  à déterminer  quel  évènement  a  initié  l'arrêt  d'urgence  et  quels  dommages  accidentels,  le  cas échéant, ont pu se produire en raison de l'arrêt.

Concernant  un  arrêt  pour  lequel  la  cause  est  évidente  et  facilement  corrigée  en  suivant  les procédures normales, le démarrage devrait correspondre aux compétences de l'opérateur. Ces arrêts  peuvent  être  dus  à  un  interverrouillage  automatique,  à  la  position  de  sécurité  d'un instrument ou à une perte temporaire d'alimentation ou d'utilités.

Lorsque  des  dommages  mécaniques  sont  évidents,  l'opérateur  devrait  différer  le  démarrage jusqu'à ce que ces dommages aient été réparés. Une rupture d'un tube de chauffage, une rupture de conduite ou un moteur de pompe grillé sont des exemples de situations exigeant de différer le démarrage, ce qui peut impliquer de drainer l'évaporateur avec ou sans ébouillantage.

Le cas extrême de démarrage après un arrêt d'urgence implique :

1. un arrêt complet
2. un ébouillantage normal
3. des réparations mécaniques ou le remplacement de l'équipement
4. un test de l'eau et sous vide de l'équipement réparé
5. le démarrage

| JACOBS   | Usine de production d'acide phosphorique Manuel Opératoire   | Document :   | Rév. : C         |
|----------|--------------------------------------------------------------|--------------|------------------|
| AFC1     | AFC1                                                         |              | Page 120 sur 207 |

## 7.6. Dépannage

| Problème                                                                               | Cause possible                                                                                                                                                                      | Mesure                                                                                                                                                                                 |
|----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Impossible de réaliser le vide                                                         | 1. Fuite d'air excessive 2. Débit insuffisant de condensat de traitement vers le condensateur de l'évaporateur 3. Débit insuffisant de condensat de traitement vers la pompe à vide | 1. Inspectez les ouvertures, les tuyaux vendus, les vannes qui fuient 2. Vérifiez le débit, les pulvérisateurs 3. Vérifiez le débit, les crépines, les orifices de restriction         |
| Transfert excessif de P 2 O 5 (détecté dans le débordement du réservoir d'étanchéité ) | 1. Niveau élevé dans le bouilleur 2. Conditions de fonctionnement instables                                                                                                         | 1. Vérifiez l'instrument de niveau (LAH-241, LAH-341 et LAH-441 pour les échelons J, K et L respectivement) 2. Vérifiez l'état du système vapeur 3. Vérifiez l'état du système de vide |
| Taux de production faible                                                              | 1. Dilution de l'eau 2. Coquille du chauffage inondée 3. Conduites bouchées ou trop de tartre sur les tubes de chauffage                                                            | 1. Vérifiez le débit d'eau de barrage des pompes et le fonctionnement des garnitures. 2. Inspectez le système de condensat 3. Lavez l'évaporateur                                      |
| Conductivité élevée dans le récepteur de condensat                                     | Des tubes de l'échangeur de chaleur fuient ou sont cassés                                                                                                                           | Arrêtez et testez à l'eau des tubes de chauffage. Réparez les tubes cassés.                                                                                                            |
| Conductivité élevée après le refroidisseur de condensat                                | Fuites dans le refroidisseur de condensat                                                                                                                                           | Contournez et réparez lors du prochain arrêt.                                                                                                                                          |

Pour dépanner les pompes et les ventilateurs, consultez les directives en Annexe.