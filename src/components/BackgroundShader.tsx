// src/components/BackgroundShader.tsx
"use client";

import React, { useEffect, useRef } from "react";

export const BackgroundShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Organic blob particles
    interface Blob {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      opacity: number;
    }

    const blobs: Blob[] = [];
    const blobCount = 8;

    // Initialize blobs with organic colors
    const colors = [
      "rgba(45, 94, 41, 0.03)",   // Deep green
      "rgba(50, 98, 149, 0.02)",  // Blue
      "rgba(181, 108, 7, 0.02)",  // Amber
      "rgba(34, 197, 94, 0.025)", // Emerald
    ];

    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 150 + Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.4 + Math.random() * 0.3,
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update blobs
      blobs.forEach((blob) => {
        // Update position
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce off edges
        if (blob.x < -blob.radius || blob.x > canvas.width + blob.radius) {
          blob.vx *= -1;
        }
        if (blob.y < -blob.radius || blob.y > canvas.height + blob.radius) {
          blob.vy *= -1;
        }

        // Draw blob with gradient
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );
        gradient.addColorStop(0, blob.color.replace(/[\d.]+\)$/g, `${blob.opacity})`));
        gradient.addColorStop(1, blob.color.replace(/[\d.]+\)$/g, "0)"));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ filter: "blur(60px)" }}
      aria-hidden="true"
    />
  );
};

// Made with Bob
