// ---------------------------
//       DEMARRAGE TEST
// ---------------------------
window.onload = function() {
    const startTime = Date.now();
    texteSuivant();
    questionSuivante();
}

// ---------------------------
//       LISTES DE TESTS
// ---------------------------

let reponses = [];
let testNumber = localStorage.getItem("testNumber");

if (testNumber != "1" && testNumber != "2") {
    alert("Numéro de test non défini. Veuillez contacter les expérimentateurs.");
} else if (testNumber === "1") {
    
} else if (testNumber === "2") {
    
}

questionIndex = -1;
const listeQuestions = [
    { q: "Question 1 ?", r: "Réponse 1" },
    { q: "Question 2 ?", r: "Réponse 2" },
    { q: "Question 3 ?", r: "Réponse 3" }
];

textIndex = -1;
const texts = [
    `Dans un futur lointain, aux confins de l’Ultima Segmentum, le système oublié de Morologus Novem (ou "Cap du Désespoir") refait surface près de la Cicatrix Maledictum. Après la chute de Cadia, une flotte de l’Adeptus Mechanicus y échoue, découvrant les vestiges d’une civilisation humaine avancée. Ce système, stratégique et ravagé par les marées du Warp, attire l’Imperium, les Orks, le Chaos et même les Nécrons, tous en quête d’un artéfact mystérieux enfoui sous sa surface. Les factions s’affrontent pour contrôler ce point clé entre l’Imperium Sanctus et l’Imperium Nihilus, tandis que son destin reste incertain, enveloppé dans les ombres du Warp.`,
    "Le code est disponible sur <a href='https://github.com'>GitHub</a>.",
    "Contactez-nous via <a href='mailto:test@example.com'>email</a>.",
    "Lisez la <a href='/doc.pdf'>documentation</a>."
]

// ---------------------------
//      SHUFFLE ARRAYS
// ---------------------------
function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

// ---------------------------
//       ELEMENTS DOM
// ---------------------------
const textElement = document.getElementById("text");
const questionElement = document.getElementById("question");
const erreurDiv = document.getElementById("erreur-message");

// Bouton valider la réponse
const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", () => {
    desafficherErreur();
    const reponseInput = document.getElementById("reponse");
    const reponseValue = reponseInput.value.trim();

    if(!verifierReponse(reponseValue)) {
        afficherErreur();
        reponses.push({
            "question": listeQuestions[questionIndex].q,
            "reponse": reponseValue,
            "correcte": false,
            "time": Date.now()
        });  
    } else { 
        reponses.push({
            "question": listeQuestions[questionIndex].q,
            "reponse": reponseValue,
            "correcte": true,
            "time": Date.now()
        }); 
        questionSuivante();
    }
     
});

// ---------------------------
//      MÉCANISME STIMULI
// ---------------------------

function texteSuivant() {
    textIndex++;
    if (textIndex >= texts.length) {
        console.log("Tests terminés, envoyer les données");
        envoyerDonnees();
    } else {
        textElement.innerHTML = texts[textIndex];
    }
}

function questionSuivante() {
    questionIndex++;
    if (questionIndex >= listeQuestions.length) {
        console.log("Texte terminé, texte suivant");
        texteSuivant();
    } else {
        questionElement.innerHTML = listeQuestions[questionIndex].q;
    }
}

function afficherErreur() {
    if (erreurDiv) {
        erreurDiv.textContent = "Réponse incorrecte. Veuillez réessayer avec une nouvelle réponse.";
        erreurDiv.style.display = "block";
    }
}

function desafficherErreur() {
    if (erreurDiv) {
        erreurDiv.textContent = "";
        erreurDiv.style.display = "none";
    }
}

function verifierReponse(reponse) {
    if (reponse.toLowerCase().includes(listeQuestions[questionIndex].r.toLowerCase())) {
        return true;
    } else {
        return false;
    }
}

// ---------------------------
//       ENVOYER LES DONNÉES
// ---------------------------

function savedata(data) {
    let xhr = new XMLHttpRequest();
    let url =
        "../savedata.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log(">>>>>>>> ENVOI JSON", JSON.stringify(data));
    xhr.send(JSON.stringify(data));
}

function envoyerDonnees() {
    const donnees = {
        "utilisateur": {
            "age": Number(localStorage.getItem("userAge")),
            "genre": Number(localStorage.getItem("userGenre")),
            "daltonisme": Number(localStorage.getItem("userDaltonisme")),
            "dyslexie": Number(localStorage.getItem("userDyslexie"))
        },
        essai: reponses
    };

    savedata(donnees);
}