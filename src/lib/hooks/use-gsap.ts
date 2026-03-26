"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapScrollTrigger() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const elements = sectionRef.current.querySelectorAll("[data-gsap]");

    elements.forEach((el) => {
      const animation = (el as HTMLElement).dataset.gsap || "fade-up";
      const delay = parseFloat((el as HTMLElement).dataset.gsapDelay || "0");
      const duration = parseFloat(
        (el as HTMLElement).dataset.gsapDuration || "0.8"
      );

      const fromVars: gsap.TweenVars = { opacity: 0, duration, delay };
      const toVars: gsap.TweenVars = {
        opacity: 1,
        duration,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      };

      switch (animation) {
        case "fade-up":
          fromVars.y = 40;
          toVars.y = 0;
          break;
        case "fade-down":
          fromVars.y = -40;
          toVars.y = 0;
          break;
        case "fade-left":
          fromVars.x = -40;
          toVars.x = 0;
          break;
        case "fade-right":
          fromVars.x = 40;
          toVars.x = 0;
          break;
        case "scale-up":
          fromVars.scale = 0.9;
          toVars.scale = 1;
          break;
        case "fade":
          break;
      }

      gsap.fromTo(el, fromVars, toVars);
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return sectionRef;
}

export function useGsapStagger() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const children = containerRef.current.querySelectorAll("[data-gsap-stagger]");

    if (children.length === 0) return;

    gsap.fromTo(
      children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return containerRef;
}

export function useGsapCounter(
  targetValue: number,
  suffix: string = "",
  prefix: string = ""
) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const obj = { value: 0 };

    gsap.to(obj, {
      value: targetValue,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.floor(obj.value).toLocaleString("id-ID")}${suffix}`;
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [targetValue, suffix, prefix]);

  return ref;
}
