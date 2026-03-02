// ---------------------------
//       VARIABLES GLOBALES
// ---------------------------
let reponses = [];
let experimentalSequenceIndex = -1;
let questionIndex = -1;
let startTimeQuestion = 0;
let experimentalSequence = [];

// ---------------------------
//   CONFIGURATION DES TEXTES
// ---------------------------
// Note : Assure-toi d'avoir bien 30 spans par texte pour la condition C3/C4
const baseTexts = [
    {
        id: "Warhammer",
        content: `Dans un futur lointain, aux confins de <span class="link">l’Ultima Segmentum</span>, le système oublié de <span class = "link">Morologus Novem</span> (ou "Cap du Désespoir") refait surface près de la <span class = "link">Cicatrix Maledictum</span>. Après la chute de <span class ="link">Cadia</span>, une flotte de l’<span class = "link">Adeptus Mechanicus</span> y échoue, découvrant les vestiges d’une civilisation humaine avancée. Ce système, stratégique et ravagé par les marées du Warp, attire l’Imperium, les Orks, le Chaos et même les Nécrons, tous en quête d’un artéfact mystérieux enfoui sous sa surface. Les factions s’affrontent pour contrôler ce point clé entre l’Imperium Sanctus et l’Imperium Nihilus, tandis que son destin reste incertain, enveloppé dans les ombres du Warp.
`,
        questions: [
            { q: "Où se situe Ultima Segmentum ?", r: "est de Terra" },
            { q: "Question 2 T1 ?", r: "Réponse 2" },
            { q: "Question 3 T1 ?", r: "Réponse 3" },
            { q: "Question 4 T1 ?", r: "Réponse 4" },
            { q: "Question 5 T1 ?", r: "Réponse 5" }
        ],
        links: [
            { name: "l'Ultima Segmentum", info: "L'Ultima Segmentum est un segment de l'Imperium situé à l'extrême Est de l'Imperium" },
            // Les infos suivantes sont à revoir, j'ai mis des placeholders pour l'instant
            { name: "Morologus Novem", info: "un truc pas sympas askip" },
            { name: "Cicatrix Maledictum", info: "La Cicatrix Maledictum est un truc pas sympas askip" },
            { name: "Cadia", info: "Cadia est un truc pas sympas askip" },
            { name: "Adeptus Mechanicus", info: "L'Adeptus Mechanicus est un truc pas sympas askip" },
            // Ajoute ici tes 30 liens pour T1
        ]
    },
    {
        id: "NieR",
        content: `NieR: Automata se déroule en l’an 11 945, dans un monde post-apocalyptique où la Terre, abandonnée par les humains après une invasion de <span class ="link">machines extraterrestres</span>, est devenue le théâtre d’une guerre par procuration. Les derniers humains, réfugiés sur la Lune, envoient des androïdes (comme <span class = "link">2B</span>, <span class = "link">9S</span> et <span class ="link" >A2 </span>) pour <span class="link">combattre les machines</span>, créées par des extraterrestres. Le jeu explore les thèmes de la futilité de la guerre, de l’humanité, de la mémoire et de la quête de sens, à travers une narration complexe nécessitant plusieurs parties pour en révéler tous les aspects. L’histoire mêle action, émotion et philosophie, dans un univers riche et mélancolique, marqué par une bande-son inoubliable
`,
        questions: [
            { q: "Quand est-ce que les machines extraterrestres ont envahi la Terre ?", r: "1ère Guerre des Machines" },
            { q: "Quel personnage est reconus pour son efficacité ?", r: "2B" },
            { q: "Question 3 T2 ?", r: "Réponse 3" },
            { q: "Question 4 T2 ?", r: "Réponse 4" },
            { q: "Question 5 T2 ?", r: "Réponse 5" }
        ],
        links: [ // réponse à revoir
            { name: "machines extraterrestres", info: "Les Machines, apparues lors de la 1ère Guerre des Machines, sont devenues des fantassins redoutablement efficaces dans la guerre interminable contre les Androïdes." },
            { name: "2B", info: "2B est une androïde de combat de type YoRHa, connue pour son efficacité et son apparence élégante." },
            { name: "9S", info: "9S est un androïde de reconnaissance de type YoRHa, curieux et intelligent, spécialisé dans le piratage." },
            { name: "A2", info: "A2 est une androïde de combat de type YoRHa, rebelle et mystérieuse, avec un passé sombre." },
            { name: "combattre les machines", info: "Les Androïdes sont envoyés sur Terre pour combattre les Machines et tenter de reprendre le contrôle de la planète." },
        ]
    },
    { id: "T3", content: `Contenu T3...`, questions: [{q:"Q1 T3", r:"R1"}], links: [] },
    { id: "T4", content: `Contenu T4...`, questions: [{q:"Q1 T4", r:"R1"}], links: [] }
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
//      INITIALISATION
// ---------------------------
function initExperience() {
    const urlParams = new URLSearchParams(window.location.search);
    const pIdRaw = urlParams.get('id');

    // 1. Vérification stricte de l'ID
    if (!pIdRaw || isNaN(parseInt(pIdRaw))) {
        alert("Erreur : Aucun identifiant participant détecté. Vous allez être redirigé vers le formulaire.");
        // Redirige vers ton formulaire (adapte le nom de fichier si besoin)
        window.location.href = "formulaire.html"; 
        return; // On arrête l'exécution ici
    }

    const pId = parseInt(pIdRaw);
    const allOrders = getAllPermutations([0, 1, 2, 3]);

    // On s'assure que l'ID est compris entre 1 et 24 (ou plus si tu as plus de participants)
    // Ici, on utilise le modulo pour rester dans les 24 permutations possibles
    const orderIndex = (pId - 1) % 24;
    const myOrder = allOrders[orderIndex];

    // Construction de la séquence
    experimentalSequence = baseTexts.map((textObj, index) => {
        return {
            text: textObj,
            condition: conditions[myOrder[index]]
        };
    });

    // On lance le test
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
const submitBtn = document.getElementById("submit-btn");
const reponseInput = document.getElementById("reponse");

window.onload = initExperience;

// ---------------------------
//      MÉCANISME TEST
// ---------------------------

function chargerTexteEtCondition() {
    const currentBlock = experimentalSequence[experimentalSequenceIndex];
    
    // 1. Injecter le texte
    textElement.innerHTML = currentBlock.text.content;

    // 2. Récupérer tous les liens injectés
    const domLinks = textElement.querySelectorAll('.link');

    domLinks.forEach((link, index) => {
        // --- RÉINITIALISATION ---
        // On s'assure qu'aucun lien ne garde son état "visité" du texte précédent
        link.classList.remove('visited-link'); 
        
        // --- VI : NOMBRE DE LIENS ---
        if (index >= currentBlock.condition.linksCount) {
            // Désactivation des liens excédentaires
            link.style.pointerEvents = 'none';
            link.style.textDecoration = 'none';
            link.style.color = 'inherit';
            link.style.cursor = 'default';
        } else {
            // Activation
            link.style.pointerEvents = 'auto';
            link.style.cursor = 'pointer';
            
            // la couleur est géré avec la class .visited-link
        }
    });
}

function texteSuivant() {
    experimentalSequenceIndex++;
    if (experimentalSequenceIndex >= experimentalSequence.length) {
        envoyerDonnees();
    } else {
        questionIndex = -1; 
        chargerTexteEtCondition();
        questionSuivante();
    }
}

function questionSuivante() {
    const currentText = experimentalSequence[experimentalSequenceIndex].text;
    questionIndex++;

    if (questionIndex >= currentText.questions.length) {
        texteSuivant();
    } else {
        questionElement.innerHTML = currentText.questions[questionIndex].q;
        reponseInput.value = "";
        startTimeQuestion = Date.now(); // Reset du chrono pour la question
    }
}

// ---------------------------
//      VALIDATION & DATA
// ---------------------------

submitBtn.addEventListener("click", () => {
    desafficherErreur();
    const reponseValue = reponseInput.value.trim();
    const currentBlock = experimentalSequence[experimentalSequenceIndex];
    const targetQuestion = currentBlock.text.questions[questionIndex];

    const isCorrect = reponseValue.toLowerCase().includes(targetQuestion.r.toLowerCase());
    const duration = Date.now() - startTimeQuestion;

    // Push des données avec le nouveau format
    reponses.push({
        "ordreDansSession": experimentalSequenceIndex + 1,
        "textId": currentBlock.text.id,
        "conditionId": currentBlock.condition.id,
        "linksCount": currentBlock.condition.linksCount,
        "hasColor": currentBlock.condition.hasColor,
        "question": targetQuestion.q,
        "reponse": reponseValue,
        "correcte": isCorrect,
        "time_ms": duration,
        "timestamp": Date.now()
    });

    if (!isCorrect) {
        afficherErreur();
    } else {
        questionSuivante();
    }
});

// ---------------------------
//       MODAL & UTILS
// ---------------------------

// Gestion du clic sur les liens dans le texte
textElement.addEventListener("click", (e) => {
    // On vérifie que c'est bien un lien et qu'il n'est pas désactivé (pointerEvents)
    if (e.target.classList.contains("link") && e.target.style.pointerEvents !== 'none') {
        
        const terme = e.target.textContent.trim();
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

function afficherErreur() {
    if (erreurDiv) {
        erreurDiv.textContent = "Réponse incorrecte. Réessayez.";
        erreurDiv.style.display = "block";
    }
}

function desafficherErreur() {
    if (erreurDiv) erreurDiv.style.display = "none";
}

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