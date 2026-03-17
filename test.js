// ---------------------------
//       VARIABLES GLOBALES
// ---------------------------
let reponses = [];
let experimentalSequenceIndex = -1;
let questionIndex = -1;
let startTimeQuestion = 0;
let experimentalSequence = [];
let currentTextRevisits = 0;
let clickedLinksInCurrentText = new Set();
let currentReadingDuration = 0;

// ---------------------------
//   CONFIGURATION DES TEXTES
// ---------------------------
// Note : Assure-toi d'avoir bien 30 spans par texte pour la condition C3/C4
const baseTexts = [
    {
        id: "Warhammer",
        content: `Dans un <span class="link distracteur">futur</span> lointain, aux limites de l'<span class="link distracteur">Ultima Segmentum</span>, le 
    <span class="link distracteur">système</span> oublié de <span class="link distracteur">Morologus Novem</span> 
    <span class="link distracteur">refait</span> surface <span class="link distracteur">près</span> 
    de la <span class="link distracteur">Cicatrix Maledictum</span>. Après la chute de <span class="link required">Cadia</span>, une <span class="link distracteur">flotte</span> 
    de l’<span class="link required">Adeptus Mechanicus</span> y échoue, <span class="link distracteur">découvrant</span> les 
    <span class="link distracteur">vestiges</span> d’une <span class="link distracteur">civilisation</span>
     <span class="link distracteur">humaine</span> avancée. Ce secteur, <span class="link distracteur">stratégique</span> et 
     troublé par les <span class="link distracteur">marées</span> du Warp, attire l’Empire, les <span class="link distracteur">Orks</span>, 
     le <span class="link distracteur">Chaos</span> et même les <span class="link required">Nécrons</span>, tous en <span class="link distracteur">quête</span> d’un 
     <span class="link distracteur">artéfact</span> mystérieux <span class="link distracteur">enfoui</span> sous sa <span class="link distracteur">surface</span>. 
     Les <span class="link distracteur">factions</span> s’affrontent pour <span class="link distracteur">contrôler</span> ce point clé,
     situé entre l’<span class="link distracteur">Imperium Sanctus</span> et l’<span class="link required">Imperium Nihilus</span>, 
      tandis que son <span class="link distracteur">destin</span> reste incertain, caché dans les <span class="link distracteur">ombres</span> 
      du <span class="link required">Warp</span>.`,

        questions: [
            { q: "Quels spécialistes religieux s'occupent de la technologie et des machines ?", p: ["Le Chaos", "Des prêtres", "Les Orks", "Les Nécrons"], r: "Des prêtres" },
            { q: "Quel monde servait de rempart avant d'être détruit, provoquant une faille géante ?", p: ["Morologus Novem", "Terra", "Cadia", "Mars"], r: "Cadia" },
            { q: "Quelle menace est composée de guerriers de métal ayant vécu avant les humains ?", p: ["L'Empire", "Les Nécrons", "La Flotte", "Le Destin"], r: "Les Nécrons" },
            { q: "Quelle partie de l'empire humain est à moitié isolée et plongée dans le noir ?", p: ["L'Ultima Segmentum", "L'Imperium Sanctus", "La Surface", "L'Imperium Nihilus"], r: "L'Imperium Nihilus" },
            { q: "Comment appelle-t-on la dimension instable utilisée pour les voyages spatiaux ?", p: ["Le Warp", "La Cicatrix", "Le Système", "L'Artéfact"], r: "Le Warp" }
        ],

        links: [
            { name: "Cadia", info: "Une planète forteresse dont la destruction a provoqué une faille géante." },
            { name: "Adeptus Mechanicus", info: "Une organisation de prêtres qui vénèrent et réparent les machines." },
            { name: "Nécrons", info: "Des squelettes de métal immortels qui dorment sous terre depuis des millions d'années." },
            { name: "Imperium Nihilus", info: "La moitié de l'empire humain isolée et sans défense de l'autre côté de la faille." },
            { name: "Warp", info: "Une dimension parallèle folle servant de raccourci pour voyager entre les étoiles." },
            { name: "futur", info: "Un temps très éloigné (l'an 40 000) où la survie est un combat quotidien." },
            { name: "Ultima Segmentum", info: "La région la plus vaste et la plus lointaine de l'espace humain." },
            { name: "système", info: "Un groupe de planètes tournant autour d'une étoile." },
            { name: "Morologus Novem", info: "Le nom du groupe de planètes où l'histoire se déroule." },
            { name: "refait", info: "L'action de réapparaître après avoir été perdu pendant des siècles." },
            { name: "près", info: "À une distance réduite d'un danger spatial majeur." },
            { name: "Cicatrix Maledictum", info: "Une déchirure géante qui coupe la galaxie en deux comme une cicatrice." },
            { name: "flotte", info: "Un grand groupe de vaisseaux spatiaux voyageant ensemble." },
            { name: "découvrant", info: "Trouver par hasard des secrets ou des lieux oubliés." },
            { name: "vestiges", info: "Les ruines et les restes d'une époque glorieuse passée." },
            { name: "civilisation", info: "Une société organisée avec sa propre culture et technologie." },
            { name: "humaine", info: "L'espèce originaire de la Terre qui tente de dominer les étoiles." },
            { name: "stratégique", info: "Un lieu crucial pour gagner une guerre ou surveiller l'ennemi." },
            { name: "marées", info: "Des courants d'énergie invisibles qui rendent la navigation dangereuse." },
            { name: "Orks", info: "Des extraterrestres verts et costauds qui ne pensent qu'à se battre." },
            { name: "Chaos", info: "Des forces maléfiques vivant dans une autre dimension et cherchant à tout corrompre." },
            { name: "quête", info: "Une recherche difficile pour obtenir un objet de grande valeur." },
            { name: "artéfact", info: "Un objet ancien très puissant dont on ne comprend pas tout le fonctionnement." },
            { name: "enfoui", info: "Caché profondément sous le sol d'une planète." },
            { name: "surface", info: "Le sol extérieur d'un monde, là où les armées débarquent." },
            { name: "factions", info: "Les différents groupes ou armées qui sont en compétition." },
            { name: "contrôler", info: "Prendre le commandement total d'une zone ou d'une ressource." },
            { name: "Imperium Sanctus", info: "La moitié de l'empire humain qui peut encore communiquer avec sa capitale." },
            { name: "destin", info: "L'avenir inévitable ou le sort final de ce système solaire." },
            { name: "ombres", info: "Les menaces cachées ou les secrets que personne ne voit venir." }
        ]
    },
    {
        id: "NieR",
        content: `En l’an <span class="link distracteur">11 945</span>, la Terre en <span class="link distracteur">ruines</span> est <span class="link distracteur">occupée</span> par des <span class="link required">machines extraterrestres</span> qui ont <span class="link distracteur">contraint</span> les <span class="link distracteur">humains</span> à se <span class="link distracteur">réfugier</span> sur la <span class="link distracteur">Lune</span>. 
    Pour <span class="link distracteur">reconquérir</span> la planète, l’humanité déploie des <span class="link distracteur">androïdes soldats</span> comme <span class="link required">2B</span>, <span class="link distracteur">9S</span>, <span class="link distracteur">A2</span>, 
    chargés de <span class="link required">combattre les machines</span> et de <span class="link distracteur">sécuriser</span> les <span class="link distracteur">vestiges</span> du <span class="link distracteur">monde humain</span>. 
    À travers leurs <span class="link required">missions</span> dans des <span class="link distracteur">cités abandonnées</span>, 
    des <span class="link distracteur">forêts</span> <span class="link distracteur">envahies</span> par la <span class="link distracteur">nature</span> et d’anciennes <span class="link distracteur">installations industrielles</span>, 
    ils affrontent des formes de <span class="link distracteur">vie mécaniques</span> toujours plus <span class="link distracteur">complexes</span>. 
    Mais au fil des <span class="link distracteur">combats</span> et des <span class="link distracteur">découvertes</span>, ils mettent au jour des <span class="link required">vérités troublantes</span> sur la <span class="link distracteur">guerre</span>, 
    les machines et le <span class="link distracteur">rôle réel</span> des androïdes dans ce conflit.`,

        questions: [
            { q: "Quand est-ce que les machines extraterrestres ont envahi la Terre ?", p: ["En 11045", "2e Guerre des Machines", "En 1945", "1ère Guerre des Machines"], r: "1ère Guerre des Machines" },
            { q: "Quel personnage est reconnu pour son efficacité ?", p: ["C3", "2B", "9S", "A2"], r: "2B" },
            { q: "Quel est l'équipement des androïdes ?", p: ["Laser orbital, bras disqueuse, roquettes", "Fusils plasma, bouclier tactique, mini drone", "Armes de mêlée, pods de soutien, piratage", "Fusil de précision, soutien d'artillerie, essaim de drones"], r: "Armes de mêlée, pods de soutien, piratage" },
            { q: "Quelle vérité troublante découvrent les androïdes ?", p: ["Les robots sont des humains enfermés dans une armure autonome", "Les extraterrestres sont en réalité des humains d'une autre faction", "Les aliens créateurs des machines ont été tués", "Les androïdes sont des machines extraterrestres déviantes"], r: "Les aliens créateurs des machines ont été tués" },
            { q: "Quel type de mission font les androïdes ?", p: ["Soutien et sécurisation", "Exploration et recherche", "Assassinat et espionnage", "Reconnaissance et attaque"], r: "Soutien et sécurisation" }
        ],
        links: [
            { name: "machines extraterrestres", info: "Les Machines, apparues lors de la 1ère Guerre des Machines, sont devenues des fantassins redoutablement efficaces dans la guerre interminable contre les Androïdes." },
            { name: "2B", info: "2B est une androïde de combat, connue pour son efficacité et son apparence élégante." },
            { name: "vérités troublantes", info: "Les androïdes ont découvert, dans l'un des vaisseaux aliens, que les aliens à l'origine des machines ont été tués par des machines extraterrestres." },
            { name: "combattre les machines", info: "Les Androïdes sont envoyés sur Terre pour combattre les Machines et tenter de reprendre le contrôle de la planète. Ils sont équipés d'armes de mêlée, de pods de soutien et de piratage." },
            { name: "missions", info: "Les missions des Androïdes incluent le soutien et la sécurisation entre autres missions diverses." },
            { name: "9S", info: "9S est un androïde de reconnaissance de type YoRHa, curieux et intelligent, spécialisé dans le piratage." },
            { name: "A2", info: "A2 est un androïde de combat de type YoRHa, rebelle et mystérieuse, avec un passé sombre." },
            { name: "rôle réel", info: "Le rôle réel des Androïdes dans le conflit est complexe et évolue au fil de l'histoire, révélant des aspects surprenants de leur nature et de leur place dans la guerre." },
            { name: "guerre", info: "La guerre est un conflit durant depuis plus de cinq millénaires ; les humains réfugiés sur la Lune envoient des ordres." },
            { name: "découvertes", info: "Au fil des combats, les Androïdes font des découvertes qui remettent en question leur compréhension de la guerre, des Machines et de leur propre existence." },
            { name: "combats", info: "Les combats entre les Androïdes et les Machines sont intenses et variés, se déroulant dans des environnements allant des cités abandonnées aux forêts envahies par la nature." },
            { name: "vie mécaniques", info: "Les formes de vie mécaniques sont des créatures artificielles, souvent plus puissantes et plus résistantes que leurs homologues biologiques." },
            { name: "complexes", info: "Les formes de vie mécaniques deviennent de plus en plus complexes au fil de l'histoire, présentant des défis croissants pour les Androïdes." },
            { name: "installations industrielles", info: "Les anciennes installations industrielles sont des lieux où les Androïdes affrontent des formes de vie mécaniques, souvent remplis de dangers et de mystères." },
            { name: "nature", info: "La nature envahie est un environnement où la végétation a repris le dessus, créant des obstacles et des cachettes pour les Machines." },
            { name: "envahies", info: "Les forêts envahies sont des zones où la nature a repris le dessus, créant des obstacles et des cachettes pour les Machines." },
            { name: "cités abandonnées", info: "Les cités abandonnées sont des lieux où les Androïdes affrontent des formes de vie mécaniques, souvent remplis de dangers et de mystères." },
            { name: "monde humain", info: "Le monde humain est le lieu d'origine de l'humanité, désormais en ruines et occupé par les Machines." },
            { name: "sécuriser", info: "Les Androïdes sont chargés de sécuriser les vestiges du monde humain, protégeant les ressources et les informations précieuses contre les Machines." },
            { name: "vestiges", info: "Les vestiges du monde humain sont des lieux et des objets laissés derrière par l'humanité, souvent riches en ressources et en informations sur le passé." },
            { name: "forêts", info: "Les forêts envahies sont des zones où la nature a repris le dessus, créant des obstacles et des cachettes pour les Machines." },
            { name: "androïdes soldats", info: "Les Androïdes soldats sont des unités de combat créées pour affronter les Machines et tenter de reprendre le contrôle de la Terre." },
            { name: "Lune", info: "La Lune est le refuge de l'humanité après l'invasion des Machines, où les survivants vivent en attendant de pouvoir reconquérir la Terre." },
            { name: "11 945", info: "L'année 11 945 marque une période où la Terre est en ruines et occupée par les Machines, avec l'humanité réfugiée sur la Lune." },
            { name: "ruines", info: "La Terre en ruines est le résultat de l'invasion des Machines, avec des paysages dévastés et des vestiges de la civilisation humaine." },
            { name: "occupée", info: "La Terre est occupée par les Machines, qui ont pris le contrôle de la planète et contraint l'humanité à se réfugier sur la Lune." },
            { name: "contraint", info: "L'humanité a été contrainte de se réfugier sur la Lune en raison de l'invasion des Machines et de la destruction de la Terre." },
            { name: "reconquérir", info: "L'humanité cherche à reconquérir la Terre en envoyant des Androïdes soldats pour combattre les Machines et sécuriser les vestiges du monde humain." },
            { name: "humains", info: "Les humains sont les survivants de l'invasion des Machines, vivant sur la Lune en attendant de pouvoir reconquérir la Terre." },
            { name: "réfugier", info: "L'humanité a été contrainte de se réfugier sur la Lune en raison de l'invasion des Machines et de la destruction de la Terre." }
        ]
    },
    {
        id: "Game of Rols",
        content: `Quatre héros partent pour une <span class="link distracteur">île</span> mystérieuse : <span class="link required">Archibald</span> (le <span class="link distracteur">marchand</span>), 
    Evy (l'archéologue) qui <span class="link distracteur">tente</span> de fuir son <span class="link distracteur">passé</span>.
     L'<span class="link required">archéologue</span> porte une <span class="link distracteur">rune</span>, tandis que Raoul (le <span class="link distracteur">barde</span>) <span class="link distracteur">chante</span> 
     ses <span class="link distracteur">exploits</span> dans des <span class="link distracteur">tavernes</span> sombres. Au centre de leurs <span class="link distracteur">tourments</span>, 
     le jeune <span class="link required">Mimolin</span> (l'orphelin amnésique) <span class="link distracteur">cherche</span> désespérément à <span class="link distracteur">comprendre</span> 
     ses <span class="link distracteur">flash-backs</span>. Ils <span class="link distracteur">traversent</span> des <span class="link distracteur">régions</span> isolées où
      <span class="link required">Raoul</span> compose ses <span class="link distracteur">poèmes</span>, évitant les <span class="link distracteur">dragons</span> et les
       <span class="link distracteur">assassins</span> de la <span class="link distracteur">guilde</span>. Enfin, sous le <span class="link distracteur">palais</span> 
       du <span class="link distracteur">maharaja</span>, ils découvrent la mystérieuse <span class="link distracteur">Omelas</span>, une <span class="link distracteur">créature</span> dont la 
       <span class="link required">destinée</span> <span class="link distracteur">inquiète</span> les <span class="link distracteur">dieux</span> eux-mêmes.`,

        questions: [
            { q: "Quel est le tic nerveux du marchand ?", p: ["Fait craquer ses doigts", "Se gratter", "Cligner les yeux", "Bouger la jambe"], r: "Fait craquer ses doigts" },
            { q: "Quel objet insolite Evy collectionne-t-elle ?", p: ["Plumes de corbeau", "Pierre de lune", "Livre de sorts", "Baguette magique"], r: "Plumes de corbeau" },
            { q: "Qui garde précieusement un médaillon en argent ?", p: ["Mimolin", "Archibald", "Evy", "Raoul"], r: "Mimolin" },
            { q: "Quelle est la particularité de la guitare de Raoul ?", p: ["Elle est en bois d'ébène enchanté", "Elle est en or", "Elle a une tête argentée", "Elle a des cordes en soie"], r: "Elle est en bois d'ébène enchanté" },
            { q: "Quelle est la véritable nature d'Omelas ?", p: ["Une créature enfermée sous le palais", "Un esprit maléfique destiné à tuer qui la regarde", "Le fantôme de l'île Amaru", "Un dieu ancien qui aide nos 4 héros"], r: "Une créature enfermée sous le palais" }
        ],

        links: [
            { name: "Archibald", info: "Héritier de la famille Brisant-Choyeur, il a un tic nerveux : il fait craquer ses doigts quand il est stressé." },
            { name: "archéologue", info: "Archéologue maudite, elle collectionne les plumes de corbeau, pensant qu'elles portent chance." },
            { name: "Mimolin", info: "Bien qu'amnésique, il garde précieusement un médaillon en argent en forme de lune, seul vestige de sa famille." },
            { name: "Raoul", info: "Barde célèbre, il possède une guitare secrètement sculptée dans du bois d'ébène enchanté." },
            { name: "destinée", info: "Loin d'être un monstre, Omelas est une entité vivante et pensante faite de lumière pure, emprisonnée sous le palais." },
            { name: "île", info: "L'île Amaru est entourée d'eau empoisonnée. Elle se situe proche de l'île Lafait." },
            { name: "tente", info: "Elle a du mal car ses pensées sont trop sombres." },
            { name: "passé", info: "Elle a dû quitter l'île Lafait à cause d'un problème d'argent." },
            { name: "rune", info: "Symbole magique ancien qui lui permet de lancer des sorts." },
            { name: "chante", info: "Il chante des musiques en jouant d'un instrument." },
            { name: "exploits", info: "Ses musiques racontent ses aventures dans ce monde fantastique." },
            { name: "tavernes", info: "La taverne du Dragon Noir est un lieu où les assassins se rassemblent." },
            { name: "tourments", info: "Ils sont encore sous l'emprise d'un sort." },
            { name: "cherche", info: "Il veut comprendre ce qui lui arrive." },
            { name: "comprendre", info: "Il cherche à donner un sens à ses pensées." },
            { name: "flash-backs", info: "Il a des souvenirs soudains et vifs de sa famille assassinée." },
            { name: "traversent", info: "Ils se baladent dans tous types de paysages (montagnes, plaines, forêts, etc.)." },
            { name: "régions", info: "Les régions ne sont pas très connues car dangereuses pour la plupart des gens." },
            { name: "poèmes", info: "Il écrit des poèmes sur ses aventures." },
            { name: "dragons", info: "Créatures légendaires dont la taverne tire son nom : Taverne du Dragon Noir." },
            { name: "assassins", info: "Tueurs professionnels qui ont assassiné la famille du pauvre Mimolin." },
            { name: "guilde", info: "Association de professionnels chassant les créatures les plus féroces." },
            { name: "palais", info: "Demeure somptueuse du souverain de l'île Amaru." },
            { name: "créature", info: "Omelas est une créature de lumière." },
            { name: "Omelas", info: "Elle est une vieille créature dangereuse, âgée de plus de 10 000 ans." },
            { name: "inquiète", info: "Elle inquiète les dieux car elle risque d'engloutir les humains vivant à côté d'elle." },
            { name: "dieux", info: "Entités supérieures qui dirigent le monde de Rols." },
            { name: "marchand", info: "Il fait du commerce pendant ses aventures." },
            { name: "barde", info: "Il fait de la musique et raconte ses aventures." },
            { name: "maharaja", info: "Le souverain de l'île Amaru." }
        ]
    },
    {
        id: "Lovely Complex",
        content: `Lovely Complex est l'histoire d'une <span class="link distracteur">relation</span> entre deux personnages <span class="link distracteur">complexés</span> par leur taille : <span class="link required">Risa Koizumi</span>, <span class="link distracteur">jeune</span> fille mesurant 170 cm ; et <span class="link required">Atsushi Ootani</span> haut de 156 cm.
En raison de leur <span class="link distracteur">taille</span> et de leurs nombreuses <span class="link distracteur">chamailleries</span>, ces deux personnages sont comparés à un duo d'<span class="link distracteur">humoristes</span>, les All <span class="link required">Hanshin Kyojin</span>. Mais leur taille les empêche de s'<span class="link distracteur">épanouir</span> complètement : ils manquent de <span class="link distracteur">confiance</span> en eux pour ce qui est des <span class="link distracteur">relations</span> avec les <span class="link distracteur">personnes</span> du sexe opposé.
Durant les <span class="link distracteur">vacances</span> d'été, Risa et Atsushi tombent amoureux de <span class="link required">deux autres personnages</span> et décident de s'<span class="link distracteur">entraider</span> et de s'<span class="link distracteur">encourager</span> mutuellement pour <span class="link distracteur">vaincre</span> leurs <span class="link distracteur">complexes</span> et essayer de <span class="link distracteur">séduire</span> les <span class="link distracteur">élus</span> de leurs <span class="link distracteur">cœurs</span>... Mais il s'agit d'un <span class="link distracteur">échec</span> pour <span class="link distracteur">eux</span> deux.
Cependant, à <span class="link distracteur">force</span> de <span class="link distracteur">rester</span> aux côtés d'Atsushi et avec l'<span class="link distracteur">aide</span> de ses <span class="link required">amis</span>, Risa ne commence-t-elle pas à <span class="link distracteur">devenir</span> <span class="link distracteur">amoureuse</span> de lui ?`,
        questions: [
            { q: "De quel instrument joue le personnage principal ?", p: ["Guitare", "Piano", "Violon", "Saxophone"], r: "Saxophone" },
            { q: "Qui est Nobuko ?", p: ["La petite amie de Nakao", "La sœur de Risa", "La meilleure amie d'Atsushi", "La mère de Nakao"], r: "La petite amie de Nakao" },
            { q: "Qui est le membre du duo Hanshin Kyojin le plus petit ?", p: ["Hanshin", "Kyojin", "Nakao", "Atsushi"], r: "Hanshin" },
            { q: "Qui est la première amoureuse d'Atsushi ?", p: ["Chiharu Tanaka", "Mimi Kuroi", "Kanzaki", "Suzuki"], r: "Chiharu Tanaka" },
            { q: "Quel sport fait l'un des personnages ?", p: ["Football", "Basketball", "Tennis", "Natation"], r: "Basketball" }
        ],
        links: [
            { name: "Risa Koizumi", info: "Koizumi est une lycéenne passionnée de musique et membre du club de fanfare, où elle joue du saxophone, ce qui révèle son côté artistique et déterminé malgré ses complexes liés à sa taille." },
            { name: "Atsushi Ootani", info: "Atsushi Ootani, garçon populaire grâce à son poste dans l’équipe de basketball et complexé par sa taille (156 cm), forme avec Risa le duo All Hanshin-Kyojin ; il a du mal à comprendre ses sentiments pour Koizumi, finit par en tomber amoureux malgré ses prétendantes Mimi et Kanzaki, et compte Nakao et Suzuki parmi ses meilleurs amis, l’appelant parfois \"idiote\"." },
            { name: "amis", info: "Nakao est un garçon très mignon et gentil, toujours prêt à consoler ses amis et à mettre le doigt là où ça fait mal, provoquant souvent Ootani ; il est follement amoureux de sa petite amie Nobuko et décidé à passer sa vie avec elle." },
            { name: "Hanshin Kyojin", info: "Le duo comique All Hanshin-Kyojin est célèbre au Japon pour son humour basé sur le contraste de taille entre ses deux membres : l’un très petit (Hanshin) et l’autre très grand (Kyojin)." },
            { name: "deux autres personnages", info: "Risa Koizumi est d'abord amoureuse de Suzuki. Atsushi Ootani est d'abord amoureux de Chiharu Tanaka." },
            { name: "échec", info: "Risa et Atsushi échouent à séduire respectivement Suzuki et Chiharu à cause de leur taille, et se promettent alors de ne plus jamais aimer quelqu’un qui ne correspond pas à leur taille." },
            { name: "vacances", info: "Pendant les vacances d'été, Risa et Atsushi tombent amoureux de deux autres personnages et décident de s'entraider pour vaincre leurs complexes et essayer de séduire les élus de leurs cœurs, mais ils échouent tous les deux." },
            { name: "amoureuse", info: "À force de rester aux côtés d'Atsushi, Risa commence à développer des sentiments pour lui, réalisant qu'elle est amoureuse de lui malgré leurs complexes respectifs." },
            { name: "complexés", info: "Risa et Atsushi sont tous les deux complexés par leur taille : Risa mesure 170 cm, ce qui est considéré comme grand pour une fille, tandis qu'Atsushi mesure 156 cm, ce qui est considéré comme petit pour un garçon." },
            { name: "humoristes", info: "En raison de leur taille et de leurs nombreuses chamailleries, Risa et Atsushi sont souvent comparés à un duo d'humoristes japonais célèbres, les All Hanshin-Kyojin, connus pour leur contraste de taille." },
            { name: "confiance", info: "Risa et Atsushi apprennent à se faire confiance malgré leurs différences de taille, ce qui renforce leur relation." },
            { name: "relation", info: "La relation entre Risa et Atsushi évolue au fil du temps, passant de la simple amitié à une relation amoureuse profonde et sincère." },
            { name: "chamailleries", info: "Les chamailleries fréquentes entre Risa et Atsushi sont un aspect central de leur dynamique, ajoutant de l'humour et de la tension à leur relation." },
            { name: "encourager", info: "Risa et Atsushi s'encouragent mutuellement à surmonter leurs complexes et à poursuivre leurs objectifs, montrant l'importance du soutien dans une relation." },
            { name: "séduire", info: "Risa et Atsushi tentent de séduire respectivement Suzuki et Chiharu, mais échouent à cause de leurs complexes liés à leur taille." },
            { name: "épanouir", info: "Risa et Atsushi ont du mal à s'épanouir pleinement en raison de leurs complexes liés à leur taille, ce qui affecte leur confiance en eux et leurs interactions avec les autres." },
            { name: "devenir", info: "Au fil de l'histoire, Risa et Atsushi développent des sentiments l'un pour l'autre, réalisant qu'ils sont amoureux malgré leurs complexes respectifs." },
            { name: "eux", info: "Risa et Atsushi finissent par tomber amoureux l'un de l'autre malgré leurs différences de taille et leurs complexes respectifs." },
            { name: "coeurs", info: "Risa et Atsushi tentent de séduire respectivement Suzuki et Chiharu, mais échouent à cause de leurs complexes liés à leur taille, ce qui les pousse à se tourner l'un vers l'autre." },
            { name: "vaincre", info: "Risa et Atsushi s'entraident pour vaincre leurs complexes liés à leur taille, ce qui les rapproche et les aide à développer une relation amoureuse." },
            { name: "rester", info: "À force de rester aux côtés d'Atsushi, Risa commence à développer des sentiments pour lui, réalisant qu'elle est amoureuse de lui malgré leurs complexes respectifs." },
            { name: "complexes", info: "Risa et Atsushi sont tous les deux complexés par leur taille, ce qui affecte leur confiance en eux et leurs interactions avec les autres, mais ils finissent par surmonter ces complexes grâce à leur relation." },
            { name: "taille", info: "Risa mesure 170 cm, ce qui est considéré comme grand pour une fille, tandis qu'Atsushi mesure 156 cm, ce qui est considéré comme petit pour un garçon, ce qui est au cœur de leurs complexes respectifs." },
            { name: "entraider", info: "Risa et Atsushi décident de s'entraider pour vaincre leurs complexes liés à leur taille, ce qui les rapproche et les aide à développer une relation amoureuse." },
            { name: "force", info: "Risa et Atsushi trouvent la force de surmonter leurs complexes liés à leur taille grâce à leur relation et à leur soutien mutuel." },
            { name: "relations", info: "Risa et Atsushi ont du mal à établir des relations avec les personnes du sexe opposé en raison de leurs complexes liés à leur taille, ce qui les pousse à se tourner l'un vers l'autre." },
            { name: "élus", info: "Risa et Atsushi tentent de séduire respectivement Suzuki et Chiharu, mais échouent à cause de leurs complexes liés à leur taille, ce qui les pousse à se tourner l'un vers l'autre." },
            { name: "personnes", info: "Risa et Atsushi ont du mal à établir des relations avec les personnes du sexe opposé en raison de leurs complexes liés à leur taille, ce qui les pousse à se tourner l'un vers l'autre." },
            { name: "jeune", info: "Risa et Atsushi sont tous les deux des lycéens, ce qui ajoute une dimension d'adolescence à leurs complexes liés à leur taille et à leur relation." },
            { name: "aide", info: "Risa et Atsushi s'entraident pour vaincre leurs complexes liés à leur taille, ce qui les rapproche et les aide à développer une relation amoureuse." }
        ]
    }
];

