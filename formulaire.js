// ---------------------------
//       FORMULAIRE
// ---------------------------
document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();

    const keys = [
        "testNumber",
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

    // Stockage des données
    const params = new URLSearchParams(window.location.search);
    const testNumber = params.get("test");

    localStorage.setItem("testNumber", testNumber);
    localStorage.setItem("userAge", age);
    localStorage.setItem("userGenre", genre);
    localStorage.setItem("userDaltonisme", daltonisme);
    localStorage.setItem("userDyslexie", dyslexie);

    window.location.href = `test.html`;
});