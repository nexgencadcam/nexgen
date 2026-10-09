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

    // 3. Luxury Scroll Reveal with Automatic Grid Staggering
    var revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        // Group reveal elements by parent to assign smooth progressive delays
        var parents = [];
        Array.prototype.forEach.call(revealElements, function(el) {
            if (el.parentElement && parents.indexOf(el.parentElement) === -1) {
                parents.push(el.parentElement);
            }
        });
        parents.forEach(function(parent) {
            var children = parent.querySelectorAll(':scope > [data-reveal]');
            if (children.length > 1) {
                Array.prototype.forEach.call(children, function(child, idx) {
                    var delay = Math.min(idx * 0.12, 0.6);
                    child.style.setProperty('--reveal-delay', delay.toFixed(2) + 's');
                });
            }
        });

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
                threshold: 0.12,
                rootMargin: '0px 0px -6% 0px'
            });

            Array.prototype.forEach.call(revealElements, function(el) {
                revealObserver.observe(el);
            });
        }
    }

    // 4. Bespoke 3D Ring Stage Tilt & Dynamic Lighting Engine (Smooth Lerp Physics)
    var ringShowcase = document.getElementById('ringShowcase');
    var ringAmbientGlow = document.querySelector('.ring-ambient-glow');
    if (ringShowcase && !prefersReducedMotion) {
        var mouseTargetX = 0;
        var mouseTargetY = 0;
        var currentRotX = 0;
        var currentRotY = 0;
        var currentGlowX = 50;
        var currentGlowY = 50;
        var isHoveringRing = false;
        var stageAnimFrame = null;

        function update3DStage() {
            currentRotX += (mouseTargetY - currentRotX) * 0.08;
            currentRotY += (mouseTargetX - currentRotY) * 0.08;
            currentGlowX += ((50 + mouseTargetX * 1.5) - currentGlowX) * 0.08;
            currentGlowY += ((50 + mouseTargetY * 1.5) - currentGlowY) * 0.08;

            ringShowcase.style.transform = 
                'perspective(1100px) rotateX(' + (-currentRotX).toFixed(2) + 'deg) rotateY(' + currentRotY.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02)';
            
            if (ringAmbientGlow) {
                ringAmbientGlow.style.left = currentGlowX.toFixed(1) + '%';
                ringAmbientGlow.style.top = currentGlowY.toFixed(1) + '%';
            }

            if (Math.abs(mouseTargetX - currentRotY) > 0.01 || Math.abs(mouseTargetY - currentRotX) > 0.01 || isHoveringRing) {
                stageAnimFrame = requestAnimationFrame(update3DStage);
            } else {
                stageAnimFrame = null;
            }
        }

        var heroSec = ringShowcase.closest('.hero') || ringShowcase;
        heroSec.addEventListener('mousemove', function(e) {
            var rect = ringShowcase.getBoundingClientRect();
            var centerX = rect.left + rect.width / 2;
            var centerY = rect.top + rect.height / 2;
            var dx = (e.clientX - centerX) / (window.innerWidth * 0.38);
            var dy = (e.clientY - centerY) / (window.innerHeight * 0.38);
            
            mouseTargetX = Math.max(-1, Math.min(1, dx)) * 10;
            mouseTargetY = Math.max(-1, Math.min(1, dy)) * 10;
            isHoveringRing = true;

            if (!stageAnimFrame) {
                stageAnimFrame = requestAnimationFrame(update3DStage);
            }
        }, { passive: true });

        heroSec.addEventListener('mouseleave', function() {
            mouseTargetX = 0;
            mouseTargetY = 0;
            isHoveringRing = false;
            if (!stageAnimFrame) {
                stageAnimFrame = requestAnimationFrame(update3DStage);
            }
        });
    }

    // 4b. Luxury 3D CAD Gemological Wireframe & Diamond Facets Engine (Active across ALL pages to the footer)
    if (!prefersReducedMotion) {
        var globalCanvas = document.getElementById('globalParticleCanvas');
        if (!globalCanvas) {
            globalCanvas = document.createElement('canvas');
            globalCanvas.id = 'globalParticleCanvas';
            globalCanvas.className = 'global-particles-canvas';
            globalCanvas.setAttribute('aria-hidden', 'true');
            document.body.insertBefore(globalCanvas, document.body.firstChild);
        }

        var ctx = globalCanvas.getContext('2d');
        var nodes = [];
        var nodeCount = window.innerWidth < 768 ? 32 : 68;
        var pWidth = 0;
        var pHeight = 0;
        var mouseP = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, radius: 180 };
        var canvasActive = true;

        function resizeGlobalCanvas() {
            pWidth = globalCanvas.width = window.innerWidth;
            pHeight = globalCanvas.height = window.innerHeight;
        }
        resizeGlobalCanvas();
        window.addEventListener('resize', resizeGlobalCanvas, { passive: true });

        // 3D Wireframe Gem Models (Isometric Diamond Cut & Crystal Prism)
        function GemModel3D(type, scale) {
            this.type = type;
            this.scale = scale || 13;
            this.angleX = Math.random() * Math.PI * 2;
            this.angleY = Math.random() * Math.PI * 2;
            this.speedX = (Math.random() - 0.5) * 0.010;
            this.speedY = (Math.random() - 0.5) * 0.012;

            if (type === 'brilliant') {
                // Classic Brilliant Cut Diamond Wireframe Vertices
                this.vertices = [
                    {x: -0.6, y: -0.8, z: -0.6}, {x: 0.6, y: -0.8, z: -0.6},
                    {x: 0.6, y: -0.8, z: 0.6}, {x: -0.6, y: -0.8, z: 0.6},
                    {x: -1.0, y: -0.2, z: 0}, {x: 0, y: -0.2, z: -1.0},
                    {x: 1.0, y: -0.2, z: 0}, {x: 0, y: -0.2, z: 1.0},
                    {x: 0, y: 1.0, z: 0}
                ];
                this.edges = [
                    [0,1],[1,2],[2,3],[3,0],
                    [0,4],[0,5],[1,5],[1,6],[2,6],[2,7],[3,7],[3,4],
                    [4,5],[5,6],[6,7],[7,4],
                    [4,8],[5,8],[6,8],[7,8]
                ];
            } else {
                // Octahedral Crystal (Raw Diamond Crystal Wireframe)
                this.vertices = [
                    {x: 0, y: -1.0, z: 0},
                    {x: -0.8, y: 0, z: -0.8}, {x: 0.8, y: 0, z: -0.8},
                    {x: 0.8, y: 0, z: 0.8}, {x: -0.8, y: 0, z: 0.8},
                    {x: 0, y: 1.0, z: 0}
                ];
                this.edges = [
                    [0,1],[0,2],[0,3],[0,4],
                    [1,2],[2,3],[3,4],[4,1],
                    [5,1],[5,2],[5,3],[5,4]
                ];
            }
        }

        GemModel3D.prototype.update = function() {
            this.angleX += this.speedX;
            this.angleY += this.speedY;
        };

        GemModel3D.prototype.draw = function(cx, cy, alpha, color) {
            var cosX = Math.cos(this.angleX), sinX = Math.sin(this.angleX);
            var cosY = Math.cos(this.angleY), sinY = Math.sin(this.angleY);
            var proj = [];

            for (var i = 0; i < this.vertices.length; i++) {
                var v = this.vertices[i];
                var x1 = v.x * cosY + v.z * sinY;
                var z1 = -v.x * sinY + v.z * cosY;
                var y2 = v.y * cosX - z1 * sinX;
                proj.push({
                    x: cx + x1 * this.scale,
                    y: cy + y2 * this.scale
                });
            }

            ctx.save();
            ctx.lineWidth = 0.85;
            ctx.strokeStyle = color || 'rgba(201, 169, 98, ' + (alpha * 0.45) + ')';
            ctx.beginPath();
            for (var e = 0; e < this.edges.length; e++) {
                var p1 = proj[this.edges[e][0]];
                var p2 = proj[this.edges[e][1]];
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
            }
            ctx.stroke();

            var topPt = proj[0];
            ctx.fillStyle = 'rgba(255, 250, 235, ' + (alpha * 0.8) + ')';
            ctx.beginPath();
            ctx.arc(topPt.x, topPt.y, 1.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };

        function CADNode(isGem) {
            this.isGem = isGem;
            if (this.isGem) {
                this.gem = new GemModel3D(Math.random() > 0.5 ? 'brilliant' : 'octahedron', Math.random() * 5 + 9);
            }
            this.reset(true);
        }

        CADNode.prototype.reset = function(randomY) {
            this.x = Math.random() * (pWidth || 1200);
            this.y = randomY ? Math.random() * (pHeight || 800) : (pHeight || 800) + 15;
            this.vx = (Math.random() - 0.5) * 0.32;
            this.vy = -(Math.random() * 0.38 + 0.14);
            this.size = Math.random() * 2.2 + 0.9;
            this.alpha = Math.random() * 0.6 + 0.25;
            this.alphaSpeed = (Math.random() * 0.012 + 0.004) * (Math.random() > 0.5 ? 1 : -1);
            this.isDiamondGlint = Math.random() > 0.55;
            this.color = Math.random() > 0.35 ? '201, 169, 98' : '235, 230, 220';
            this.glintAngle = Math.random() * Math.PI;
            this.glintSpin = (Math.random() - 0.5) * 0.02;
        };

        CADNode.prototype.update = function() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha += this.alphaSpeed;
            this.glintAngle += this.glintSpin;

            if (this.alpha <= 0.15 || this.alpha >= 0.85) {
                this.alphaSpeed = -this.alphaSpeed;
            }

            var dx = mouseP.x - this.x;
            var dy = mouseP.y - this.y;
            var distSq = dx * dx + dy * dy;
            if (distSq < mouseP.radius * mouseP.radius && distSq > 10) {
                var dist = Math.sqrt(distSq);
                var force = (mouseP.radius - dist) / mouseP.radius;
                this.x -= (dx / dist) * force * 1.8;
                this.y -= (dy / dist) * force * 1.8;
            }

            if (this.gem) {
                this.gem.update();
            }

            if (this.y < -25 || this.x < -25 || this.x > pWidth + 25) {
                this.reset(false);
            }
        };

        CADNode.prototype.draw = function() {
            var a = Math.max(0.1, Math.min(0.9, this.alpha));

            if (this.gem) {
                this.gem.draw(this.x, this.y, a, 'rgba(' + this.color + ', ' + (a * 0.55) + ')');
                return;
            }

            ctx.save();
            ctx.translate(this.x, this.y);

            if (this.isDiamondGlint) {
                ctx.rotate(this.glintAngle);
                ctx.fillStyle = 'rgba(' + this.color + ', ' + a + ')';
                ctx.shadowColor = 'rgba(201, 169, 98, 0.5)';
                ctx.shadowBlur = 5;
                ctx.beginPath();
                var arm = this.size * 2.5;
                ctx.moveTo(0, -arm);
                ctx.quadraticCurveTo(0, 0, arm, 0);
                ctx.quadraticCurveTo(0, 0, 0, arm);
                ctx.quadraticCurveTo(0, 0, -arm, 0);
                ctx.quadraticCurveTo(0, 0, 0, -arm);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + this.color + ', ' + (a * 0.9) + ')';
                ctx.shadowColor = 'rgba(201, 169, 98, 0.4)';
                ctx.shadowBlur = 3;
                ctx.fill();
            }
            ctx.restore();
        };

        var gemCount = window.innerWidth < 768 ? 4 : 8;
        for (var i = 0; i < nodeCount; i++) {
            nodes.push(new CADNode(i < gemCount));
        }

        window.addEventListener('mousemove', function(e) {
            mouseP.targetX = e.clientX;
            mouseP.targetY = e.clientY;
        }, { passive: true });

        window.addEventListener('mouseleave', function() {
            mouseP.targetX = -9999;
            mouseP.targetY = -9999;
        });

        // Areas where CAD mesh must NOT appear: cards, pictures, videos
        var maskSelector = '.card, .cta-box, .faq-item, .contact-info, form, img, video, .cad-float-badge, .ring-cad-badge, .site-header';
        var maskRects = [];
        var maskFrame = 0;

        function refreshMaskRects() {
            maskRects.length = 0;
            var els = document.querySelectorAll(maskSelector);
            for (var i = 0; i < els.length; i++) {
                var r = els[i].getBoundingClientRect();
                if (r.width > 0 && r.height > 0 && r.bottom > -50 && r.top < pHeight + 50) {
                    maskRects.push(r);
                }
            }
        }

        function isMasked(x, y, pad) {
            for (var i = 0; i < maskRects.length; i++) {
                var r = maskRects[i];
                if (x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad) {
                    return true;
                }
            }
            return false;
        }

        var maxDist = 115;
        var maxDistSq = maxDist * maxDist;

        function renderGlobalCADEngine() {
            if (!canvasActive) return;
            if (maskFrame++ % 4 === 0) refreshMaskRects();

            if (mouseP.targetX !== -9999) {
                mouseP.x += (mouseP.targetX - mouseP.x) * 0.15;
                mouseP.y += (mouseP.targetY - mouseP.y) * 0.15;
            } else {
                mouseP.x = -9999;
                mouseP.y = -9999;
            }

            ctx.clearRect(0, 0, pWidth, pHeight);

            // Ambient Caustic Glow under mouse in negative background space
            if (mouseP.x > 0 && !isMasked(mouseP.x, mouseP.y, 40)) {
                var g = ctx.createRadialGradient(mouseP.x, mouseP.y, 0, mouseP.x, mouseP.y, 160);
                g.addColorStop(0, 'rgba(201, 169, 98, 0.08)');
                g.addColorStop(0.5, 'rgba(201, 169, 98, 0.025)');
                g.addColorStop(1, 'rgba(201, 169, 98, 0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(mouseP.x, mouseP.y, 160, 0, Math.PI * 2);
                ctx.fill();
            }

            var unmaskedNodes = [];
            for (var n = 0; n < nodes.length; n++) {
                nodes[n].update();
                if (!isMasked(nodes[n].x, nodes[n].y, nodes[n].size * 3)) {
                    unmaskedNodes.push(nodes[n]);
                }
            }

            var len = unmaskedNodes.length;
            ctx.lineWidth = 0.75;
            for (var ni = 0; ni < len; ni++) {
                var n1 = unmaskedNodes[ni];
                for (var nj = ni + 1; nj < len; nj++) {
                    var n2 = unmaskedNodes[nj];
                    var dx = n1.x - n2.x;
                    var dy = n1.y - n2.y;
                    var dSq = dx * dx + dy * dy;
                    if (dSq < maxDistSq) {
                        var d = Math.sqrt(dSq);
                        var lineAlpha = (1 - d / maxDist) * Math.min(n1.alpha, n2.alpha) * 0.32;
                        if (lineAlpha > 0.02) {
                            ctx.strokeStyle = 'rgba(201, 169, 98, ' + lineAlpha + ')';
                            ctx.beginPath();
                            ctx.moveTo(n1.x, n1.y);
                            ctx.lineTo(n2.x, n2.y);
                            ctx.stroke();
                        }
                    }
                }
            }

            for (var k = 0; k < len; k++) {
                unmaskedNodes[k].draw();
            }

            requestAnimationFrame(renderGlobalCADEngine);
        }

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                canvasActive = false;
            } else {
                canvasActive = true;
                renderGlobalCADEngine();
            }
        });

        renderGlobalCADEngine();
    }

    // 4c. Interactive Specular Light Glare Tracker on Cards
    var interactiveCards = document.querySelectorAll('.card');
    if (interactiveCards.length > 0 && !prefersReducedMotion) {
        Array.prototype.forEach.call(interactiveCards, function(card) {
            card.addEventListener('mousemove', function(e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', x.toFixed(1) + 'px');
                card.style.setProperty('--mouse-y', y.toFixed(1) + 'px');
            }, { passive: true });
        });
    }

    // 4d. Magnetic Cursor Attraction on Primary Buttons
    var magneticBtns = document.querySelectorAll('.btn-primary');
    if (magneticBtns.length > 0 && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
        Array.prototype.forEach.call(magneticBtns, function(btn) {
            btn.addEventListener('mousemove', function(e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - (rect.left + rect.width / 2);
                var y = e.clientY - (rect.top + rect.height / 2);
                btn.style.transform = 'translate(' + (x * 0.16).toFixed(1) + 'px, ' + (y * 0.16).toFixed(1) + 'px)';
            }, { passive: true });
            btn.addEventListener('mouseleave', function() {
                btn.style.transform = '';
            });
        });
    }

    // 4e. Dynamic Kinetic Text Rotator (Hero Changing Headline - Snappy & Fast Speed)
    var heroRotator = document.getElementById('heroRotator');
    if (heroRotator && !prefersReducedMotion) {
        var rawWords = heroRotator.getAttribute('data-words');
        var wordsList = [];
        try {
            wordsList = rawWords ? JSON.parse(rawWords) : [];
        } catch(e) {
            wordsList = ["Crafted Digitally.", "Cast-Ready CAD.", "0.01mm Precision.", "MatrixGold Engineered.", "Production Perfect."];
        }
        if (!wordsList || !wordsList.length) {
            wordsList = ["Crafted Digitally.", "Cast-Ready CAD.", "0.01mm Precision.", "MatrixGold Engineered.", "Production Perfect."];
        }

        var currentWordIndex = 0;
        var rotatorInterval = null;
        var isHoveringRotator = false;

        function cycleWord() {
            if (isHoveringRotator) return;
            currentWordIndex = (currentWordIndex + 1) % wordsList.length;
            var nextWord = wordsList[currentWordIndex];

            // Step 1: Slide current word up & out with 3D tilt
            heroRotator.classList.add('swap-out');

            setTimeout(function() {
                // Step 2: Swap text & prepare at bottom
                heroRotator.textContent = nextWord;
                heroRotator.classList.remove('swap-out');
                heroRotator.classList.add('swap-in-prep');

                // Force layout reflow
                void heroRotator.offsetHeight;

                // Step 3: Animate in from bottom with liquid gold sheen
                heroRotator.classList.remove('swap-in-prep');
                heroRotator.classList.add('swap-in');

                setTimeout(function() {
                    heroRotator.classList.remove('swap-in');
                }, 380);
            }, 350);
        }

        // Balanced, comfortable reading interval (2900ms)
        rotatorInterval = setInterval(cycleWord, 2900);

        heroRotator.addEventListener('mouseenter', function() {
            isHoveringRotator = true;
        });
        heroRotator.addEventListener('mouseleave', function() {
            isHoveringRotator = false;
        });

        // Pause cycle when user switches tab
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                if (rotatorInterval) clearInterval(rotatorInterval);
            } else {
                rotatorInterval = setInterval(cycleWord, 2900);
            }
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
                        card.classList.remove('filter-out');
                        card.classList.add('filter-in');
                        visibleCount++;
                    } else {
                        card.classList.remove('filter-in');
                        card.classList.add('filter-out');
                        setTimeout(function() {
                            if (card.classList.contains('filter-out')) {
                                card.style.display = 'none';
                            }
                        }, 220);
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

    // 12. KoderHive-Style Interactive Roadmap / Timeline
    var roadmaps = document.querySelectorAll('.kh-roadmap-container');
    if (roadmaps.length > 0) {
        Array.prototype.forEach.call(roadmaps, function(rm) {
            var bar = rm.querySelector('.kh-timeline-bar');
            var progress = rm.querySelector('.kh-timeline-progress');
            var dots = rm.querySelectorAll('.kh-dot');
            var cards = rm.querySelectorAll('.kh-roadmap-card');
            var indicators = rm.querySelectorAll('.kh-step-indicator');
            
            function layoutDots() {
                if (!cards.length || !dots.length) return;
                var rmRect = rm.getBoundingClientRect();
                
                Array.prototype.forEach.call(cards, function(card, idx) {
                    var dot = dots[idx];
                    if (dot) {
                        var cardRect = card.getBoundingClientRect();
                        var cardCenterY = (cardRect.top - rmRect.top) + (cardRect.height / 2);
                        dot.style.top = cardCenterY + 'px';
                    }
                });
            }
            
            function updateRoadmap() {
                if (!bar || !progress) return;
                var barRect = bar.getBoundingClientRect();
                var triggerY = window.innerHeight * 0.55;
                
                var currentH = triggerY - barRect.top;
                currentH = Math.max(0, Math.min(barRect.height, currentH));
                progress.style.height = currentH + 'px';
                
                var activeIdx = 0;
                Array.prototype.forEach.call(dots, function(dot, idx) {
                    var dotRect = dot.getBoundingClientRect();
                    if (triggerY >= dotRect.top) {
                        dot.classList.add('active');
                        activeIdx = idx;
                    } else {
                        if (idx > 0) {
                            dot.classList.remove('active');
                        }
                    }
                });
                
                if (dots.length > 0 && currentH <= 10) {
                    dots[0].classList.add('active');
                }
                
                if (indicators.length > 0) {
                    Array.prototype.forEach.call(indicators, function(ind, idx) {
                        if (idx === activeIdx) {
                            ind.classList.add('active');
                        } else {
                            ind.classList.remove('active');
                        }
                    });
                }
            }
            
            if (indicators.length > 0) {
                Array.prototype.forEach.call(indicators, function(ind, idx) {
                    ind.addEventListener('click', function() {
                        var targetCard = cards[idx];
                        if (targetCard) {
                            var headerH = header ? header.offsetHeight : 80;
                            var topPos = targetCard.getBoundingClientRect().top + window.pageYOffset - headerH - 30;
                            window.scrollTo({
                                top: topPos,
                                behavior: prefersReducedMotion ? 'auto' : 'smooth'
                            });
                        }
                    });
                });
            }
            
            window.addEventListener('scroll', updateRoadmap, { passive: true });
            window.addEventListener('resize', function() {
                layoutDots();
                updateRoadmap();
            });
            
            setTimeout(function() {
                layoutDots();
                updateRoadmap();
            }, 100);
        });
    }

})();