const conditions = [
    { id: "C1", linksCount: 10, hasColor: true },
    { id: "C2", linksCount: 10, hasColor: false },
    { id: "C3", linksCount: 30, hasColor: true },
    { id: "C4", linksCount: 30, hasColor: false }
];

// ---------------------------
//      LOGIQUE PERMUTATION
// ---------------------------
function getAllPermutations(array) {
    let result = [];
    const permute = (arr, m = []) => {
        if (arr.length === 0) { result.push(m); }
        else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
            }
        }
    };
    permute(array);
    return result;
}

// ---------------------------
//      SHUFFLE
// ---------------------------
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ---------------------------
//      INITIALISATION
// ---------------------------
function initExperience() {
    const urlParams = new URLSearchParams(window.location.search);
    const pId = parseInt(urlParams.get('id')) || 1;

    // 1. On récupère toutes les permutations possibles uniquement pour les conditions
    const conditionOrders = getAllPermutations([0, 1, 2, 3]); // 24 possibilités

    // 2. On choisit l'ordre des conditions selon l'ID (boucle sur 24)
    const condIdx = (pId - 1) % conditionOrders.length;
    const myConditionOrder = conditionOrders[condIdx];

    // 3. Aléatoire pour les textes : On crée une copie mélangée de baseTexts
    const shuffledTexts = shuffleArray([...baseTexts]);

    console.log(`Participant ID: ${pId}`);
    console.log(`Ordre des conditions (fixe par ID):`, myConditionOrder);
    console.log(`Ordre des textes (aléatoire):`, shuffledTexts.map(t => t.id));

    // 4. Construction de la séquence
    experimentalSequence = shuffledTexts.map((textData, i) => {
        // On associe le texte mélangé à la condition dictée par l'ID
        const condition = conditions[myConditionOrder[i]];

        return {
            text: {
                ...textData,
                questions: shuffleArray([...textData.questions])
            },
            condition: condition
        };
    });

    texteSuivant();
}

