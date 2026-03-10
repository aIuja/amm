
// 1. TU LÓGICA DE ANIMACIONES (Sin cambios, asegurando funcionamiento)
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatableElements = document.querySelectorAll('.fade-in, .slide-up');
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });

    

    // 2. TU LÓGICA DEL MENÚ HAMBURGUESA
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        document.querySelectorAll(".nav-links li a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }
});

// 3. INICIALIZACIÓN DE LENIS (Separada para evitar errores de carga)
// Solo se ejecuta si la librería está cargada correctamente en el HTML
if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}
/* =========================================
   INTEGRACIÓN WEB3FORMS (FORMULARIO CONTACTO)
   ========================================= */
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita que la página salte
        
        // Estado de carga
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Enviando...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        // Enviar silenciosamente
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(async (response) => {
            if (response.status == 200) {
                // Éxito
                submitBtn.innerText = '¡Propuesta Enviada!';
                submitBtn.style.backgroundColor = '#4CAF50';
                submitBtn.style.color = '#fff';
                
                formStatus.style.display = 'block';
                formStatus.style.color = '#4CAF50';
                formStatus.innerText = 'Tu mensaje ha sido enviado al equipo de AMM Globality. Te contactaremos pronto.';
                
                contactForm.reset(); 
            } else {
                throw new Error('Error en el servidor');
            }
        })
        .catch(error => {
            // Error
            submitBtn.innerText = 'Error al enviar';
            submitBtn.style.backgroundColor = '#ff4444';
            formStatus.style.display = 'block';
            formStatus.style.color = '#ff4444';
            formStatus.innerText = 'Hubo un error al enviar. Por favor, escríbenos a contacto@ammglobalitylabel.com';
        })
        .finally(() => {
            // Restaurar botón tras 4 segundos
            setTimeout(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
                submitBtn.disabled = false;
                formStatus.style.display = 'none';
            }, 4000);
        });
    });
}