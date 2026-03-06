"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

export const GlowingEffect = memo(
    ({
        blur = 0,
        inactiveZone = 0.7,
        proximity = 0,
        spread = 20,
        variant = "default",
        glow = false,
        className,
        movementDuration = 2,
        borderWidth = 1,
        disabled = false,
    }) => {
        const containerRef = useRef(null);
        const lastPosition = useRef({ x: 0, y: 0 });
        const animationFrameRef = useRef(0);

        const handleMove = useCallback(
            (e) => {
                if (!containerRef.current) return;

                if (disabled) {
                    containerRef.current.style.removeProperty("--x");
                    containerRef.current.style.removeProperty("--y");
                    containerRef.current.style.setProperty("--active", "0");
                    return;
                }

                let mouseX, mouseY;

                if (e && "clientX" in e) {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                } else if (e) {
                    mouseX = e.x;
                    mouseY = e.y;
                } else {
                    return;
                }

                const { left, top, width, height } =
                    containerRef.current.getBoundingClientRect();
                const localX = mouseX - left;
                const localY = mouseY - top;

                if (glow) {
                    const centerX = width / 2;
                    const centerY = height / 2;

                    const distanceX = Math.abs(centerX - localX);
                    const distanceY = Math.abs(centerY - localY);
                    const inactiveX = width * inactiveZone;
                    const inactiveY = height * inactiveZone;

                    if (distanceX < inactiveX && distanceY < inactiveY) {
                        containerRef.current.style.setProperty("--active", "0");
                        return;
                    }

                    const isActive =
                        localX > -proximity &&
                        localX < width + proximity &&
                        localY > -proximity &&
                        localY < height + proximity;

                    if (isActive) {
                        containerRef.current.style.setProperty("--active", "1");
                    } else {
                        containerRef.current.style.setProperty("--active", "0");
                    }
                }

                const currentX =
                    parseFloat(containerRef.current.style.getPropertyValue("--x")) || 0;
                const currentY =
                    parseFloat(containerRef.current.style.getPropertyValue("--y")) || 0;

                const nextX =
                    currentX + (localX - currentX) / (movementDuration * 10);
                const nextY =
                    currentY + (localY - currentY) / (movementDuration * 10);

                containerRef.current.style.setProperty("--x", `${nextX}px`);
                containerRef.current.style.setProperty("--y", `${nextY}px`);
            },
            [disabled, glow, inactiveZone, movementDuration, proximity]
        );

        const animate = useCallback(() => {
            handleMove(lastPosition.current);
            animationFrameRef.current = requestAnimationFrame(animate);
        }, [handleMove]);

        useEffect(() => {
            const handlePointerMove = (e) => {
                lastPosition.current = { x: e.clientX, y: e.clientY };
            };

            document.addEventListener("pointermove", handlePointerMove);
            animationFrameRef.current = requestAnimationFrame(animate);

            return () => {
                document.removeEventListener("pointermove", handlePointerMove);
                cancelAnimationFrame(animationFrameRef.current);
            };
        }, [animate]);

        return (
            <div
                ref={containerRef}
                className={cn(
                    "pointer-events-none absolute inset-0 h-full w-full rounded-[inherit] overflow-hidden",
                    className
                )}
            >
                <div
                    className={cn(
                        "will-change-background absolute inset-[auto] z-0 h-full w-full rounded-[inherit] bg-[length:100%_100%] bg-no-repeat opacity-0 transition-opacity duration-300",
                        disabled ? "opacity-0" : "[--active:0] group-hover/glow:[--active:1] opacity-100"
                    )}
                    style={{
                        backgroundImage: `radial-gradient(circle at var(--x, 0px) var(--y, 0px), rgba(123, 97, 255, 1) ${blur}%, transparent ${spread}%)`,
                        maskImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='${borderWidth}' rx='24' ry='24'/%3E%3C/svg%3E")`,
                        maskComposite: "exclude",
                        WebkitMaskComposite: "destination-out",
                        opacity: "var(--active, 0)"
                    }}
                />

                {/* Adiciona um efeito de glow interno extra para a nossa identidade visual */}
                <div
                    className={cn(
                        "will-change-background absolute inset-0 z-0 h-full w-full rounded-[inherit] bg-[length:100%_100%] bg-no-repeat opacity-0 transition-opacity duration-300",
                        disabled ? "opacity-0" : "[--active:0] group-hover/glow:[--active:1] opacity-100"
                    )}
                    style={{
                        backgroundImage: `radial-gradient(circle at var(--x, 0px) var(--y, 0px), rgba(0, 229, 255, 0.4) ${blur}%, transparent ${spread * 1.5}%)`,
                        maskImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='${borderWidth * 1.5}' rx='24' ry='24'/%3E%3C/svg%3E")`,
                        opacity: "var(--active, 0)"
                    }}
                />
            </div>
        );
    }
);

GlowingEffect.displayName = "GlowingEffect";
