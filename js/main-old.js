document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    // 1. GESTION DU MENU MOBILE
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            
            // Toggle de l'état du menu
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('open');
            mainNav.classList.toggle('active');

            // Empêche le défilement du corps pendant que le menu est ouvert
            document.body.classList.toggle('no-scroll');
        });
        
        // Fermer le menu si un lien est cliqué (UX mobile)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    menuToggle.click(); // Simule un clic pour fermer
                }
            });
        });
    }

    // 2. GESTION DU CARROUSEL (Fonctionnalité simple - à étendre pour un carrousel complet)
    const carrousels = document.querySelectorAll('.photo-carrousel');
    
    carrousels.forEach(carrousel => {
        // Ajout d'une fonctionnalité simple de scroll par défaut pour l'UX mobile
        // Pour une version complète avec flèches et pagination, un framework ou un script plus lourd serait nécessaire.
        // Ici, on se concentre sur la structure HTML/CSS et l'ergonomie.
        
        console.log("Carrousel détecté. Utilisez les flèches du clavier ou le glisser-déposer sur mobile.");
    });
    
    // Exemple de script pour empêcher le défilement (définir .no-scroll dans le CSS)
    const styleSheet = document.createElement('style');
    styleSheet.innerText = '.no-scroll { overflow: hidden; }';
    document.head.appendChild(styleSheet);
});