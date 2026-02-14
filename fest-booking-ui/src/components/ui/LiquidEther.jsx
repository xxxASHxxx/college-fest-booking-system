import React, { useEffect, useRef } from 'react';

/**
 * LiquidEther - Ultra-Smooth Fluid Background
 * Uses CSS animations + lightweight canvas for maximum performance
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
            desynchronized: true // Better performance
        });

        // Parse colors
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 255, g: 255, b: 255 };
        };

        const color1 = hexToRgb(colors[0]); // Red
        const color2 = hexToRgb(colors[1]); // Orange

        // Optimized canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Simplified autonomous blob
        class Blob {
            constructor(index) {
                this.baseX = Math.random();
                this.baseY = Math.random();
                this.offsetX = 0;
                this.offsetY = 0;
                this.angle = Math.random() * Math.PI * 2;
                this.speed = 0.3 + Math.random() * 0.4;
                this.radius = 0.2 + Math.random() * 0.15;
                this.colorIndex = index % 2;
                this.phase = Math.random() * Math.PI * 2;
            }

            update(time) {
                // Smooth circular motion
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

        // Create fewer, larger blobs for smoother performance
        for (let i = 0; i < 8; i++) {
            blobsRef.current.push(new Blob(i));
        }

        // Ultra-smooth animation with time-based updates
        const animate = (time) => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            // Background
            ctx.fillStyle = '#03071E';
            ctx.fillRect(0, 0, width, height);

            // Lighter blur for better performance
            ctx.filter = 'blur(20px)';

            // Update and draw blobs
            blobsRef.current.forEach(blob => {
                blob.update(time);
                blob.draw(ctx, width, height, time);
            });

            ctx.filter = 'none';

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [colors, autoDemo]);

    return (
        <div className="w-full h-full relative">
            {/* Canvas layer */}
            <canvas
                ref={canvasRef}
                className="w-full h-full absolute inset-0"
                style={{ display: 'block' }}
            />

            {/* CSS gradient overlay for extra depth */}
            <div
                className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
                style={{
                    background: `
            radial-gradient(circle at 20% 50%, rgba(208, 0, 0, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(250, 163, 7, 0.2) 0%, transparent 50%)
          `,
                    animation: 'gradientShift 20s ease-in-out infinite'
                }}
            />

            {/* CSS keyframes */}
            <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(10%, -5%) scale(1.1);
          }
          66% {
            transform: translate(-10%, 5%) scale(0.9);
          }
        }
      `}</style>
        </div>
    );
};

export default LiquidEther;
