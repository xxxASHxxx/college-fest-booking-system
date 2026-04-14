import React, { useEffect, useRef } from 'react';

/**
 * LiquidEther - Ultra-Smooth Fluid Background
 * 
 * Performance fix: removed ctx.filter = 'blur()' from the animation loop.
 * Canvas 2D filter causes full CPU re-composition on EVERY frame, causing:
 *   - Black flash when React re-renders (e.g. typing in inputs)
 *   - High CPU usage / tab lag
 * 
 * Blur is now applied via CSS on the canvas element itself — GPU-composited,
 * stable across React re-renders, and ~10x cheaper.
 */

const LiquidEther = ({
    colors = ["#D00000", "#FAA307", "#03071E"],
    autoDemo = true,
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const blobsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', {
            alpha: false,
            desynchronized: true,
        });

        // Parse hex color to rgb object
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            } : { r: 255, g: 255, b: 255 };
        };

        const color1 = hexToRgb(colors[0]); // Red
        const color2 = hexToRgb(colors[1]); // Orange/Amber

        // Resize canvas to match its CSS dimensions
        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Each blob drifts in a smooth Lissajous-like path
        class Blob {
            constructor(index) {
                this.baseX = Math.random();
                this.baseY = Math.random();
                this.angle = Math.random() * Math.PI * 2;
                this.speed = 0.3 + Math.random() * 0.4;
                this.radius = 0.2 + Math.random() * 0.15;
                this.colorIndex = index % 2;
                this.phase = Math.random() * Math.PI * 2;
            }

            update(time) {
                const t = time * 0.0001 * this.speed;
                this.offsetX = Math.sin(t + this.phase) * 0.15;
                this.offsetY = Math.cos(t + this.phase * 1.3) * 0.15;
            }

            draw(ctx, width, height, time) {
                const x = (this.baseX + this.offsetX) * width;
                const y = (this.baseY + this.offsetY) * height;
                const r = this.radius * Math.min(width, height);

                const color = this.colorIndex === 0 ? color1 : color2;
                const pulse = Math.sin(time * 0.001 + this.phase) * 0.15 + 0.35;

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
                gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${pulse})`);
                gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${pulse * 0.3})`);
                gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Create blobs
        blobsRef.current = [];
        for (let i = 0; i < 8; i++) {
            blobsRef.current.push(new Blob(i));
        }

        // Animation loop — NO ctx.filter here (moved to CSS below)
        const animate = (time) => {
            const width = canvas.width;
            const height = canvas.height;

            // Dark navy background fill
            ctx.fillStyle = '#03071E';
            ctx.fillRect(0, 0, width, height);

            // Draw blobs without any Canvas filter
            blobsRef.current.forEach(blob => {
                blob.update(time);
                blob.draw(ctx, width, height, time);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            blobsRef.current = [];
        };
    }, []); // Empty deps — colors are stable strings, no need to re-run on re-render

    return (
        <div className="w-full h-full relative">
            {/*
              * CSS blur on the canvas element — GPU-composited, never causes
              * repaint/flash when React updates (inputs typing, state changes, etc.)
              */}
            <canvas
                ref={canvasRef}
                className="w-full h-full absolute inset-0"
                style={{ display: 'block', filter: 'blur(28px)', willChange: 'transform' }}
            />

            {/* Subtle CSS gradient overlay for extra depth */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.25,
                    mixBlendMode: 'overlay',
                    background: `
                        radial-gradient(circle at 20% 50%, rgba(208, 0, 0, 0.25) 0%, transparent 55%),
                        radial-gradient(circle at 80% 50%, rgba(250, 163, 7, 0.25) 0%, transparent 55%)
                    `,
                    animation: 'gradientShift 20s ease-in-out infinite',
                }}
            />

            <style>{`
                @keyframes gradientShift {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%       { transform: translate(8%, -4%) scale(1.08); }
                    66%       { transform: translate(-8%, 4%) scale(0.93); }
                }
            `}</style>
        </div>
    );
};

export default LiquidEther;
