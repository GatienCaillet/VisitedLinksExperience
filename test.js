// ---------------------------
//       LISTES DE TESTS
// ---------------------------

var reponse = [];
let testNumber = localStorage.getItem("testNumber");

if (testNumber != "1" && testNumber != "2") {
    alert("Numéro de test non défini. Veuillez contacter les expérimentateurs.");
} else if (testNumber === "1") {
    
} else if (testNumber === "2") {
    
}

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


// ---------------------------
//      MÉCANISME STIMULI
// ---------------------------

function texteSuivant() {

}

function temps() {

}

function afficherErreur() {
    
}

function desafficherErreur() {
}

function verifierReponse() {
    
};

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
        essai: reponse
    };

    savedata(donnees);
}