(function() {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Header Scroll State + Back to Top
    var header = document.querySelector('.site-header');
    var backToTop = document.querySelector('.back-to-top');
    var ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                var scrollY = window.pageYOffset || document.documentElement.scrollTop;
                if (header) {
                    if (scrollY > 40) {
                        header.classList.add('is-scrolled');
                    } else {
                        header.classList.remove('is-scrolled');
                    }
                }
                if (backToTop) {
                    if (scrollY > 700) {
                        backToTop.classList.add('show');
                    } else {
                        backToTop.classList.remove('show');
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    // 2. Mobile Navigation
    var navToggle = document.querySelector('.nav-toggle');
    var navClose = document.querySelector('.nav-panel-close');
    var navPanel = document.querySelector('.nav-panel');
    var navLinks = document.querySelectorAll('.nav-panel a');
    var body = document.body;

    function openNav() {
        if (!navPanel) return;
        body.classList.add('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Close menu');
        }
    }

    function closeNav() {
        if (!navPanel) return;
        body.classList.remove('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
        }
    }

    function toggleNav() {
        if (body.classList.contains('nav-open')) {
            closeNav();
        } else {
            openNav();
        }
    }

    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleNav();
        });
    }

    if (navClose) {
        navClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeNav();
        });
    }

    if (navLinks && navLinks.length) {
        Array.prototype.forEach.call(navLinks, function(link) {
            link.addEventListener('click', function() {
                closeNav();
            });
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if ((e.key === 'Escape' || e.keyCode === 27) && body.classList.contains('nav-open')) {
            closeNav();
        }
    });

    // 3. Scroll Reveal
    var revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            Array.prototype.forEach.call(revealElements, function(el) {
                el.classList.add('in-view');
            });
        } else {
            var revealObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -8% 0px'
            });

            Array.prototype.forEach.call(revealElements, function(el) {
                revealObserver.observe(el);
            });
        }
    }

    // 4. Real Ring 3D Stage Interactive Perspective Tilt (Optimized with requestAnimationFrame)
    var ringShowcase = document.getElementById('ringShowcase');
    if (ringShowcase && !prefersReducedMotion) {
        var tiltTicking = false;
        ringShowcase.addEventListener('mousemove', function(e) {
            if (!tiltTicking) {
                requestAnimationFrame(function() {
                    var rect = ringShowcase.getBoundingClientRect();
                    var x = (e.clientX - rect.left) / rect.width - 0.5;
                    var y = (e.clientY - rect.top) / rect.height - 0.5;
                    ringShowcase.style.transform = 'perspective(900px) rotateY(' + (x * 8).toFixed(2) + 'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg)';
                    tiltTicking = false;
                });
                tiltTicking = true;
            }
        }, { passive: true });
        ringShowcase.addEventListener('mouseleave', function() {
            ringShowcase.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
        });
    }

    // ============================================================
    // 🎯 RING ROTATION SPEED CONTROLLER (LINE 156):
    // Change this value to adjust the 360 rotation speed:
    // 1.0  = Standard speed
    // 0.8  = Slower & Graceful (Recommended)
    // 0.6  = Extra Slow & Luxurious
    // 1.25 = Faster
    // ============================================================
    var realRingVid = document.querySelector('.real-ring-video');
    if (realRingVid) {
        realRingVid.playbackRate = 0.85; // <-- YEH LINE HAI! Change this number to control speed

        var playPromise = realRingVid.play();
        if (playPromise !== undefined) {
            playPromise.catch(function() {
                realRingVid.muted = true;
                realRingVid.play();
            });
        }
    }

    // 5. Stat Counter Animation
    var statElements = document.querySelectorAll('.stat .num[data-count-to]');
    
    function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }
    
    function animateCount(el) {
        var target = parseFloat(el.getAttribute('data-count-to'));
        if (isNaN(target)) return;
        
        if (prefersReducedMotion) {
            el.textContent = target;
            return;
        }

        var duration = 1200;
        var startTimestamp = null;
        var startValue = 0;

        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            var progress = Math.min((timestamp - startTimestamp) / duration, 1);
            var current = Math.floor(startValue + (target - startValue) * easeOutCubic(progress));
            el.textContent = current;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }
        window.requestAnimationFrame(step);
    }

    if (statElements.length > 0) {
        if ('IntersectionObserver' in window && !prefersReducedMotion) {
            var statObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            Array.prototype.forEach.call(statElements, function(el) {
                el.textContent = '0';
                statObserver.observe(el);
            });
        } else {
            Array.prototype.forEach.call(statElements, function(el) {
                animateCount(el);
            });
        }
    }

    // 6. FAQ Accordion
    var faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        Array.prototype.forEach.call(faqItems, function(item) {
            var q = item.querySelector('.faq-q');
            if (q) {
                q.addEventListener('click', function() {
                    var isOpen = item.getAttribute('data-open') === 'true' || item.hasAttribute('data-open');
                    
                    // Close all
                    Array.prototype.forEach.call(faqItems, function(otherItem) {
                        otherItem.removeAttribute('data-open');
                        otherItem.setAttribute('data-open', 'false');
                        var otherQ = otherItem.querySelector('.faq-q');
                        if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
                    });
                    
                    if (!isOpen) {
                        item.setAttribute('data-open', 'true');
                        q.setAttribute('aria-expanded', 'true');
                    }
                });
            }
        });
    }

    // 7. Portfolio Filter
    var filterBtns = document.querySelectorAll('.filter-btn');
    var portfolioCards = document.querySelectorAll('.portfolio-card');
    
    if (filterBtns.length > 0 && portfolioCards.length > 0) {
        Array.prototype.forEach.call(filterBtns, function(btn) {
            btn.addEventListener('click', function() {
                var category = this.getAttribute('data-filter') || this.getAttribute('data-category');
                
                // Update active state on buttons
                Array.prototype.forEach.call(filterBtns, function(fb) {
                    fb.setAttribute('aria-pressed', 'false');
                    fb.classList.remove('active', 'is-active');
                });
                this.setAttribute('aria-pressed', 'true');
                this.classList.add('is-active');

                var visibleCount = 0;
                
                Array.prototype.forEach.call(portfolioCards, function(card) {
                    var cardCat = card.getAttribute('data-category');
                    if (category === 'all' || category === cardCat) {
                        card.style.display = '';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Handle empty state
                var emptyState = document.querySelector('[data-filter-empty], .portfolio-empty-state');
                if (emptyState) {
                    if (visibleCount === 0) {
                        emptyState.style.display = 'block';
                    } else {
                        emptyState.style.display = 'none';
                    }
                }
            });
        });
    }

    // 8. Contact Form Validation & Submission
    var contactForms = document.querySelectorAll('[data-contact-form]');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    function validateField(field) {
        var valid = true;
        var errorMsg = '';
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            valid = false;
            errorMsg = 'This field is required.';
        } else if (field.type === 'email' && field.value.trim() && !emailPattern.test(field.value)) {
            valid = false;
            errorMsg = 'Please enter a valid email address.';
        }
        
        if (!valid) {
            setFieldError(field, errorMsg);
        } else {
            clearFieldError(field);
        }
        
        return valid;
    }
    
    function setFieldError(field, msg) {
        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');
        var errEl = field.nextElementSibling;
        if (errEl && errEl.classList.contains('field-error')) {
            errEl.textContent = msg;
            errEl.style.display = 'block';
        } else {
            var err = document.createElement('div');
            err.className = 'field-error text-danger';
            err.style.color = 'var(--danger)';
            err.style.fontSize = '0.85em';
            err.style.marginTop = '4px';
            err.textContent = msg;
            field.parentNode.insertBefore(err, field.nextSibling);
        }
    }
    
    function clearFieldError(field) {
        field.classList.remove('is-invalid');
        field.setAttribute('aria-invalid', 'false');
        var errEl = field.nextElementSibling;
        if (errEl && errEl.classList.contains('field-error')) {
            errEl.style.display = 'none';
            errEl.textContent = '';
        }
    }

    if (contactForms.length > 0) {
        Array.prototype.forEach.call(contactForms, function(form) {
            var fields = form.querySelectorAll('input, textarea, select');
            
            Array.prototype.forEach.call(fields, function(field) {
                field.addEventListener('blur', function() {
                    validateField(this);
                });
                field.addEventListener('input', function() {
                    if (this.classList.contains('is-invalid')) {
                        validateField(this);
                    }
                });
            });
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var formValid = true;
                
                Array.prototype.forEach.call(fields, function(field) {
                    if (!validateField(field)) {
                        formValid = false;
                    }
                });
                
                var statusEl = form.querySelector('.form-status') || (function(){
                    var el = document.createElement('div');
                    el.className = 'form-status';
                    el.style.marginTop = '15px';
                    el.style.padding = '10px';
                    el.style.borderRadius = 'var(--radius-sm)';
                    form.appendChild(el);
                    return el;
                })();
                
                var statusText = statusEl.querySelector('span') || statusEl;
                
                if (formValid) {
                    var btn = form.querySelector('button[type="submit"]');
                    var origText = btn ? btn.innerHTML : 'Send Message';
                    if (btn) {
                        btn.disabled = true;
                        btn.innerHTML = 'Sending message...';
                    }
                    
                    var actionUrl = form.getAttribute('action') || 'https://formspree.io/f/mqpepbzr';
                    var formData = new FormData(form);
                    
                    fetch(actionUrl, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    })
                    .then(function(response) {
                        if (response.ok) {
                            return response.json();
                        } else {
                            return response.json().then(function(data) {
                                var errorMsg = 'Oops! There was a problem submitting your form.';
                                if (data && data.errors && data.errors.length > 0) {
                                    errorMsg = data.errors.map(function(err){ return err.message; }).join(', ');
                                }
                                throw new Error(errorMsg);
                            });
                        }
                    })
                    .then(function(data) {
                        statusText.textContent = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
                        statusEl.classList.remove('error');
                        statusEl.classList.add('show', 'success');
                        statusEl.style.display = 'flex';
                        
                        form.reset();
                        if (btn) {
                            btn.disabled = false;
                            btn.innerHTML = origText;
                        }
                        
                        setTimeout(function() {
                            statusEl.classList.remove('show', 'success');
                            statusEl.style.display = 'none';
                        }, 8000);
                    })
                    .catch(function(error) {
                        statusText.textContent = error.message || 'There was a problem sending your message. Please check your internet connection or email us directly.';
                        statusEl.classList.remove('success');
                        statusEl.classList.add('show', 'error');
                        statusEl.style.display = 'flex';
                        
                        if (btn) {
                            btn.disabled = false;
                            btn.innerHTML = origText;
                        }
                    });
                } else {
                    statusText.textContent = 'Please fill all required fields correctly before submitting.';
                    statusEl.classList.remove('success');
                    statusEl.classList.add('show', 'error');
                    statusEl.style.display = 'flex';
                }
            });
        });
    }

    // 9. Image Error Fallback
    var images = document.querySelectorAll('img[data-fallback]');
    if (images.length > 0) {
        Array.prototype.forEach.call(images, function(img) {
            img.addEventListener('error', function() {
                var fallbackText = img.getAttribute('data-fallback') || 'Image not available';
                // Create SVG placeholder data URI
                var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="#16161F" /><text x="50%" y="50%" fill="#C9A962" font-family="Inter, sans-serif" font-size="16" text-anchor="middle" dominant-baseline="middle">' + fallbackText + '</text></svg>';
                var encoded = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
                img.src = encoded;
            });
        });
    }

    // 10. Footer Year
    var yearEls = document.querySelectorAll('[data-year]');
    if (yearEls.length > 0) {
        var currentYear = new Date().getFullYear();
        Array.prototype.forEach.call(yearEls, function(el) {
            el.textContent = currentYear;
        });
    }

    // 11. Smooth Scroll for Anchor Links
    var anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    if (anchorLinks.length > 0) {
        Array.prototype.forEach.call(anchorLinks, function(link) {
            link.addEventListener('click', function(e) {
                var targetId = this.getAttribute('href');
                try {
                    var target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        var headerHeight = header ? header.offsetHeight : 80;
                        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        
                        window.scrollTo({
                            top: targetPos,
                            behavior: prefersReducedMotion ? 'auto' : 'smooth'
                        });
                        
                        // Update focus for accessibility
                        target.setAttribute('tabindex', '-1');
                        target.focus();
                    }
                } catch (err) {
                    // Ignore invalid selector syntax
                }
            });
        });
    }

})();
