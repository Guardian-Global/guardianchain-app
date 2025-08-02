import React, { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

interface InteractiveBackgroundProps {
  particleCount?: number;
  className?: string;
  colors?: string[];
  variant?: "quantum" | "neural" | "cosmic" | "minimal";
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({
  particleCount = 50,
  className = "",
  colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"],
  variant = "quantum"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const variantConfigs = useMemo(() => ({
    quantum: {
      connectionDistance: 120,
      particleSpeed: 0.5,
      mouseInfluence: 150,
      pulseEffect: true
    },
    neural: {
      connectionDistance: 100,
      particleSpeed: 0.3,
      mouseInfluence: 200,
      pulseEffect: false
    },
    cosmic: {
      connectionDistance: 150,
      particleSpeed: 0.8,
      mouseInfluence: 100,
      pulseEffect: true
    },
    minimal: {
      connectionDistance: 80,
      particleSpeed: 0.2,
      mouseInfluence: 80,
      pulseEffect: false
    }
  }), []);

  const config = variantConfigs[variant];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const initParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.particleSpeed,
        vy: (Math.random() - 0.5) * config.particleSpeed,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.2
      }));
    };

    const updateParticles = () => {
      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.mouseInfluence) {
          const force = (config.mouseInfluence - distance) / config.mouseInfluence;
          particle.vx += (dx / distance) * force * 0.01;
          particle.vy += (dy / distance) * force * 0.01;
        }

        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Pulse effect for quantum variant
        if (config.pulseEffect) {
          particle.opacity = 0.3 + 0.5 * Math.sin(Date.now() * 0.002 + particle.x * 0.01);
        }
      });
    };

    const drawConnections = () => {
      ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
      ctx.lineWidth = 1;

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.connectionDistance) {
            const opacity = (config.connectionDistance - distance) / config.connectionDistance;
            ctx.globalAlpha = opacity * 0.3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawParticles = () => {
      particlesRef.current.forEach(particle => {
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        if (variant === "quantum" || variant === "cosmic") {
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateParticles();
      drawConnections();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    // Initialize
    resizeCanvas();
    initParticles();
    animate();

    // Event listeners
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [particleCount, colors, variant, config]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ background: "transparent" }}
    />
  );
};

export default InteractiveBackground;