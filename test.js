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
        content: `Dans un <span class= "link distracteur">futur lointain</span>, aux confins de l’<span class="link">Ultima Segmentum</span>, le <span class = "link distracteur">système</span> oublié de <span class = "link">Morologus Novem</span> (ou "Cap du Désespoir") refait surface près de la <span class = "link">Cicatrix Maledictum</span>. Après la chute de <span class ="link">Cadia</span>, <span class = "link distracteur">une flotte</span> de l’<span class = "link">Adeptus Mechanicus</span> y échoue, découvrant les vestiges d’une <span class = "link distracteur">civilisation</span> <span class = "link distracteur">humaine</span> avancée. Ce système, stratégique et ravagé par les marées du Warp, attire l’Imperium, les Orks, le Chaos et même les Nécrons, tous en quête d’un artéfact mystérieux enfoui sous sa surface. Les factions s’affrontent pour contrôler ce point clé entre <span class = "link distracteur">l’Imperium Sanctus</span> et <span class = "link distracteur">l’Imperium Nihilus</span>, tandis que son destin reste incertain, enveloppé dans les ombres du Warp.
`,
        questions: [
            { q: "Où se situe Ultima Segmentum ?", p: ["est de Terra", "ouest de Terra", "nord de Terra", "sud de Terra"], r: "est de Terra" },
            { q: "Quel est le nom du système oublié ?", r: "Morologus Novem" },
            { q: "Quel est la zone connaissant des dangers extrems ?", r: "Cicatrix Maledictum" },
            { q: "Quelle planète stratégique est connue pour son importance militaire ?", r: "Cadia" },
            { q: "Quel est la faction chargé de la technologie et de la science ?", r: "Adeptus Mechanicus" }
        ],
        links: [
            { name: "Ultima Segmentum", info: "L'Ultima Segmentum est un segment de l'Imperium situé à l'extrême Est de l'Imperium" },
            // Les infos suivantes sont à revoir, j'ai mis des placeholders pour l'instant
            { name: "Morologus Novem", info: "Morologus Novem est un système oublié situé à l'extrême Est de l'Imperium, connu pour ses marées du Warp et son artéfact mystérieux." },
            { name: "Cicatrix Maledictum", info: "La Cicatrix Maledictum est une zone de l'Imperium marquée par des effets du Warp et connais des anomalies et des dangers extrêmes." },
            { name: "Cadia", info: "Cadia est une planète stratégique de l'Imperium, connue pour son importance militaire et son rôle dans la défense de l'Imperium." },
            { name: "Adeptus Mechanicus", info: "L'Adeptus Mechanicus est un ordre religieux de l'Imperium chargé de la technologie et de la science, souvent en conflit avec les autres factions de l'Imperium." },
            // 5 lien distracteur 
            { name: "futur lointain", info: "Le futur lointain dans l'univers de Warhammer 40k est une période où l'humanité a colonisé de nombreux systèmes stellaires et est en guerre constante avec diverses factions." },
            { name: "système", info: "Un système dans l'univers de Warhammer 40k est une région de l'espace contenant des étoiles, des planètes et d'autres corps célestes." },
            { name: "une flotte", info: "Une flotte dans l'univers de Warhammer 40k est un groupe de vaisseaux spatiaux utilisés pour le transport, la guerre ou d'autres missions." },
            { name: "Imperium Sanctus", info: "L'Imperium Sanctus est une partie de l'Imperium située à l'extrême Est, connue pour sa foi et sa dévotion envers l'Empereur." },
            { name: "Imperium Nihilus", info: "L'Imperium Nihilus est une partie de l'Imperium située à l'extrême Ouest, connue pour son isolement et ses dangers extrêmes." },
            { name: "civilisation", info: "Une civilisation dans l'univers de Warhammer 40k est une société avancée technologiquement et culturellement, souvent en conflit avec d'autres civilisations pour le contrôle de ressources et de territoires." },
            { name: "humain", info: "L'humanité dans l'univers de Warhammer 40k est une espèce qui a colonisé de nombreux systèmes stellaires et est en guerre constante avec diverses factions pour le contrôle de l'espace et des ressources." }

        ]
    },
    {
        id: "NieR",
        content: `NieR: Automata se déroule en l’an 11 945, dans un monde post-apocalyptique où la Terre, abandonnée par les humains après une invasion de <span class ="link ">machines extraterrestres</span>, est devenue le théâtre d’une guerre par procuration. Les derniers humains, réfugiés sur la Lune, envoient des androïdes (comme <span class = "link ">2B</span>, <span class = "link ">9S</span> et <span class ="link " >A2 </span>) pour <span class="link ">combattre les machines</span>, créées par des extraterrestres. Le jeu explore les thèmes de la futilité de la guerre, de l’humanité, de la mémoire et de la quête de sens, à travers une narration complexe nécessitant plusieurs parties pour en révéler tous les aspects. L’histoire mêle action, émotion et philosophie, dans un univers riche et mélancolique, marqué par une bande-son inoubliable
`,
        questions: [
            { q: "Quand est-ce que les machines extraterrestres ont envahi la Terre ?", r: "1ère Guerre des Machines" },
            { q: "Quel personnage est reconus pour son efficacité ?", r: "2B" },
            { q: "Dans quel but les androïdes sont-ils envoyés ?", r: "Reprendre le contrôle de la planète Terre" },
            { q: "Quel est le type d'androïde de 9S ?", r: "YoRHa" },
            { q: "Quel est l'android rebelle du jeu ?", r: "A2" }
        ],
        links: [ // réponse à revoir
            { name: "machines extraterrestres", info: "Les Machines, apparues lors de la 1ère Guerre des Machines, sont devenues des fantassins redoutablement efficaces dans la guerre interminable contre les Androïdes." },
            { name: "2B", info: "2B est une androïde de combat de type YoRHa, connue pour son efficacité et son apparence élégante." },
            { name: "9S", info: "9S est un androïde de reconnaissance de type YoRHa, curieux et intelligent, spécialisé dans le piratage." },
            { name: "A2", info: "A2 est une androïde de combat de type YoRHa, rebelle et mystérieuse, avec un passé sombre." },
            { name: "combattre les machines", info: "Les Androïdes sont envoyés sur Terre pour combattre les Machines et tenter de reprendre le contrôle de la planète." },
        ]
    },
    {
    id: "Game of Rols",
    // 30 liens au total : 5 Required (Archibald, Evy, Mimolin, Raoul, Omelas) + 25 Distracteurs
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
        { q: "Quelle est la particularité de la guitare de Raoul ?", p: ["Elle est en bois d'ébène enchanté", "Elle est en or", "Elle a une tête enargentée", "Elle a des cordes en soie"], r: "Elle est en bois d'ébène enchanté" },
        { q: "Quelle est la véritable nature d'Omelas ?", p: ["Une créature enfermée sous le palais", "Un esprit maléfique qui destiné à tuer qui la regarde", "Le phantome de l'île Amaru", "Un dieu ancien qui aide nos 4 héros"], r: "Une créature enfermée sous le palais" }
    ],
    
    links: [
        // 5 REQUIRED (Réponses dans info uniquement)
        { name: "Archibald", info: "Héritier de la famille Brisant-Choyeur, il a un tic nerveux : il fait craquer ses doigts quand il est stressé." },
        { name: "archéologue", info: "Archéologue maudite, elle collectionne les plumes de corbeau, pensant qu'elles portent chance." },
        { name: "Mimolin", info: "Bien qu'amnésique, il garde précieusement un médaillon en argent en forme de lune, seul vestige de sa famille." },
        { name: "Raoul", info: "Barde célèbre, il possède une guitare secrètement sculptée dans du bois d'ébène enchanté." },
        { name: "destinée", info: "Loin d'être un monstre, Omelas est une entité vivante et pensante faite de lumière pure, emprisonnée sous le palais." },
        
        // 25 DISTRACTEURS
        { name: "île", info: "L'île Amaru est entourée d'eau empoisonnée. Elle se situe proche de l'île Lafait." }, 
        { name: "tente", info: "Elle a dû mal car ses pensées sont trop sombres" },
        { name: "passé", info: "Elle a dû quitter l'île Lafait à cause d'un problème d'argent." },
        { name: "rune", info: "Symbole magique ancien qui lui permet de lancer des sorts." }, 
        { name: "chante", info: "Il chante des musiques en jouant d'un instrument." },
        { name: "exploits", info: "Ses musiques racontent ses aventures dans ce monde fantastique." }, 
        { name: "tavernes", info: "La taverne du Dragon Noir, est un lieu où les assassins se rassemblent." },
        { name: "tourments", info: "Ils sont encore sous l'emprise d'un sort." }, 
        { name: "cherche", info: "Il veut comprendre ce qui lui arrive." },
        { name: "comprendre", info: "Il cherche à donner un sens à ses pensées." }, 
        { name: "flash-backs", info: "Il a des souvenirs soudains et vifs de sa famille assassinée." },
        { name: "traversent", info: "Il se balade dans tous types de paysages (montagnes, plaines, forêts, etc)." }, 
        { name: "régions", info: "Les régions ne sont pas très connues car dangereuse pour la plus part des gens." },
        { name: "poèmes", info: "Il écrit des poèmes sur ses aventures." }, 
        { name: "dragons", info: "Créatures légendaires dont la tarverne tire son nom : Taverne du Dragon Noir" },
        { name: "assassins", info: "Tueurs professionnels qui ont assassiné la famille du pauvre Mimolin." }, 
        { name: "guilde", info: "Association de professionnels chassant les créatures les plus féroces." },
        { name: "palais", info: "Demeure somptueuse du souverain de l'île Amaru" }, 
        { name: "créature", info: "Omelas est une créature de lumière." },
        { name: "Omelas", info: "Elle est une vielle créature dangereuse et est agée de plus de 10000 ans." }, 
        { name: "inquiète", info: "Elle inquiète les dieux car elle risque d'angloutir les humains vivants à coté d'elle." },
        { name: "dieux", info: "Entités supérieures qui dirige le monde de Rols" }, 
        { name: "marchand", info: "Il fait du commerce pendant ses aventures." },
        { name: "barde", info: "Il fait de la musique et raconte ses aventures." },
        { name: "marahaja", info: "Le souverain de l'île Amaru." }
    ]
},
    {
        id: "Lovely Complex",
        content: `Lovely Complex est l'histoire d'une <span class = "link distracteur">relation</span> entre deux personnages <span class="link distracteur">complexés</span> par leur taille : <span class="link required">Risa Koizumi</span>, jeune fille mesurant 170 cm ; et <span class = "link required">Atsushi Ootani</span> haut de 156 cm.
En raison de leur taille et de leurs nombreuses <span class="link distracteur">chamailleries</span>, ces deux personnages sont comparés à un duo d'<span class="link distracteur">humoristes</span>, les All <span class= "link required" >Hanshin Kyojin</span>. Mais leur taille les empêchent de s'<span class="link distracteur">épanouir</span> complètement : ils manquent de <span class = "link distracteur">confiance</span> en eux pour ce qui est des relations avec les personnes du sexe opposé.
Durant les <span class="link distracteur">vacances</span> d'été, Risa et Atsushi tombent amoureux de <span class="link required">deux autres personnages </span> et décident de s'entraider et de s'<span class="link distracteur">encourager</span> mutuellement pour <span class="link distracteur">vaincre</span> leurs <span class= "link distracteur">complexes</span> et essayer de <span class="link distracteur">séduire</span> les élus de leurs <span class="link distracteur">coeurs</span>... Mais il s'agit d'un <span class = "link distracteur">échec</span> pour <span class="link distracteur">eux</span> deux.
Cependant, à force de <span class="link distracteur">rester</span> aux côtés d'Atsushi et l'aide de ses <span class="link required">amis</span>, Risa ne commence-t-elle pas à <span class="link distracteur">devenir</span> <span class="link distracteur">amoureuse</span> de lui ?`,
        questions: [
            { q: "Quel instrument joue le personnage principal ?", p: ["Guitare", "Piano", "Violon", "Saxophone"], r: "Saxophone" },
            { q: "Qui est Nobuko ?", p: ["La petite amie de Nakao", "La sœur de Risa", "La meilleure amie d'Atsushi", "La mère de Nakao"], r: "La petite amie de Nakao" },
            { q: "Qui est le membre du duo Hanshin Kyojin le plus petit ?", p: ["Hanshin", "Kyojin", "Nakao", "Atsushi"], r: "Hanshin" },
            { q: "Qui est la première amoureuse de Atsushi ?", p: ["Chiharu Tanaka", "Mimi Kuroi", "Kanzaki", "Suzuki"], r: "Chiharu Tanaka" },
            { q: "Quel sport fait l'un des personnages ?", p: ["Football", "Basketball", "Tennis", "Natation"], r: "Basketball" }
        ],
        links: [
            { name: "Risa Koizumi", info: "Koizumiest une lycéenne passionnée de musique et membre du club de fanfare, où elle joue du saxophone, ce qui révèle son côté artistique et déterminé malgré ses complexes liés à sa taille." },
            { name: "Atsushi Ootani", info: "Atsushi Ootani, garçon populaire grâce à son poste dans l’équipe de basketball et complexé par sa taille (156 cm), forme avec Risa le duo All Hanshin-Kyojin ; il a du mal à comprendre ses sentiments pour Koizumi, finit par en tomber amoureux malgré ses prétendantes Mimi et Kanzaki, et compte Nakao et Suzuki parmi ses meilleurs amis, l’appelant parfois \"idiote\"." },
            { name: "amis", info: "Nakao est un garçon très mignon et gentil, toujours prêt à consoler ses amis et à mettre le doigt là où ça fait mal, provoquant souvent Ootani ; follement amoureux de sa petite amie Nobuko et décidé à passer sa vie avec elle." },
            { name: "Hanshin Kyojin", info: "Le duo comique All Hanshin-Kyojin est célèbre au Japon pour son humour basé sur le contraste de taille entre ses deux membres : l’un très petit (Hanshin) et l’autre très grand (Kyojin)." },
            { name: "deux autres personnages", info: "Risa Koizumi est d'abord amoureuse de Suzuki. Atsushi Ootani est d'abord amoureux de Chiharu Tanaka." },
            // 5 liens distracteurs
            { name: "échec", info: "Risa et Atsushi échouent à séduire respectivement Suzuki et Chiharu à cause de leur taille, et se promettent alors de ne plus jamais aimer quelqu’un qui ne correspond pas à leur taille." },
            { name: "vacances", info: "Pendant les vacances d'été, Risa et Atsushi tombent amoureux de deux autres personnages et décident de s'entraider pour vaincre leurs complexes et essayer de séduire les élus de leurs cœurs, mais ils échouent tous les deux." },
            { name: "amoureuse", info: "À force de rester aux côtés d'Atsushi, Risa commence à développer des sentiments pour lui, réalisant qu'elle est amoureuse de lui malgré leurs complexes respectifs." },
            { name: "complexés", info: "Risa et Atsushi sont tous les deux complexés par leur taille : Risa mesure 170 cm, ce qui est considéré comme grand pour une fille, tandis qu'Atsushi mesure 156 cm, ce qui est considéré comme petit pour un garçon." },
            { name: "humoristes", info: "En raison de leur taille et de leurs nombreuses chamailleries, Risa et Atsushi sont souvent comparés à un duo d'humoristes japonais célèbres, les All Hanshin-Kyojin, connus pour leur contraste de taille." },
            // Ajout de liens distracteurs supplémentaires pour atteindre 30 liens
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

    // 2. Créer ou récupérer le bouton "Lecture terminée"
    let readBtn = document.getElementById("btn-read-done");
    if (!readBtn) {
        readBtn = document.createElement("button");
        readBtn.id = "btn-read-done";
        readBtn.textContent = "J'ai fini de lire, passer aux questions";
        // On insère le bouton avant le conteneur de réponse
        reponseContainer.parentNode.insertBefore(readBtn, reponseContainer);
    }
    readBtn.style.display = "block";

    // 3. Lancer le timer de lecture
    startTimeReading = Date.now();

    // 4. Action au clic
    readBtn.onclick = () => {
        // Calcul et stockage du temps de lecture
        currentReadingDuration = Date.now() - startTimeReading;

        // Cacher le bouton et montrer le conteneur de questions
        readBtn.style.display = "none";
        reponseContainer.classList.remove("hidden");

        // Démarrer les questions
        questionSuivante();
    };

    // 1. Injecter le texte HTML
    textElement.innerHTML = currentBlock.text.content;

    // 2. Identifier les deux types de liens
    const allLinks = Array.from(textElement.querySelectorAll('.link'));
    const Links = allLinks.filter(l => l.classList.contains('required'));
    const distractorLinks = allLinks.filter(l => l.classList.contains('distracteur'));

    console.log("Liens obligatoires :", Links.map(l => l.textContent.trim()));
    console.log("Liens distracteurs :", distractorLinks.map(l => l.textContent.trim()));

    // 3. Calculer combien de distracteurs on doit ajouter
    // linksCount (10 ou 30) - les 5 obligatoires
    const numDistractorsToShow = currentBlock.condition.linksCount - Links.length;

    console.log("Condition :", currentBlock.condition);
    console.log("Nombre de distracteurs à montrer :", numDistractorsToShow);

    // 4. Tirer au sort les distracteurs
    const shuffledDistractors = shuffleArray([...distractorLinks]);
    const selectedDistractors = shuffledDistractors.slice(0, numDistractorsToShow);

    // 5. Créer la liste finale des liens à activer
    const linksToActivate = [...Links, ...selectedDistractors];

    // 6. Appliquer les styles et comportements
    allLinks.forEach((link) => {
        // Reset systématique
        link.classList.remove('visited-link');

        if (linksToActivate.includes(link)) {
            // ACTIVATION
            link.style.pointerEvents = 'auto';
            link.style.cursor = 'pointer';
            link.style.textDecoration = 'underline'; // On s'assure qu'ils sont visibles comme liens
            link.style.color = ''; // Reprend la couleur CSS par défaut des liens
        } else {
            // DÉSACTIVATION (Distracteurs non choisis)
            link.style.pointerEvents = 'none';
            link.style.textDecoration = 'none';
            link.style.color = 'inherit';
            link.style.cursor = 'default';
        }
    });
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

        chargerTexteEtCondition();
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
    xhr.open("POST", "../savedata.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
    alert("Expérience terminée. Merci !");
}