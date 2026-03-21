        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const cursorLight = document.getElementById('cursorLight');

        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let fish = [];
        let jellyfish = [];
        let bubbles = [];
        let particles = [];
        let kelp = [];
        let time = 0;
        let autoRipples = [];

        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initScene();
        }

        // Fish object
        function createFish() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 12 + 8,
                hue: 190 + Math.random() * 30,
                glowPhase: Math.random() * Math.PI * 2,
                swimPhase: Math.random() * Math.PI * 2,
                flipX: Math.random() > 0.5
            };
        }

        // Jellyfish object
        function createJellyfish() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 25 + 15,
                hue: 170 + Math.random() * 50,
                glowPhase: Math.random() * Math.PI * 2,
                pulsePhase: Math.random() * Math.PI * 2,
                tentacles: []
            };
        }

        // Bubble object
        function createBubble() {
            return {
                x: Math.random() * canvas.width,
                y: canvas.height + 20,
                size: Math.random() * 6 + 2,
                speed: Math.random() * 1.5 + 0.5,
                wobblePhase: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.6 + 0.3
            };
        }

        // Bioluminescent particle
        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                hue: 180 + Math.random() * 40,
                life: 1,
                decay: Math.random() * 0.005 + 0.002,
                glowPhase: Math.random() * Math.PI * 2
            };
        }

        // Kelp strand
        function createKelp(x) {
            const segments = [];
            const segmentCount = Math.floor(Math.random() * 12) + 8;

            for (let i = 0; i < segmentCount; i++) {
                segments.push({
                    x: x + (Math.random() - 0.5) * 15,
                    y: canvas.height - (i * (canvas.height / segmentCount)),
                    baseX: x,
                    wave: Math.random() * Math.PI * 2
                });
            }

            return {
                segments: segments,
                baseWidth: Math.random() * 6 + 3,
                swaySpeed: Math.random() * 0.02 + 0.01
            };
        }

        // Initialize scene
        function initScene() {
            // Create fish
            fish = [];
            for (let i = 0; i < 12; i++) {
                fish.push(createFish());
            }

            // Create jellyfish
            jellyfish = [];
            for (let i = 0; i < 4; i++) {
                const jelly = createJellyfish();
                // Create tentacles
                for (let j = 0; j < 6; j++) {
                    jelly.tentacles.push({
                        length: jelly.size * (0.8 + Math.random() * 0.4),
                        wave: Math.random() * Math.PI * 2,
                        offset: (j / 6) * Math.PI * 2
                    });
                }
                jellyfish.push(jelly);
            }

            // Create bubbles
            bubbles = [];
            for (let i = 0; i < 25; i++) {
                bubbles.push(createBubble());
            }

            // Create particles
            particles = [];
            for (let i = 0; i < 40; i++) {
                particles.push(createParticle());
            }

            // Create kelp forest
            kelp = [];
            for (let i = 0; i < 12; i++) {
                kelp.push(createKelp(Math.random() * canvas.width));
            }
        }

        // Update clock
        function updateClock() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
            const dateStr = now.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });

            document.getElementById('time').textContent = timeStr;
            document.getElementById('date').textContent = dateStr.toUpperCase();

            // Dynamic depth
            const baseDepth = 847;
            const variation = Math.sin(time * 0.001) * 20;
            document.getElementById('depth').textContent = Math.floor(baseDepth + variation);
        }

        // Draw everything
        function draw() {
            // Ocean gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#001122');
            gradient.addColorStop(0.3, '#000819');
            gradient.addColorStop(0.7, '#000611');
            gradient.addColorStop(1, '#000000');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Caustic light effects
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.08;
            for (let i = 0; i < 4; i++) {
                const x = (time * 0.4 + i * 250) % (canvas.width + 300) - 150;
                const y = 40 + Math.sin(time * 0.008 + i) * 50;
                const width = 200 + Math.sin(time * 0.01 + i) * 50;
                const height = 30 + Math.sin(time * 0.012 + i) * 10;

                ctx.fillStyle = `hsl(${180 + i * 10}, 60%, 50%)`;
                ctx.beginPath();
                ctx.ellipse(x, y, width, height, Math.sin(time * 0.003 + i) * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            // Draw kelp forest
            kelp.forEach(k => {
                ctx.strokeStyle = 'rgba(20, 80, 60, 0.6)';
                ctx.lineWidth = k.baseWidth;
                ctx.lineCap = 'round';

                // Update kelp sway
                for (let i = 1; i < k.segments.length; i++) {
                    const segment = k.segments[i];
                    segment.wave += k.swaySpeed;
                    const sway = Math.sin(segment.wave + i * 0.1) * (15 + i * 1.5);
                    segment.x = segment.baseX + sway;
                }

                // Draw kelp
                ctx.beginPath();
                ctx.moveTo(k.segments[0].x, k.segments[0].y);

                for (let i = 1; i < k.segments.length; i++) {
                    const segment = k.segments[i];
                    ctx.lineTo(segment.x, segment.y);
                    ctx.lineWidth = k.baseWidth * (1 - i / k.segments.length);
                }

                ctx.stroke();
            });

            // Update and draw fish
            fish.forEach(f => {
                // Natural swimming motion
                f.swimPhase += 0.03;
                f.x += f.vx + Math.sin(time * 0.01 + f.swimPhase) * 0.1;
                f.y += f.vy + Math.sin(f.swimPhase) * 0.3;

                // Ocean current effect
                f.x += Math.sin(time * 0.0008 + f.y * 0.001) * 0.2;
                f.y += Math.cos(time * 0.001 + f.x * 0.001) * 0.1;

                // Wrap around
                if (f.x < -f.size) f.x = canvas.width + f.size;
                if (f.x > canvas.width + f.size) f.x = -f.size;
                if (f.y < -f.size) f.y = canvas.height + f.size;
                if (f.y > canvas.height + f.size) f.y = -f.size;

                // Update glow
                f.glowPhase += 0.025;
                const glow = 0.6 + 0.4 * Math.sin(f.glowPhase);

                // Draw fish
                ctx.save();
                ctx.translate(f.x, f.y);
                if (f.flipX) ctx.scale(-1, 1);

                ctx.shadowColor = `hsl(${f.hue}, 60%, 50%)`;
                ctx.shadowBlur = 12 * glow;
                ctx.fillStyle = `hsl(${f.hue}, 50%, ${30 + glow * 20}%)`;

                // Fish body
                ctx.beginPath();
                ctx.ellipse(0, 0, f.size, f.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();

                // Fish tail
                ctx.beginPath();
                ctx.moveTo(-f.size, 0);
                ctx.lineTo(-f.size * 1.4, -f.size * 0.3);
                ctx.lineTo(-f.size * 1.6, 0);
                ctx.lineTo(-f.size * 1.4, f.size * 0.3);
                ctx.closePath();
                ctx.fill();

                // Glowing eye
                ctx.fillStyle = `hsl(${f.hue + 40}, 80%, ${60 + glow * 40}%)`;
                ctx.beginPath();
                ctx.arc(f.size * 0.3, -f.size * 0.1, f.size * 0.08, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            // Update and draw jellyfish
            jellyfish.forEach(j => {
                // Jellyfish movement
                j.pulsePhase += 0.02;
                const pulse = Math.sin(j.pulsePhase);

                j.x += j.vx + pulse * 0.1;
                j.y += j.vy + pulse * 0.05;

                // Ocean current
                j.x += Math.sin(time * 0.001 + j.y * 0.0008) * 0.3;
                j.y += Math.cos(time * 0.0012 + j.x * 0.0006) * 0.15;

                // Wrap around
                if (j.x < -j.size) j.x = canvas.width + j.size;
                if (j.x > canvas.width + j.size) j.x = -j.size;
                if (j.y < -j.size) j.y = canvas.height + j.size;
                if (j.y > canvas.height + j.size) j.y = -j.size;

                // Update glow
                j.glowPhase += 0.015;
                const glow = 0.7 + 0.3 * Math.sin(j.glowPhase);

                // Draw tentacles
                ctx.save();
                ctx.translate(j.x, j.y);

                j.tentacles.forEach(tentacle => {
                    tentacle.wave += 0.03;

                    ctx.strokeStyle = `hsla(${j.hue}, 60%, 40%, ${glow * 0.6})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(0, j.size * 0.4);

                    for (let k = 1; k <= 8; k++) {
                        const progress = k / 8;
                        const waveOffset = Math.sin(tentacle.wave + tentacle.offset + progress * 2) * 12;
                        const x = waveOffset;
                        const y = j.size * 0.4 + tentacle.length * progress;
                        ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                });

                // Draw jellyfish bell
                const bellSize = j.size * (0.9 + pulse * 0.1);
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, bellSize);
                gradient.addColorStop(0, `hsla(${j.hue}, 70%, 60%, ${glow * 0.8})`);
                gradient.addColorStop(0.6, `hsla(${j.hue}, 60%, 40%, ${glow * 0.4})`);
                gradient.addColorStop(1, `hsla(${j.hue}, 50%, 20%, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(0, 0, bellSize, bellSize * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            // Update and draw bubbles
            bubbles.forEach(b => {
                b.wobblePhase += 0.03;
                b.y -= b.speed;
                b.x += Math.sin(b.wobblePhase) * 0.5;

                if (b.y < -20) {
                    b.y = canvas.height + 20;
                    b.x = Math.random() * canvas.width;
                }

                // Draw bubble
                ctx.save();
                ctx.globalAlpha = b.opacity;

                const bubbleGradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.size);
                bubbleGradient.addColorStop(0, 'rgba(150, 200, 255, 0.8)');
                bubbleGradient.addColorStop(0.7, 'rgba(100, 150, 200, 0.4)');
                bubbleGradient.addColorStop(1, 'rgba(50, 100, 150, 0.1)');

                ctx.fillStyle = bubbleGradient;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
                ctx.fill();

                // Bubble highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(b.x - b.size * 0.3, b.y - b.size * 0.3, b.size * 0.2, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            // Update and draw bioluminescent particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;
                p.glowPhase += 0.05;

                // Ocean current effect
                p.x += Math.sin(time * 0.002 + p.y * 0.01) * 0.1;
                p.y += Math.cos(time * 0.0015 + p.x * 0.008) * 0.1;

                if (p.life <= 0) {
                    // Respawn particle
                    p.x = Math.random() * canvas.width;
                    p.y = Math.random() * canvas.height;
                    p.life = 1;
                    p.hue = 180 + Math.random() * 40;
                }

                // Draw particle
                ctx.save();
                ctx.globalAlpha = p.life * (0.6 + 0.4 * Math.sin(p.glowPhase));

                const particleGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
                particleGradient.addColorStop(0, `hsl(${p.hue}, 70%, 70%)`);
                particleGradient.addColorStop(0.5, `hsl(${p.hue}, 60%, 50%)`);
                particleGradient.addColorStop(1, 'transparent');

                ctx.fillStyle = particleGradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            // Auto-generate ripples occasionally
            if (Math.random() < 0.002) {
                autoRipples.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: 0,
                    maxRadius: 60 + Math.random() * 40,
                    opacity: 1,
                    speed: 1.5
                });
            }

            // Update and draw auto-ripples
            autoRipples = autoRipples.filter(r => {
                r.radius += r.speed;
                r.opacity = 1 - (r.radius / r.maxRadius);

                if (r.opacity > 0) {
                    ctx.save();
                    ctx.globalAlpha = r.opacity * 0.4;
                    ctx.strokeStyle = '#00aaff';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                    return true;
                }
                return false;
            });
        }

        // Animation loop
        function animate() {
            draw();
            updateClock();
            time++;
            requestAnimationFrame(animate);
        }

        // Mouse tracking for cursor light
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            cursorLight.style.left = mouse.x + 'px';
            cursorLight.style.top = mouse.y + 'px';
        });

        // Click to create ripples
        canvas.addEventListener('click', (e) => {
            autoRipples.push({
                x: e.clientX,
                y: e.clientY,
                radius: 0,
                maxRadius: 80 + Math.random() * 60,
                opacity: 1,
                speed: 2
            });
        });

        // Initialize everything
        window.addEventListener('load', () => {
            resizeCanvas();
            animate();
        });

        window.addEventListener('resize', resizeCanvas);

        // Fallback initialization
        setTimeout(() => {
            if (canvas.width === 0) {
                resizeCanvas();
                animate();
            }
        }, 100);
