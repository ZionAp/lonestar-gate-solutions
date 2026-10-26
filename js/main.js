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
        if (!sections.length) return;

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

    function showQuoteResult() {
        const params = new URLSearchParams(window.location.search);
        const result = params.get('quote');
        if (!result) return;

        if (result === 'sent') {
            setFormStatus('Thank you! Your quote request has been sent. We will contact you within 24 hours.', 'success');
        } else if (result === 'error') {
            setFormStatus('We could not send your request. Please call (737) 265-4627 or email lonestargatesrepair@gmail.com.', 'error');
        }

        if (window.history && typeof window.history.replaceState === 'function') {
            window.history.replaceState({}, '', window.location.pathname + window.location.hash);
        }
    }

    if (quoteForm) {
        quoteForm.addEventListener('input', function () {
            setFormStatus('', '');
        });

        quoteForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (quoteForm.dataset.submitting === 'true') return;

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

            if (typeof window.fetch !== 'function') {
                quoteForm.submit();
                return;
            }

            const originalText = submitBtn.innerHTML;
            const controller = typeof window.AbortController === 'function' ? new window.AbortController() : null;
            const timeoutId = window.setTimeout(function () {
                if (controller) controller.abort();
            }, 15000);

            let succeeded = false;
            quoteForm.dataset.submitting = 'true';
            setFormStatus('Sending your request...', '');
            submitBtn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-paper-plane"></use></svg> Sending...';
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');

            try {
                const options = {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                };
                if (controller) options.signal = controller.signal;

                const response = await fetch(quoteForm.action, options);
                let payload = {};
                try {
                    payload = await response.json();
                } catch (error) {
                    payload = {};
                }

                if (!response.ok || !payload.ok) {
                    throw new Error(payload.message || 'We could not send your request. Please call (737) 265-4627 or email lonestargatesrepair@gmail.com.');
                }

                succeeded = true;
                quoteForm.reset();
                setFormStatus(payload.message || 'Thank you! Your quote request has been sent. We will contact you within 24 hours.', 'success');
                submitBtn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-check"></use></svg> Request Sent!';
                submitBtn.classList.add('is-success');

                window.setTimeout(function () {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');
                    submitBtn.classList.remove('is-success');
                }, 800);
            } catch (error) {
                const message = error && error.name === 'AbortError'
                    ? 'The request timed out. Please call (737) 265-4627 or email lonestargatesrepair@gmail.com.'
                    : 'We could not send your request. Please call (737) 265-4627 or email lonestargatesrepair@gmail.com.';
                setFormStatus(message, 'error');
            } finally {
                window.clearTimeout(timeoutId);
                delete quoteForm.dataset.submitting;

                if (!succeeded) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');
                    submitBtn.classList.remove('is-success');
                }
            }
        });

        showQuoteResult();
    }

    // Cycling slideshows (hero background + about photo)
    function initSlideshow(slides, interval) {
        if (!slides || slides.length < 2 || prefersReducedMotion) return;

        let index = 0;
        let timer = null;

        function showNext() {
            slides[index].classList.remove('is-active');
            index = (index + 1) % slides.length;
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
    const areaGuideLink = document.getElementById('areaGuideLink');
    const areaGuideLabel = document.getElementById('areaGuideLabel');

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

                if (areaGuideLink) {
                    const slug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    areaGuideLink.href = 'areas/' + slug + '.html';
                    areaGuideLink.setAttribute('aria-label', 'Read the ' + city + ' gate service guide');
                    if (areaGuideLabel) areaGuideLabel.textContent = 'Read the ' + city + ' gate guide';
                }

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