// ---------------------------
//       ELEMENTS DOM
// ---------------------------
const textElement = document.getElementById("text");
const questionElement = document.getElementById("question");
const erreurDiv = document.getElementById("erreur-message");
const modal = document.getElementById("myModal");
const modalText = document.getElementById("modal-text");
const closeBtn = document.querySelector(".close-btn");
const reponseContainer = document.querySelector(".reponse-container");
const choicesContainer = document.getElementById("choices-container");

window.onload = initExperience;

// ---------------------------
//      MÉCANISME TEST
// ---------------------------

function chargerTexteEtCondition() {
    const currentBlock = experimentalSequence[experimentalSequenceIndex];

    // 1. Masquer les questions et afficher le texte
    reponseContainer.classList.add("hidden");
    textElement.innerHTML = currentBlock.text.content;

    // 2. Identifier les liens (Logique inchangée)
    const allLinks = Array.from(textElement.querySelectorAll('.link'));
    const Links = allLinks.filter(l => l.classList.contains('required'));
    const distractorLinks = allLinks.filter(l => l.classList.contains('distracteur'));

    const numDistractorsToShow = currentBlock.condition.linksCount - Links.length;
    const shuffledDistractors = shuffleArray([...distractorLinks]);
    const selectedDistractors = shuffledDistractors.slice(0, numDistractorsToShow);

    // Liste des liens qui deviendront actifs après le clic
    const linksToActivate = [...Links, ...selectedDistractors];

    // 4. Créer ou récupérer le bouton "Lecture terminée"
    let readBtn = document.getElementById("btn-read-done");
    if (!readBtn) {
        readBtn = document.createElement("button");
        readBtn.id = "btn-read-done";
        readBtn.textContent = "J'ai fini de lire, passer aux questions";
        reponseContainer.parentNode.insertBefore(readBtn, reponseContainer);
    }
    readBtn.style.display = "block";

    startTimeReading = Date.now();

    // 5. Action au clic : RÉVÉLATION
    readBtn.onclick = () => {
        currentReadingDuration = Date.now() - startTimeReading;
        readBtn.style.display = "none";
        reponseContainer.classList.remove("hidden");

        // On récupère tous les liens qui doivent être activés
        linksToActivate.forEach(link => {
            link.classList.add('active-link');
        });

        questionSuivante();
    };
}

