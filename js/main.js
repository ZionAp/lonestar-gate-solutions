// LoneStar Gate Solutions - JavaScript Functionality

document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const prefersReducedMotion = !!(motionQuery && motionQuery.matches);

    let headerHeight = header ? header.offsetHeight : 0;

    function updateHeaderHeight() {
        headerHeight = header ? header.offsetHeight : 0;
        document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
    }

    updateHeaderHeight();

    if (header && 'ResizeObserver' in window) {
        new ResizeObserver(updateHeaderHeight).observe(header);
    } else {
        window.addEventListener('resize', updateHeaderHeight);
    }

    // Mobile Navigation Toggle
    function closeNav() {
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeNav();
                navToggle.focus();
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

            window.scrollTo({
                top: Math.max(targetPosition, 0),
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });

            if (window.history.replaceState) {
                window.history.replaceState(null, '', href);
            }
        });
    });

    // Update active nav link on scroll
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const navLinks = document.querySelectorAll('.nav-link');
    let ticking = false;

    function updateActiveNav() {
        const scrollPosition = window.scrollY + headerHeight + 100;
        let current = sections.length ? sections[0].id : '';

        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === '#' + current;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateActiveNav);
            ticking = true;
        }
    }, { passive: true });

    updateActiveNav();

    // Contact Form Handling
    const quoteForm = document.getElementById('quoteForm');
    const formStatus = document.getElementById('formStatus');

    function setFormStatus(message, type) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = 'form-status' + (type ? ' ' + type : '');
    }

    if (quoteForm) {
        quoteForm.addEventListener('input', function () {
            setFormStatus('', '');
        });

        quoteForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(quoteForm);
            const name = String(formData.get('name') || '').trim();
            const phone = String(formData.get('phone') || '').trim();
            const service = formData.get('service');

            if (!name || !phone || !service) {
                setFormStatus('Please fill in all required fields (Name, Phone, Service Needed).', 'error');

                const firstInvalid = !name
                    ? document.getElementById('name')
                    : !phone
                        ? document.getElementById('phone')
                        : document.getElementById('service');

                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            if (!submitBtn || submitBtn.disabled) return;

            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-check"></use></svg> Request Sent!';
            submitBtn.disabled = true;
            submitBtn.classList.add('is-success');
            setFormStatus('', '');

            setTimeout(function () {
                setFormStatus(
                    'Thank you ' + name + '! Your quote request has been received. ' +
                    'We will call you at ' + phone + ' within 24 hours to discuss your ' + service + ' project.',
                    'success'
                );
                quoteForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('is-success');
            }, 800);
        });
    }

    // Cycling slideshows (hero background + about photo)
    function initSlideshow(slides, interval) {
        if (!slides || slides.length < 2 || prefersReducedMotion) return;

        let index = 0;
        let timer = null;

        // Hero slides defer their background image to a CSS class so the
        // browser only downloads images as they are needed. Load the next
        // slide's background one step early to avoid a visible gap.
        function loadSlide(at) {
            const slide = slides[(at + slides.length) % slides.length];
            const id = slide && slide.dataset ? slide.dataset.slide : '';
            if (id) slide.classList.add('hero-slide--' + id);
        }

        loadSlide(0);
        loadSlide(1);

        function showNext() {
            slides[index].classList.remove('is-active');
            index = (index + 1) % slides.length;
            loadSlide(index);
            loadSlide(index + 1);
            slides[index].classList.add('is-active');
        }

        function start() {
            if (timer) return;
            timer = setInterval(showNext, interval);
        }

        function stop() {
            clearInterval(timer);
            timer = null;
        }

        start();

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        });
    }

    initSlideshow(document.querySelectorAll('.hero-slide'), 5000);
    initSlideshow(document.querySelectorAll('.about-slide'), 4500);

    // Generic horizontal carousel with arrows and optional dots
    function initCarousel(options) {
        const track = document.getElementById(options.track);
        const prev = document.getElementById(options.prev);
        const next = document.getElementById(options.next);
        if (!track || !prev || !next) return;

        const itemSelector = options.item;
        const dotsContainer = options.dots ? document.getElementById(options.dots) : null;
        const dots = [];

        function step() {
            const items = track.querySelectorAll(itemSelector);
            if (items.length < 2) {
                const only = items[0];
                return only ? only.getBoundingClientRect().width : track.clientWidth;
            }
            const first = items[0].getBoundingClientRect();
            const second = items[1].getBoundingClientRect();
            return (second.left - first.left) || first.width;
        }

        function scrollTo(index) {
            track.scrollTo({ left: index * step(), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }

        function syncDots() {
            if (!dots.length) return;
            const index = Math.round(track.scrollLeft / step());
            dots.forEach((dot, i) => {
                const active = i === index;
                dot.classList.toggle('is-active', active);
                dot.setAttribute('aria-selected', String(active));
            });
        }

        function updateArrows() {
            const maxScroll = track.scrollWidth - track.clientWidth - 1;
            prev.disabled = track.scrollLeft <= 0;
            next.disabled = track.scrollLeft >= maxScroll;
            syncDots();
        }

        if (dotsContainer) {
            const itemCount = track.querySelectorAll(itemSelector).length;
            for (let i = 0; i < itemCount; i++) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'testimonials-dot';
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
                dot.addEventListener('click', () => scrollTo(i));
                dotsContainer.appendChild(dot);
                dots.push(dot);
            }
        }

        prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
        next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
        track.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        updateArrows();
    }

    initCarousel({ track: 'galleryTrack', prev: 'galleryPrev', next: 'galleryNext', item: '.gallery-item' });
    initCarousel({ track: 'testimonialsTrack', prev: 'testimonialsPrev', next: 'testimonialsNext', item: '.testimonial-card', dots: 'testimonialsDots' });

    // Scroll reveal animation
    const revealTargets = document.querySelectorAll('.service-card, .service-detail, .about-feature');

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealTargets.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }

    // Service area selector
    const areasGrid = document.getElementById('areasGrid');
    const areaTitle = document.getElementById('areaTitle');
    const areaBlurb = document.getElementById('areaBlurb');

    if (areasGrid && areaTitle && areaBlurb) {
        const areaItems = Array.from(areasGrid.querySelectorAll('.area-item'));

        areaItems.forEach(function (item) {
            item.addEventListener('click', function () {
                if (item.classList.contains('is-active')) return;

                areaItems.forEach(function (other) {
                    const active = other === item;
                    other.classList.toggle('is-active', active);
                    other.setAttribute('aria-pressed', String(active));
                });

                const city = item.getAttribute('data-city') || item.textContent.trim();
                const blurb = item.getAttribute('data-blurb') || '';

                areaBlurb.classList.add('is-changing');
                if (prefersReducedMotion) {
                    areaTitle.textContent = city + ' Coverage';
                    areaBlurb.textContent = blurb;
                    areaBlurb.classList.remove('is-changing');
                    return;
                }

                setTimeout(function () {
                    areaTitle.textContent = city + ' Coverage';
                    areaBlurb.textContent = blurb;
                    areaBlurb.classList.remove('is-changing');
                }, 250);
            });
        });
    }

    // Update copyright year
    const year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }
});
