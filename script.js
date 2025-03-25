// Fonction pour changer de langue et recharger la page avec la langue sélectionnée
function switchLanguage(lang) {
    localStorage.setItem('lang', lang); // Sauvegarde la langue
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
}

// Fonction pour appliquer la langue sélectionnée au chargement de la page
function applyLanguage() {
    const lang = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('lang') || 'fr';

    document.querySelectorAll('[data-lang]').forEach(element => {
        element.style.display = element.getAttribute('data-lang') === lang ? 'block' : 'none';
    });

    document.documentElement.lang = lang;
}

// Fonction pour appliquer le thème (clair ou sombre)
function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;
    const themeIcons = document.querySelectorAll('#theme-icon'); // Sélectionne toutes les icônes de thème

    html.classList.remove('light', 'dark');
    html.classList.add(savedTheme);

    // Mettre à jour toutes les icônes de thème
    themeIcons.forEach(icon => {
        icon.src = savedTheme === 'dark' ? 'Images/moon.jpg' : 'Images/sun.jpg';
    });
}

// Fonction pour basculer entre le thème clair et sombre
function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.classList.contains('light') ? 'dark' : 'light';
    const themeIcons = document.querySelectorAll('#theme-icon'); // Sélectionne toutes les icônes de thème

    html.classList.remove('light', 'dark');
    html.classList.add(newTheme);

    localStorage.setItem('theme', newTheme);

    // Mettre à jour toutes les icônes de thème
    themeIcons.forEach(icon => {
        icon.src = newTheme === 'dark' ? 'Images/moon.jpg' : 'Images/sun.jpg';
    });
}

// Variables pour la détection du scroll
////////////////////////////////////////////////////////////////////////////////////////

let atBottom = false;
let canNavigate = false;
let lastTouchY = 0;
const nextPageMessage = document.getElementById("next-page-message");

function handleScroll() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 5) {
        if (!atBottom) {
            atBottom = true;
            canNavigate = false;
            console.log("Vous êtes en bas, scrollez encore pour passer à la page suivante !");

            setTimeout(() => {
                canNavigate = true;
            }, 500);
        }
    } else if (scrollTop + windowHeight < documentHeight - 50) {
        atBottom = false;
        canNavigate = false;
    }
}

// Affiche un message avant de changer de page
function showNextPageMessage(callback) {
    let lang = document.documentElement.lang; // Récupérer la langue actuelle
    let nextPageMessage = document.querySelector(`#next-page-message[data-lang='${lang}']`);

    if (!nextPageMessage) return;

    nextPageMessage.style.display = "block";
    nextPageMessage.style.opacity = "1";

    setTimeout(() => {
        nextPageMessage.style.opacity = "0";
        setTimeout(() => {
            nextPageMessage.style.display = "none";
            callback(); // Passe à la page suivante après l'animation du message
        }, 300);
    }, 1000);
}

// Détecte un deuxième scroll avec une souris
function detectSecondScroll(event) {
    if (atBottom && canNavigate && event.deltaY > 30) {
        showNextPageMessage(goToNextPage);
    }
}

// Détecte un deuxième scroll avec un touchpad ou un écran tactile
function detectTouchMove(event) {
    if (!atBottom || !canNavigate) return;

    let currentTouchY = event.touches[0].clientY;
    if (lastTouchY > 0 && lastTouchY - currentTouchY > 50) {
        showNextPageMessage(goToNextPage);
    }
    lastTouchY = currentTouchY;
}

// Réinitialise le touch lorsqu'on lève le doigt
function resetTouch() {
    lastTouchY = 0;
}

// Fonction pour changer de page
function goToNextPage() {
    const pages = ["index.html", "info_persos.html", "grid.html", "index.html"];
    const currentPage = window.location.pathname.split("/").pop();
    const currentIndex = pages.indexOf(currentPage);

    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
        const nextPage = pages[currentIndex + 1];
        const nextLink = document.querySelector(`a[href="${nextPage}"]`);

        if (nextLink) {
            nextLink.click(); // Simule un clic sur le lien
        } else {
            window.location.href = nextPage; // Redirige si aucun lien n'est trouvé
        }
    } else {
        console.log("Aucune page suivante !");
    }
}

function updateActiveTab() {
    const currentPage = window.location.pathname.split("/").pop();
    const lang = document.documentElement.lang;

    // Supprimer la classe active-tab de tous les liens
    document.querySelectorAll("nav a").forEach(link => {
        link.classList.remove("active-tab");
    });

    // Ajouter la classe active-tab au lien correspondant à la page actuelle
    document.querySelectorAll(`nav a[data-lang='${lang}']`).forEach(link => {
        if (link.getAttribute("href").includes(currentPage)) {
            link.classList.add("active-tab");
        }
    });
}

// Ajout des écouteurs d'événements
window.addEventListener("scroll", handleScroll);
window.addEventListener("wheel", detectSecondScroll);
window.addEventListener("touchmove", detectTouchMove);
window.addEventListener("touchend", resetTouch);

// Appliquer le thème et mettre à jour les liens actifs au chargement de la page
window.onload = () => {
    applyLanguage();
    applyTheme();
    updateActiveTab();

    // Cacher tous les messages "Aller sur la prochaine page" au chargement
    document.querySelectorAll("#next-page-message").forEach(msg => {
        msg.style.display = "none";
        msg.style.opacity = "0";
    });
};
