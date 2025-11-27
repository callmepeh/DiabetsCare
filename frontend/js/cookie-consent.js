/**
 * cookie-consent.js
 * 
 * Gerencia a exibição e o consentimento do banner de cookies.
 */

// Função auxiliar para obter o valor de um cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Função auxiliar para definir um cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // O cookie de consentimento é acessível via JS (não HttpOnly)
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Strict";
}

// Função principal para gerenciar o banner
function handleCookieConsent() {
    const consentCookie = getCookie('cookie_consent');
    const banner = document.getElementById('cookie-consent-banner');

    // Se o cookie de consentimento não existir, exibe o banner
    if (!consentCookie && banner) {
        banner.style.display = 'block';
    }

    // Adiciona o listener de evento ao botão de aceitar
    const acceptButton = document.getElementById('accept-cookies');
    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            // Define o cookie de consentimento por 365 dias
            setCookie('cookie_consent', 'accepted', 365);
            // Oculta o banner
            if (banner) {
                banner.style.display = 'none';
            }
            console.log('Cookies aceitos.');
        });
    }
}

// Executa a função quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', handleCookieConsent);