function pausingText() {
    // Affichage du panel pour la pause inter texte
    // affichage pour le premier texte
    reponseContainer.classList.add("hidden");

    if (experimentalSequenceIndex === 0) {
        textElement.innerHTML = `<div class="pausing-panel">
            <h2>Bienvenue dans cette expérience !</h2> 
            </br>
            <p>Prenez le temps de lire les instructions ci-dessous avant de commencer.</p>
            </br>
            <p>Vous allez passer à la première séquence de lecture. Veuillez bien vous assurer des conditions suivante :</p>
            </br>
            <ul>
                <li>Vous êtes dans un endroit calme, sans distraction.</li>
                <li>Vous appareil éléctronique sont éteints ou en mode silencieux (sans vibration).</li>
                <li>Vous allez pouvoir lire et répondre aux questions sans interruption</li>
            </ul>
            </br>
            <p>NB: vous pourrez prendre une pause avant la lecture de chaque texte.</p>
            </br>
            <p> Cliquer le bouton ci-dessous pour commencer la première séquence de lecture.</p>
            </br>
            <button id="btn-next-text">Commencer la première séquence de lecture</button>
        </div>`;
    }
    else if (experimentalSequenceIndex < experimentalSequence.length) {
        textElement.innerHTML = `<div class="pausing-panel">
            <h2>Vous avez terminé ce texte.</h2>
            </br>
            <p>Vous pouvez prendre une petite pause avant de passer au suivant.</p>
            </br>
            <h3>Rappel de la consigne :</h3>
            </br>
            <ul>
                <li>Vous êtes dans un endroit calme, sans distraction.</li>
                <li>Vous appareil éléctronique sont éteints ou en mode silencieux (sans vibration).</li>
                <li>Vous allez pouvoir lire et répondre aux questions sans interruption</li>
            </ul>
            <p>NB: vous pourrez prendre une pause avant la lecture de chaque texte.</p>
            <p> Cliquer le bouton ci-dessous pour commencer la première séquence de lecture.</p>
            </br>
            <button id="btn-next-text">Passer au texte suivant</button>
        </div>`;
    }
    else {
        chargerTexteEtCondition();
        return;
    }
    document.getElementById("btn-next-text").onclick = () => {
       chargerTexteEtCondition();
    };
}

