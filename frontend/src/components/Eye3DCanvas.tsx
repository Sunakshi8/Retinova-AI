import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Eye3DCanvasProps {
  interactive?: boolean;
  onSelectHotspot?: (part: string) => void;
  lowPowerMode?: boolean;
}

export const Eye3DCanvas: React.FC<Eye3DCanvasProps> = ({
  interactive = true,
  onSelectHotspot,
  lowPowerMode = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeAnatomy, setActiveAnatomy] = useState<string | null>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !lowPowerMode,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebGLSupported(false);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPowerMode ? 1 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    // Group for the eyeball and its accessories
    const eyeGroup = new THREE.Group();
    scene.add(eyeGroup);

    // 1. Sclera (Outer White Eyeball)
    const scleraGeo = new THREE.SphereGeometry(1.6, lowPowerMode ? 24 : 48, lowPowerMode ? 24 : 48);
    const scleraMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.6,
      thickness: 0.8,
      ior: 1.336, // Refractive index of human cornea/aqueous humor
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });
    const scleraMesh = new THREE.Mesh(scleraGeo, scleraMat);
    eyeGroup.add(scleraMesh);

    // 2. Cornea (Clear outer dome)
    const corneaGeo = new THREE.SphereGeometry(1.62, lowPowerMode ? 24 : 48, lowPowerMode ? 24 : 48, 0, Math.PI * 2, 0, Math.PI * 0.35);
    const corneaMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
    });
    const corneaMesh = new THREE.Mesh(corneaGeo, corneaMat);
    corneaMesh.rotation.x = Math.PI / 2;
    corneaMesh.position.z = 0.2;
    eyeGroup.add(corneaMesh);

    // 3. Iris (Vibrant cybernetic pupil / Iris matching Retinova logo colors: Cyan, Purple, Amber)
    const irisGeo = new THREE.RingGeometry(0.35, 1.1, lowPowerMode ? 32 : 64);
    // Custom gradient procedural canvas texture for Iris
    const irisCanvas = document.createElement('canvas');
    irisCanvas.width = 512;
    irisCanvas.height = 512;
    const ctx = irisCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(0.2, '#f59e0b'); // Amber inner ring
      grad.addColorStop(0.45, '#ec4899'); // Magenta
      grad.addColorStop(0.7, '#8b5cf6'); // Purple
      grad.addColorStop(0.9, '#06b6d4'); // Cyan limbus
      grad.addColorStop(1.0, '#020617'); // Outer border
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Add intricate radial striations
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 180; i++) {
        const angle = (i * Math.PI) / 90;
        ctx.beginPath();
        ctx.moveTo(256 + Math.cos(angle) * 70, 256 + Math.sin(angle) * 70);
        ctx.lineTo(256 + Math.cos(angle) * 230, 256 + Math.sin(angle) * 230);
        ctx.stroke();
      }
    }
    const irisTexture = new THREE.CanvasTexture(irisCanvas);
    const irisMat = new THREE.MeshStandardMaterial({
      map: irisTexture,
      roughness: 0.3,
      metalness: 0.4,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.3,
      side: THREE.DoubleSide,
    });
    const irisMesh = new THREE.Mesh(irisGeo, irisMat);
    irisMesh.position.z = 1.35;
    eyeGroup.add(irisMesh);

    // 4. Pupil (Center deep black aperture)
    const pupilGeo = new THREE.CircleGeometry(0.38, 32);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x010204 });
    const pupilMesh = new THREE.Mesh(pupilGeo, pupilMat);
    pupilMesh.position.z = 1.36;
    eyeGroup.add(pupilMesh);

    // 5. Retinal Vascular Tree (Back layer with glowing golden-orange vessels and optic disc)
    const vesselGroup = new THREE.Group();
    const vesselCount = lowPowerMode ? 18 : 36;
    for (let i = 0; i < vesselCount; i++) {
      const angle = (i / vesselCount) * Math.PI * 2;
      const length = 1.1 + Math.random() * 0.4;
      const points: THREE.Vector3[] = [];
      const numSegments = 6;
      for (let j = 0; j <= numSegments; j++) {
        const t = j / numSegments;
        const r = t * length;
        const curAngle = angle + (Math.sin(j * 1.5) * 0.2);
        const x = Math.cos(curAngle) * r;
        const y = Math.sin(curAngle) * r;
        const z = -Math.sqrt(Math.max(0, 1.55 * 1.55 - x * x - y * y)) + 0.1;
        points.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 12, 0.015, 6, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xf59e0b : 0xef4444,
        emissive: i % 2 === 0 ? 0xd97706 : 0xdc2626,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      vesselGroup.add(tubeMesh);
    }
    eyeGroup.add(vesselGroup);

    // 6. Holographic Circuit Orbit Rings (Matching the user's logo HUD aesthetic!)
    const ringGroup = new THREE.Group();
    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.015, 12, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI * 0.35;
    ringGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.4, 0.02, 12, 100, Math.PI * 1.4);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.85 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI * 0.25;
    ring2.rotation.z = Math.PI * 0.15;
    ringGroup.add(ring2);

    const ringGeo3 = new THREE.TorusGeometry(2.6, 0.012, 12, 100, Math.PI * 0.9);
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.9 });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.x = -Math.PI * 0.2;
    ringGroup.add(ring3);

    eyeGroup.add(ringGroup);

    // 7. Cinematic Ambient Particle Cloud
    const particleCount = lowPowerMode ? 60 : 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 2.0 + Math.random() * 1.8;
      particlePositions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = rad * Math.cos(phi);

      const colorVariant = Math.random();
      if (colorVariant < 0.35) {
        // Cyan
        particleColors[i * 3] = 0.02;
        particleColors[i * 3 + 1] = 0.74;
        particleColors[i * 3 + 2] = 0.83;
      } else if (colorVariant < 0.7) {
        // Purple
        particleColors[i * 3] = 0.54;
        particleColors[i * 3 + 1] = 0.36;
        particleColors[i * 3 + 2] = 0.96;
      } else {
        // Amber/Gold
        particleColors[i * 3] = 0.96;
        particleColors[i * 3 + 1] = 0.62;
        particleColors[i * 3 + 2] = 0.04;
      }
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x06b6d4, 4.0, 10);
    cyanRimLight.position.set(-4, -1, 3);
    scene.add(cyanRimLight);

    const purpleFillLight = new THREE.PointLight(0x8b5cf6, 4.5, 12);
    purpleFillLight.position.set(2, -3, -2);
    scene.add(purpleFillLight);

    const retinalCoreLight = new THREE.PointLight(0xf59e0b, 3.0, 6);
    retinalCoreLight.position.set(0, 0, 0.5);
    scene.add(retinalCoreLight);

    // Mouse tracking with inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
      targetRotationY = mouseX * 1.2;
      targetRotationX = mouseY * 0.9;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia on mouse movement
      eyeGroup.rotation.y += (targetRotationY - eyeGroup.rotation.y) * 0.05;
      eyeGroup.rotation.x += (targetRotationX - eyeGroup.rotation.x) * 0.05;

      // Gentle autonomous breathing / floating motion
      eyeGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.08;
      eyeGroup.position.x = Math.cos(elapsedTime * 0.8) * 0.04;

      // Holographic rings rotation
      ring1.rotation.z += 0.006;
      ring2.rotation.y -= 0.009;
      ring3.rotation.x += 0.007;

      // Particles gentle drift
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1;

      // Retinal core pulse
      retinalCoreLight.intensity = 2.8 + Math.sin(elapsedTime * 2.5) * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive, lowPowerMode]);

  // Fallback if WebGL isn't supported
  if (!webGLSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-indigo-500/40 shadow-2xl shadow-indigo-500/20">
          <img src="/retinova-logo.png" alt="Retinova AI Eye Anatomy" className="w-full h-full object-cover animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-mono text-cyan-400">WebGL Fallback Mode Active (Hardware Safe)</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Interactive Anatomy Hotspots Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'cornea', label: 'Cornea & Optics', desc: 'Clear anterior refractive shell' },
            { id: 'iris', label: 'Iris & Pupil', desc: 'Aperture modulating incident luminance' },
            { id: 'retina', label: 'Retinal Vascular Arcade', desc: 'Primary locus of microvascular lesions' },
            { id: 'macula', label: 'Macula & Fovea', desc: 'Center of acute chromatic vision' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveAnatomy(activeAnatomy === item.id ? null : item.id);
                onSelectHotspot?.(item.id);
              }}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                activeAnatomy === item.id
                  ? 'bg-indigo-600/80 border-indigo-400 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-cyan-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block mr-1.5 bg-cyan-400 animate-ping" />
              {item.label}
            </button>
          ))}
        </div>
        <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur-md">
          <span className="text-cyan-400">3D Interactive</span> • Move mouse to rotate
        </div>
      </div>
    </div>
  );
};
