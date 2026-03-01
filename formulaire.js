// ---------------------------
//       FORMULAIRE
// ---------------------------
// 1. On vérifie l'ID dès que le script est lu par le navigateur
const params = new URLSearchParams(window.location.search);
const participantId = params.get("id");

if (!participantId) {
    // Bloquer immédiatement : on écrase le contenu de la page
    document.body.innerHTML = `
        <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
            <h1>Erreur : Accès invalide</h1>
            <p>Aucun identifiant participant n'a été détecté dans l'URL.</p>
            <p>Veuillez vérifier votre lien de connexion.</p>
        </div>
    `;
} else {
    // 2. Si l'ID est là, on attache l'écouteur du formulaire
    document.getElementById("form").addEventListener("submit", (e) => {
        e.preventDefault();

        const keys = [
        "userId",
        "userAge",
        "userGenre",
        "userDaltonisme",
        "userDyslexie"
    ];

    keys.forEach(k => localStorage.removeItem(k));

    const age = document.getElementById("age").value.trim();

    const genreElements = document.getElementsByName("genre");
    let genre = Array.from(genreElements).find(el => el.checked)?.value;

    const daltonismeElements = document.getElementsByName("daltonisme");
    let daltonisme = Array.from(daltonismeElements).find(el => el.checked)?.value;

    const dyslexieElements = document.getElementsByName("dyslexie");
    let dyslexie = Array.from(dyslexieElements).find(el => el.checked)?.value;

    const consentement = document.getElementById("consentement").checked;

    // Vérification de tous les champs
    if (!age) {
        alert("Veuillez indiquer votre âge.");
        return;
    }
    if (!genre) {
        alert("Veuillez sélectionner un genre.");
        return;
    }
    if (daltonisme != 0 || dyslexie != 0) {
        alert("Désolé, les critères d'inclusion requièrent de ne pas être daltonien ou dyslexique.");
        return;
    }
    if (!consentement) {
        alert("Merci de cocher la case de consentement.");
        return;
    }

        // Stockage des données (on utilise le participantId qu'on a déjà vérifié plus haut)
        localStorage.setItem("userId", participantId);
        localStorage.setItem("userAge", age);
        localStorage.setItem("userGenre", genre);
        localStorage.setItem("userDaltonisme", daltonisme);
        localStorage.setItem("userDyslexie", dyslexie);

        window.location.href = `test.html?id=${participantId}`;
    });
}