function texteSuivant() {
    experimentalSequenceIndex++;
    if (experimentalSequenceIndex >= experimentalSequence.length) {
        envoyerDonnees();
    } else {
        // Reset du tracking cumulatif
        currentTextRevisits = 0;
        clickedLinksInCurrentText.clear();
        questionIndex = -1;

        pausingText();
        // ATTENTION : Ne pas appeler questionSuivante() ici ! 
        // C'est le bouton de lecture qui le fera.
    }
}

function questionSuivante() {
    const currentBlock = experimentalSequence[experimentalSequenceIndex];
    const currentText = currentBlock.text;
    questionIndex++;

    if (questionIndex >= currentText.questions.length) {
        texteSuivant();
    } else {
        const targetQuestion = currentText.questions[questionIndex];
        questionElement.innerHTML = targetQuestion.q;

        choicesContainer.innerHTML = ""; // On vide les anciens choix

        // On mélange les propositions (p) pour que la bonne réponse ne soit pas toujours au même endroit
        const shuffledChoices = shuffleArray([...targetQuestion.p]);

        shuffledChoices.forEach(choiceText => {
            const btn = document.createElement("button");
            btn.textContent = choiceText;
            btn.className = "choice-btn";
            // On passe l'événement 'e' pour récupérer la cible (le bouton cliqué)
            btn.onclick = (e) => validerReponse(choiceText, e.target);
            choicesContainer.appendChild(btn);
        });

        startTimeQuestion = Date.now();
    }
}

