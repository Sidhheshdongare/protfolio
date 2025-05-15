import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import * as THREE from 'three';

// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Create ScrollSmoother instance
export function initScrollSmoother() {
  return ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5,
    effects: true,
  });
}

interface CharacterAnimationElements {
  screenLight?: THREE.Mesh;
  monitor?: THREE.Mesh;
  neckBone?: THREE.Object3D;
}

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (!character) return;

  const elements: CharacterAnimationElements = {};
  let intensity = 0;
  
  // Random intensity generator
  const intensityInterval = setInterval(() => {
    intensity = Math.random();
  }, 200);

  // Setup animation elements
  character.children.forEach((object: THREE.Object3D) => {
    if (object.name === "Plane004") {
      object.children.forEach((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.material.transparent = true;
          child.material.opacity = 0;
          
          if (child.material.name === "Material.027") {
            (child.material as THREE.MeshStandardMaterial).color.set("#FFFFFF");
            elements.monitor = child;
          }
        }
      });
    }

    if (object.name === "screenlight" && object instanceof THREE.Mesh) {
      const material = object.material as THREE.MeshStandardMaterial;
      material.transparent = true;
      material.opacity = 0;
      material.emissive.set("#C8BFFF");
      elements.screenLight = object;

      gsap.timeline({ repeat: -1, repeatRefresh: true }).to(material, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
      });
    }
  });

  elements.neckBone = character.getObjectByName("spine005") || undefined;

  // Create timelines
  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  // Desktop animations
  if (window.innerWidth > 1024) {
    tl1
      .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
      .to(camera.position, { z: 22 }, 0)
      .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
      .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
      .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
      .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

    if (elements.neckBone) {
      tl2
        .to(camera.position, { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" }, 0)
        .to(".about-section", { y: "30%", duration: 6 }, 0)
        .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
        .fromTo(".character-model", { pointerEvents: "inherit" }, { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 }, 0)
        .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0)
        .to(elements.neckBone.rotation, { x: 0.6, delay: 2, duration: 3 }, 0);
    }

    if (elements.monitor) {
      tl2.to(elements.monitor.material, { opacity: 1, duration: 0.8, delay: 3.2 }, 0);
    }

    if (elements.screenLight) {
      tl2.to(elements.screenLight.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0);
    }

    tl2
      .fromTo(".what-box-in", { display: "none" }, { display: "flex", duration: 0.1, delay: 6 }, 0)
      .fromTo(elements.monitor?.position || {}, { y: -10, z: 2 }, { y: 0, z: 0, delay: 1.5, duration: 3 }, 0)
      .fromTo(".character-rim", { opacity: 1, scaleX: 1.4 }, { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 }, 0.3);

    tl3
      .fromTo(".character-model", { y: "0%" }, { y: "-100%", duration: 4, ease: "none", delay: 1 }, 0)
      .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
      .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);
  } else {
    // Mobile animations
    const tM2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".what-box-in",
        start: "top 70%",
        end: "bottom top",
      },
    });
    tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
  }

  // Cleanup interval on component unmount
  return () => clearInterval(intensityInterval);
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  careerTimeline
    .fromTo(".career-timeline", { maxHeight: "10%" }, { maxHeight: "100%", duration: 0.5 }, 0)
    .fromTo(".career-timeline", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0)
    .fromTo(".career-info-box", { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.5 }, 0)
    .fromTo(".career-dot", { animationIterationCount: "infinite" }, {
      animationIterationCount: "1",
      delay: 0.3,
      duration: 0.1,
    }, 0);

  const yOffset = window.innerWidth > 1024 ? "20%" : 0;
  careerTimeline.fromTo(".career-section", { y: 0 }, { y: yOffset, duration: 0.5, delay: 0.2 }, 0);
}
