document.addEventListener('DOMContentLoaded', () => {
    const zoomElements = document.querySelectorAll('.zoomable');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxContainer = lightbox.querySelector('div');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentGallery = [];
    let currentImgIdx = 0;

    const updateLightboxContent = () => {
        lightboxImg.setAttribute('src', currentGallery[currentImgIdx]);

        if (currentGallery.length > 1) {
            lightboxPrev.classList.remove('hidden');
            lightboxNext.classList.remove('hidden');
            lightboxCounter.classList.remove('hidden');
            lightboxCounter.textContent = `${currentImgIdx + 1} / ${currentGallery.length}`;
        } else {
            lightboxPrev.classList.add('hidden');
            lightboxNext.classList.add('hidden');
            lightboxCounter.classList.add('hidden');
        }
    };

    zoomElements.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();

            const galleryData = img.getAttribute('data-gallery');
            if (galleryData) {
                currentGallery = galleryData.split(',');
            } else {
                currentGallery = [img.getAttribute('src')];
            }
            currentImgIdx = 0;

            const alt = img.getAttribute('alt');
            const desc = img.getAttribute('data-description');

            lightboxImg.setAttribute('alt', alt);

            const caption = document.getElementById('lightbox-caption');
            if (desc) {
                caption.innerHTML = desc;
                caption.classList.remove('hidden');
                // Memberikan sedikit waktu agar transisi opacity berjalan setelah hidden dihapus
                setTimeout(() => caption.classList.remove('opacity-0'), 10);
            } else {
                caption.classList.add('hidden', 'opacity-0');
            }

            updateLightboxContent();

            lightbox.classList.remove('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                lightboxContainer.classList.remove('scale-95');
                lightboxContainer.classList.add('scale-100');
            }, 10);
        });
    });

    const closeLightbox = () => {
        lightboxContainer.classList.remove('scale-100');
        lightboxContainer.classList.add('scale-95');
        lightbox.classList.add('opacity-0', 'pointer-events-none');
        const caption = document.getElementById('lightbox-caption');
        caption.classList.add('opacity-0');
    };

    lightbox.addEventListener('click', closeLightbox);

    // Slider controls
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIdx = (currentImgIdx + 1) % currentGallery.length;
        updateLightboxContent();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIdx = (currentImgIdx - 1 + currentGallery.length) % currentGallery.length;
        updateLightboxContent();
    });

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight' && !lightbox.classList.contains('pointer-events-none')) lightboxNext.click();
        if (e.key === 'ArrowLeft' && !lightbox.classList.contains('pointer-events-none')) lightboxPrev.click();
    });

    // Mobile/Click Dropdown Logic
    const projectsBtn = document.getElementById('projects-btn');
    const projectsWrapper = document.getElementById('projects-wrapper');

    // Mobile Sidebar Toggle Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const openSidebar = () => {
        mobileSidebar.classList.remove('-translate-x-full');
        mobileSidebarOverlay.classList.remove('opacity-0', 'pointer-events-none');
        document.body.classList.add('overflow-hidden');
        // Tambahkan state ke history agar tombol 'Back' bisa menutup sidebar
        history.pushState({ sidebarOpen: true }, '');
    };

    const closeSidebar = (isPopState = false) => {
        mobileSidebar.classList.add('-translate-x-full');
        mobileSidebarOverlay.classList.add('opacity-0', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
        // Jika ditutup manual (bukan tombol back), kita hapus state dari history
        if (!isPopState && history.state?.sidebarOpen) {
            history.back();
        }
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => closeSidebar());
    if (mobileSidebarOverlay) mobileSidebarOverlay.addEventListener('click', () => closeSidebar());

    // Menangani tombol 'Back' di handphone
    window.addEventListener('popstate', (event) => {
        if (!mobileSidebar.classList.contains('-translate-x-full')) {
            closeSidebar(true);
        }
    });

    // Tutup sidebar saat salah satu link diklik
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileSidebar.classList.contains('-translate-x-full')) {
                closeSidebar();
            }
        });
    });

    projectsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        projectsWrapper.classList.toggle('dropdown-active');
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', (e) => {
        if (!projectsWrapper.contains(e.target)) {
            projectsWrapper.classList.remove('dropdown-active');
        }
    });

    // Close dropdown when a link inside is clicked (for smoother navigation)
    const dropdownLinks = projectsWrapper.querySelectorAll('a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            projectsWrapper.classList.remove('dropdown-active');
        });
    });

    // Responsive AOS: Ubah slide-in (left/right) menjadi fade-up di mobile
    if (window.innerWidth < 1024) {
        const slideElements = document.querySelectorAll('[data-aos="fade-left"], [data-aos="fade-right"]');
        slideElements.forEach(el => {
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', '0'); // Opsional: hilangkan delay agar lebih responsif di HP
        });
    }

    // Logika Tombol Kembali ke Atas
    const backToTopBtn = document.getElementById('back-to-top');
    const progressRing = document.getElementById('progress-ring');
    const circumference = 2 * Math.PI * 22; // 138.23

    window.addEventListener('scroll', () => {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const scrollPercentage = scrollPosition / scrollTotal;

        // Update Progress Ring
        const offset = circumference - (scrollPercentage * circumference);
        progressRing.style.strokeDashoffset = offset;

        if (scrollPosition > 400) {
            backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
            backToTopBtn.classList.add('opacity-100');
        } else {
            backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            backToTopBtn.classList.remove('opacity-100');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
});