// ---------------------------
//      VALIDATION & DATA
// ---------------------------

function validerReponse(reponseSelectionnee, btnElement) {

    const currentBlock = experimentalSequence[experimentalSequenceIndex];
    const targetQuestion = currentBlock.text.questions[questionIndex];

    const isCorrect = (reponseSelectionnee === targetQuestion.r);
    const duration = Date.now() - startTimeQuestion;

    // Enregistrement des données
    reponses.push({
        "testId": parseInt(new URLSearchParams(window.location.search).get('id')),
        "ordreDansSession": experimentalSequenceIndex + 1,
        "textId": currentBlock.text.id,
        "conditionId": currentBlock.condition.id,
        "linksCount": currentBlock.condition.linksCount,
        "hasColor": currentBlock.condition.hasColor,
        "question": targetQuestion.q,
        "reponse": reponseSelectionnee,
        "correcte": isCorrect,
        "revisits_cumulative": currentTextRevisits, // Nombre de revisites depuis le début du texte
        "unique_links_clicked": clickedLinksInCurrentText.size,
        "reading_time_ms": currentReadingDuration,
        "time_ms": duration,
        "timestamp": Date.now()
    });

    if (!isCorrect) {
        // EFFET VISUEL : Griser le bouton
        btnElement.disabled = true;
        btnElement.classList.add("btn-error");
    } else {
        questionSuivante();
    }
}

