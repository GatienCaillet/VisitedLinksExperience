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
        id: "Game of rols",
        content: `Quatre héros partent pour <span class = "link ">l’île du roi sorcier-dragon</span> : <span class ="link">Archibald</span> (marchand), <span class = "link ">Evy</span> (archéologue maudite), <span class="link ">Raoul</span> (barde) et <span class ="link">Mimolin</span> (orphelin amnésique). Arrivés, ils découvrent un piège : le roi est un dragon qui dévore les invités. Survivants, ils doivent trouver une rançon (75 000 pièces d’or et un livre maudit) à Mirabilia. Leurs aventures les mènent à Nol (où ils déclenchent une catastrophe), puis à Torini, où Mimolin tombe amoureux, Evy apprend sa malédiction, et Raoul découvre sa paternité secrète. Après avoir livré la rançon, le roi les envoie chercher une sorcière pour la transmigration des âmes. Leur quête les mène au Bharat, où ils affrontent des dragons, des doubles maléfiques, et découvrent des secrets cosmiques.`,
        questions: [
            { q: "Quel est le nom de la fête organisé sur l'île de Tenegriffe", r: "Fête de la pleine lune" },
            { q: "Qui été chargé la reine Julia de négocier avec le roi sorcier-dragon ?", r: "Archibald" },
            { q: "Qui porte une rune ?", r: "Evy" },
            { q: "Qui est le meilleur ami de Kaheena D’Ashanul", r: "Raoul" },
            { q: "A qui a échappé à un assassinat ?", r: "Mimolin" }
        ],
        links: [
            { name: "l’île du roi sorcier-dragon", info: "Tenegriffe, anciennement appelée simplement l'île du roi sorcier-dragon, est une île située dans la mer des eaux dansantes qui organise la \"fête de la pleine lune\" tous les 10 ans où tout est gratuit." },
            { name: "Archibald", info: "La famille Brisant-Choyeur, autrefois poissonniers et montés en puissance dans le commerce maritime, envoie l’impitoyable homme d’affaires, Archibald, chargé par la reine Julia de négocier et rapporter 2000 pièces d’or au roi sorcier-dragon." },
            { name: "Evy", info: "Une jeune noble avide de savoir et des choses brillantes, cachant des yeux complètement noirs derrière sa coiffure, porte une rune lui donnant un sort quotidien et souffre d’une malédiction liée au Codex Pontis." },
            { name: "Raoul", info: "Raoul, un barde mondialement connu qui promène amour et polémique, veut jouer à la fête de la pleine lune sur l’île du roi sorcier‑dragon et, avant d’y parvenir, quitte ses trois amis pour suivre sa meilleure amie Kaheena D’Ashanul à travers les mers du globe." },
            { name: "Mimolin", info: "Jeune amnésique convaincu d’être un roi, Mimolin traîne une bague et un balai, découvre un contrat de transfert d’âme à Nol, apprend ses liens avec le chevalier Bear et, entre prisons et flash‑backs meurtriers, échappe à un assassinat lié au Tigre de Jade." },
        ]
    },
    {
        id: "Lovely Complex",
        content: `Lovely Complex est l'histoire d'une relation entre deux personnages complexés par leur taille : <span class="link required">Risa Koizumi</span>, jeune fille mesurant 170 cm ; et <span class = "link required">Atsushi Ootani</span> haut de 156 cm.
En raison de leur taille et de leurs nombreuses <span class="link distracteur">chamailleries</span>, ces deux personnages sont comparés à un duo d'humoristes, les All <span class= "link required" >Hanshin Kyojin</span>. Mais leur taille les empêchent de s'<span class="link distracteur">épanouir</span> complètement : ils manquent de confiance en eux pour ce qui est des relations avec les personnes du sexe opposé.
Durant les <span class="link distracteur">vacances</span> d'été, Risa et Atsushi tombent amoureux de <span class="link required">deux autres personnages </span> et décident de s'entraider et de s'<span class="link distracteur">encourager</span> mutuellement pour <span class="link distracteur">vaincre</span> leurs <span class= "link distracteur">complexes</span> et essayer de <span class="link distracteur">séduire</span> les élus de leurs <span class="link distracteur">coeurs</span>... Mais il s'agit d'un <span class = "link distracteur">échec</span> pour <span class="link distracteur">eux</span> deux.
Cependant, à force de rester aux côtés d'Atsushi, Risa ne commence-t-elle pas à <span class="link distracteur">devenir</span> <span class="link distracteur">amoureuse</span> de lui ?`,
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
            { name: "Nakao", info: "Nakao est un garçon très mignon et gentil, toujours prêt à consoler ses amis et à mettre le doigt là où ça fait mal, provoquant souvent Ootani ; follement amoureux de sa petite amie Nobuko et décidé à passer sa vie avec elle." },
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
    const pId = parseInt(new URLSearchParams(window.location.search).get('id'));

    const textOrders = getAllPermutations([0, 1, 2, 3]);
    const conditionOrders = getAllPermutations([0, 1, 2, 3]);

    const textIdx = (pId - 1) % textOrders.length;
    const condIdx = Math.floor((pId - 1) / textOrders.length) % conditionOrders.length;

    const myTextOrder = textOrders[textIdx];
    const myConditionOrder = conditionOrders[condIdx];

    // Construction de la séquence avec mélange des questions
    experimentalSequence = myTextOrder.map((textIndex, i) => {
        const originalText = baseTexts[textIndex];

        return {
            // On crée une copie de l'objet texte pour ne pas impacter baseTexts
            text: {
                ...originalText,
                // On crée une copie du tableau questions et on le mélange
                questions: shuffleArray([...originalText.questions])
            },
            condition: conditions[myConditionOrder[i]]
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

window.onload = initExperience;

// ---------------------------
//      MÉCANISME TEST
// ---------------------------

function chargerTexteEtCondition() {
    const currentBlock = experimentalSequence[experimentalSequenceIndex];
    const reponseContainer = document.querySelector(".reponse-container");

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

        const choicesContainer = document.getElementById("choices-container");
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
        modalText.textContent = lienTrouve ? lienTrouve.info : `Détails sur ${terme}...`;
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