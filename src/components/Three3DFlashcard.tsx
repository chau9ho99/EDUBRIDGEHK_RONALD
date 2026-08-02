import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { VocabWord } from "../types";
import { Volume2, Sparkles, CheckCircle2, RotateCw, ExternalLink, Bookmark, Check } from "lucide-react";
import { speakText } from "../utils/speechUtils";
import { getVocabMeaning, Language } from "../utils/i18n";

interface Three3DFlashcardProps {
  vocab: VocabWord;
  isMastered: boolean;
  isBookmarked: boolean;
  onToggleMaster: () => void;
  onToggleBookmark: () => void;
  onDoubleClickCard?: (vocab: VocabWord) => void;
  lang?: Language;
}

export const Three3DFlashcard: React.FC<Three3DFlashcardProps> = ({
  vocab,
  isMastered,
  isBookmarked,
  onToggleMaster,
  onToggleBookmark,
  onDoubleClickCard,
  lang = "zh-CN",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  const isFlippedRef = useRef(isFlipped);
  isFlippedRef.current = isFlipped;

  useEffect(() => {
    if (!mountRef.current) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      const width = mountRef.current.clientWidth || 320;
      const height = mountRef.current.clientHeight || 300;

      // 1. Scene
      const scene = new THREE.Scene();

      // 2. Camera
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 5.5;

      // 3. Renderer
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);

      // 4. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0x00ff88, 2.0);
      dirLight.position.set(3, 5, 4);
      scene.add(dirLight);

      const pointLight = new THREE.PointLight(0x8a2be2, 2.5, 10);
      pointLight.position.set(-3, -2, 2);
      scene.add(pointLight);

      // 5. Card Mesh Group
      const cardGroup = new THREE.Group();
      scene.add(cardGroup);

      // Flashcard Geometry
      const cardGeo = new THREE.BoxGeometry(3.2, 2.2, 0.08);

      // Materials
      const frontMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.2,
        metalness: 0.8,
        emissive: isMastered ? 0x003311 : 0x050510,
      });

      const cardMesh = new THREE.Mesh(cardGeo, frontMat);
      cardGroup.add(cardMesh);

      // Edge Glow Border
      const edges = new THREE.EdgesGeometry(cardGeo);
      const lineMat = new THREE.LineBasicMaterial({
        color: isMastered ? 0x00ff88 : 0x8a2be2,
        linewidth: 2,
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      cardMesh.add(wireframe);

      // Ambient 3D Particle Atmosphere
      const particleGeo = new THREE.BufferGeometry();
      const particleCount = 40;
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 8;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x00ff88,
        transparent: true,
        opacity: 0.6,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // Animation Loop
      let targetRotY = 0;
      let targetRotX = 0;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Target rotation based on flip
        targetRotY = isFlippedRef.current ? Math.PI : 0;

        // Smooth lerp rotation
        cardGroup.rotation.y += (targetRotY - cardGroup.rotation.y) * 0.1;
        cardGroup.rotation.x += (targetRotX - cardGroup.rotation.x) * 0.1;

        // Gentle floating wobble
        cardGroup.position.y = Math.sin(Date.now() * 0.002) * 0.08;

        // Rotate particles slowly
        particles.rotation.y += 0.001;

        renderer?.render(scene, camera);
      };

      animate();

      // Mouse move / tilt effect
      const handlePointerMove = (e: MouseEvent) => {
        if (!mountRef.current) return;
        const rect = mountRef.current.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotX = -py * 0.3;
      };

      const domElem = mountRef.current;
      domElem.addEventListener("mousemove", handlePointerMove);

      return () => {
        cancelAnimationFrame(animationFrameId);
        domElem.removeEventListener("mousemove", handlePointerMove);
        if (renderer && renderer.domElement) {
          domElem.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (e) {
      console.warn("WebGL initialization failed, fallback to 2D CSS 3D", e);
      setWebglSupported(false);
    }
  }, [vocab.word, isMastered]);

  const meaningText = getVocabMeaning(vocab, lang);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleCardDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDoubleClickCard) {
      onDoubleClickCard(vocab);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* 3D Canvas / Flip Container */}
      <div
        onClick={handleCardClick}
        onDoubleClick={handleCardDoubleClick}
        className={`w-full min-h-[300px] sm:min-h-[340px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl cursor-pointer transition-all relative overflow-hidden select-none border-2 ${
          isMastered
            ? "bg-gradient-to-b from-[#0a1a10] to-[#050c07] border-[#00FF88]/50 shadow-[0_0_30px_rgba(0,255,136,0.2)]"
            : "bg-gradient-to-b from-[#111116] to-[#07070a] border-purple-500/30 hover:border-[#00FF88]/60 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
        }`}
      >
        {/* Three.js Canvas Backdrop */}
        {webglSupported && (
          <div
            ref={mountRef}
            className="absolute inset-0 pointer-events-none opacity-40 z-0 flex items-center justify-center"
          />
        )}

        {/* Top Action Bar inside Card */}
        <div className="relative z-10 flex items-center justify-between text-xs">
          <span className="bg-white/10 text-[#00FF88] px-3 py-1 rounded-full font-black text-[10px] tracking-wider border border-white/20 uppercase">
            {vocab.level || "DSE Level 5*"}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark();
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                isBookmarked
                  ? "bg-yellow-400 text-black shadow-md"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-black" : ""}`} />
              <span>{isBookmarked ? "已標記" : "標記"}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMaster();
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                isMastered
                  ? "bg-[#00FF88] text-black shadow-md"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? "fill-black" : ""}`} />
              <span>{isMastered ? "已掌握" : "掌握"}</span>
            </button>
          </div>
        </div>

        {/* Center Content: Front vs Back */}
        <div className="relative z-10 my-auto text-center space-y-3 py-4">
          {!isFlipped ? (
            /* FRONT OF CARD */
            <div className="space-y-3 animate-in fade-in duration-200">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                {vocab.word}
              </h1>
              <p className="text-sm font-mono text-[#00FF88] font-bold">
                [{vocab.ipa}]
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(vocab.word, "en-US", 0.85);
                  }}
                  className="w-12 h-12 rounded-full bg-[#00FF88] text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-90 transition-all"
                  title="播放發音"
                >
                  <Volume2 className="w-6 h-6" />
                </button>

                {onDoubleClickCard && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDoubleClickCard(vocab);
                    }}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 shadow-lg active:scale-90 transition-all"
                    title="查看 AI 詳情分析"
                  >
                    <ExternalLink className="w-5 h-5 text-yellow-300" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* BACK OF CARD */
            <div className="space-y-3 animate-in fade-in duration-200">
              <span className="text-[10px] font-mono font-bold text-[#00FF88] bg-[#00FF88]/10 border border-[#00FF88]/20 px-2.5 py-1 rounded-full uppercase">
                釋義與 DSE 真題例句
              </span>
              <p className="text-2xl font-black text-[#00FF88] drop-shadow-sm">
                {meaningText}
              </p>
              {vocab.meanEn && (
                <p className="text-xs text-white/70 italic max-w-sm mx-auto">
                  {vocab.meanEn}
                </p>
              )}
              {vocab.exampleSentence && (
                <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-2xl text-left text-xs text-white/90 font-sans leading-relaxed">
                  <span className="text-[10px] font-black text-[#00FF88] uppercase block mb-1">
                    DSE 考試例句：
                  </span>
                  "{vocab.exampleSentence}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Helper Bar */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-white/40 font-mono pt-2 border-t border-white/5">
          <span className="flex items-center gap-1 text-[#00FF88]">
            <RotateCw className="w-3.5 h-3.5" />
            <span>點擊 3D 翻面</span>
          </span>

          <span
            onClick={(e) => {
              e.stopPropagation();
              if (onDoubleClickCard) onDoubleClickCard(vocab);
            }}
            className="hover:text-yellow-300 text-yellow-400 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Double Click 查看 AI 詳情</span>
          </span>
        </div>
      </div>
    </div>
  );
};