// ---------------------------
//       MODAL & UTILS
// ---------------------------

// Gestion du clic sur les liens dans le texte
textElement.addEventListener("click", (e) => {
    // On vérifie que c'est bien un lien et qu'il n'est pas désactivé (pointerEvents)
    if (e.target.classList.contains("link") && e.target.style.pointerEvents !== 'none') {

        const terme = e.target.textContent.trim();

        // Tracking persistant sur tout le bloc de texte
        if (clickedLinksInCurrentText.has(terme)) {
            currentTextRevisits++;
        } else {
            clickedLinksInCurrentText.add(terme);
        }

        const currentBlock = experimentalSequence[experimentalSequenceIndex];

        // 1. Chercher l'info pour la modal
        const lienTrouve = currentBlock.text.links.find(l => l.name === terme);
        modalText.textContent = lienTrouve ? lienTrouve.info : `Il n'y a rien ici`;
        modal.style.display = "flex";

        // 2. GÉRER LE CHANGEMENT DE COULEUR (La VI Feedback Visuel)
        if (currentBlock.condition.hasColor) {
            e.target.classList.add("visited-link");
        }
    }
});

// Gestion du modal
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

function envoyerDonnees() {
    const donnees = {
        "utilisateur": {
            "id": parseInt(new URLSearchParams(window.location.search).get('id')),
            "age": Number(localStorage.getItem("userAge")),
            "genre": Number(localStorage.getItem("userGenre")),
            "daltonisme": Number(localStorage.getItem("userDaltonisme")),
            "dyslexie": Number(localStorage.getItem("userDyslexie"))
        },
        "essais": reponses
    };

    console.log("ENVOI FINAL", donnees);
    savedata(donnees);
}

function savedata(data) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "savedata.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
    alert("Expérience terminée. Merci !");
}