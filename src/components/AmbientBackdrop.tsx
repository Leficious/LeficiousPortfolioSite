import { useEffect, useRef, useState } from "react";
import { LamplightDustCanvas } from "./AtelierMotion";

const VERTEX_SHADER = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform sampler2D uDamask;
uniform vec2 uResolution;
uniform float uDpr;
uniform vec2 uPointer;
uniform vec2 uTrail;
uniform vec2 uParallax;
uniform float uHoverAlpha;
uniform float uScrollY;

void main() {
  // Screen space in CSS pixels: origin top-left, +x right, +y down
  vec2 fragPx = vec2(gl_FragCoord.x / uDpr, uResolution.y - gl_FragCoord.y / uDpr);
  vec2 uvScreen = fragPx / max(uResolution, vec2(1.0));

  // Sweeping architectural damask scale (~540px wide per motif; scrolls naturally with document on long pages)
  float tileSize = clamp(uResolution.x * 0.30, 440.0, 580.0);
  vec2 worldPx = fragPx + uParallax + vec2(0.0, uScrollY * 0.22);
  vec2 rawUv = worldPx / tileSize;

  // Hardware GL_REPEAT in X, GL_MIRRORED_REPEAT in Y -> flip normal.y on odd vertical tiles
  vec3 tex = texture2D(uDamask, rawUv).rgb;
  vec2 nxy = (tex.rg * 2.0 - 1.0) * 1.45;
  float oddRow = mod(floor(rawUv.y), 2.0);
  if (oddRow > 0.5) {
    nxy.y = -nxy.y;
  }
  vec3 N = normalize(vec3(nxy, 1.0));
  float height = tex.b;
  float motifMask = smoothstep(0.03, 0.38, height);

  // 1. Nocturnal Victorian obsidian-espresso wall vignette (deep ground, ZERO blue channel)
  vec2 vigDelta = (uvScreen - vec2(0.53, 0.46)) * vec2(1.15, 1.05);
  float vig = clamp(1.0 - dot(vigDelta, vigDelta) * 0.92, 0.0, 1.0);
  vec3 baseWall = mix(vec3(0.022, 0.016, 0.012), vec3(0.068, 0.046, 0.031), pow(vig, 1.25));

  // 2. Clearly legible blind-tooled & gilt damask across the unlit wall (visible even with zero hover)
  vec3 ambLight = normalize(vec3(-0.38, -0.70, 0.60));
  float ambDiff = clamp(dot(N, ambLight), 0.0, 1.0);
  float ambCrevice = clamp(dot(N, -ambLight), 0.0, 1.0);
  float ambRim = pow(ambDiff, 7.0) * smoothstep(0.08, 0.58, height);
  vec3 col = baseWall;
  col += motifMask * (
    ambDiff * vec3(0.062, 0.044, 0.024) +
    ambRim * vec3(0.032, 0.023, 0.012) +
    height * vec3(0.019, 0.013, 0.007)
  );
  col -= motifMask * ambCrevice * vec3(0.024, 0.017, 0.011);

  // 3. Interactive cursor grazing candlelight & 3D embossed shading
  vec2 toLight = uPointer - fragPx;
  float dist = length(toLight);
  float falloff = pow(smoothstep(600.0, 30.0, dist), 1.8) * uHoverAlpha;

  // Soft trailing candle-wake for sweeping motion feel
  float trailDist = length(uTrail - fragPx);
  float trailFalloff = pow(smoothstep(480.0, 40.0, trailDist), 1.9) * uHoverAlpha * 0.36;
  float totalAura = clamp(falloff + trailFalloff * 0.58, 0.0, 1.0);

  // Grazing 3D light vector (height = 175px above wall -> crisp directional highlight & opposite-edge shadow)
  vec3 L = normalize(vec3(toLight, 175.0));
  float nDotL = dot(N, L);
  float litSlope = clamp(nDotL, 0.0, 1.0);
  float shadowSlope = clamp(-nDotL, 0.0, 1.0);

  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(N, H), 0.0), 23.0) * smoothstep(0.08, 0.62, height);

  // Warm ambient espresso wall glow under the candle
  col += totalAura * vec3(0.022, 0.013, 0.008);

  // Gilded champagne-bronze 3D bas-relief shading on the scrollwork
  vec3 giltDiffuse = vec3(0.155, 0.110, 0.058) * litSlope;
  vec3 giltSpec = vec3(0.235, 0.178, 0.096) * spec;
  vec3 velvetLift = vec3(0.038, 0.023, 0.012) * height;
  col += motifMask * totalAura * (giltDiffuse + giltSpec + velvetLift);

  // Self-shadowing relief crease on the side of each scroll facing away from the cursor
  col -= motifMask * falloff * shadowSlope * vec3(0.038, 0.025, 0.017);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type AmbientBackdropProps = {
  dialStep?: number;
  onBackdropReady?: () => void;
  dustActive?: boolean;
};

/**
 * Persistent nocturnal Victorian Blind-Tooled & Gilt Damask Wall (`#080605`).
 * Renders a sweeping, faded 19th-century acanthus & pomegranate damask bas-relief
 * that rests quietly in dark mahogany shadow and smoothly 3D-shades / glows with
 * grazing antique-gold candlelight wherever the cursor sweeps across it.
 */
export function AmbientBackdrop({ onBackdropReady, dustActive = true }: AmbientBackdropProps) {
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const readyCallbackRef = useRef(onBackdropReady);
  readyCallbackRef.current = onBackdropReady;

  const [webglReady, setWebglReady] = useState(false);
  const [webglUnsupported, setWebglUnsupported] = useState(false);

  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;

    const failToFallback = () => {
      setWebglUnsupported(true);
      readyCallbackRef.current?.();
    };

    const gl = (canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      failToFallback();
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      failToFallback();
      return;
    }

    const prog = gl.createProgram();
    if (!prog) {
      failToFallback();
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      failToFallback();
      return;
    }
    gl.useProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uDamask = gl.getUniformLocation(prog, "uDamask");
    const uResolution = gl.getUniformLocation(prog, "uResolution");
    const uDpr = gl.getUniformLocation(prog, "uDpr");
    const uPointer = gl.getUniformLocation(prog, "uPointer");
    const uTrail = gl.getUniformLocation(prog, "uTrail");
    const uParallax = gl.getUniformLocation(prog, "uParallax");
    const uHoverAlpha = gl.getUniformLocation(prog, "uHoverAlpha");
    const uScrollY = gl.getUniformLocation(prog, "uScrollY");

    const tex = gl.createTexture();
    let textureLoaded = false;
    let notifiedReady = false;
    let disposed = false;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = 1;

    const state = {
      targetX: width * 0.54,
      targetY: height * 0.42,
      curX: width * 0.54,
      curY: height * 0.42,
      trailX: width * 0.54,
      trailY: height * 0.42,
      targetAlpha: 0.48,
      curAlpha: reducedMotion.matches ? 0.48 : 0.08, // Blooms smoothly as lamplight ignites
      scrollY: window.scrollY,
    };

    let rafId = 0;
    let lastTime = 0;

    const render = (now: number) => {
      rafId = 0;
      if (disposed || !textureLoaded || document.hidden) return;

      const dt = lastTime > 0 ? Math.min(0.05, (now - lastTime) / 1000) : 0.016;
      lastTime = now;

      if (reducedMotion.matches) {
        state.curX = state.targetX;
        state.curY = state.targetY;
        state.trailX = state.targetX;
        state.trailY = state.targetY;
        state.curAlpha = state.targetAlpha;
      } else {
        const fastLerp = 1 - Math.pow(0.0008, dt);
        const slowLerp = 1 - Math.pow(0.045, dt);
        state.curX += (state.targetX - state.curX) * fastLerp;
        state.curY += (state.targetY - state.curY) * fastLerp;
        state.trailX += (state.curX - state.trailX) * slowLerp;
        state.trailY += (state.curY - state.trailY) * slowLerp;
        state.curAlpha += (state.targetAlpha - state.curAlpha) * slowLerp;
      }

      const normX = (state.curX / Math.max(1, width) - 0.5) * 2;
      const normY = (state.curY / Math.max(1, height) - 0.5) * 2;

      gl.uniform2f(uResolution, width, height);
      gl.uniform1f(uDpr, dpr);
      gl.uniform2f(uPointer, state.curX, state.curY);
      gl.uniform2f(uTrail, state.trailX, state.trailY);
      gl.uniform2f(uParallax, normX * 8.0, normY * 6.0);
      gl.uniform1f(uHoverAlpha, state.curAlpha);
      gl.uniform1f(uScrollY, state.scrollY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const stillSettling =
        !reducedMotion.matches &&
        (Math.hypot(state.targetX - state.curX, state.targetY - state.curY) > 0.35 ||
          Math.hypot(state.curX - state.trailX, state.curY - state.trailY) > 0.6 ||
          Math.abs(state.targetAlpha - state.curAlpha) > 0.005);

      if (stillSettling) {
        rafId = window.requestAnimationFrame(render);
      } else {
        lastTime = 0;
      }
    };

    function scheduleFrame() {
      if (!rafId && !disposed && textureLoaded) {
        rafId = window.requestAnimationFrame(render);
      }
    }

    const uploadTexture = (img: HTMLImageElement) => {
      if (disposed || !tex) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform1i(uDamask, 0);
      textureLoaded = true;
      // Draw initial frame synchronously before signalling ready so zero black-canvas flash occurs
      render(performance.now());
      setWebglReady(true);
      if (!notifiedReady) {
        notifiedReady = true;
        readyCallbackRef.current?.();
      }
    };

    const img = new Image();
    img.decoding = "async";
    img.src = "/textures/victorian-damask-nh.webp";
    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().then(() => uploadTexture(img), () => uploadTexture(img));
      } else {
        uploadTexture(img);
      }
    };
    img.onerror = failToFallback;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      scheduleFrame();
    };

    const onPointerMove = (e: PointerEvent) => {
      state.targetX = e.clientX;
      state.targetY = e.clientY;
      state.targetAlpha = 1.0;
      scheduleFrame();
    };

    const onPointerLeave = () => {
      state.targetAlpha = 0.35;
      scheduleFrame();
    };

    const onScroll = () => {
      state.scrollY = window.scrollY;
      scheduleFrame();
    };

    const onVisibility = () => {
      if (!document.hidden) scheduleFrame();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("visibilitychange", onVisibility);
      if (tex) gl.deleteTexture(tex);
      if (quad) gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="celestial-mat pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#080605]"
    >
      {/* Lightweight Obsidian Vignette Base (only loads 139KB static damask if WebGL is unsupported) */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          webglReady ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_53%_46%,rgba(58,36,20,0.48)_0%,rgba(14,10,8,0.95)_70%,#050302_100%)]" />
        {webglUnsupported && (
          <>
            <div
              className="absolute inset-0 opacity-[0.10] mix-blend-screen"
              style={{
                backgroundImage: 'url("/textures/victorian-damask-gilt.webp")',
                backgroundSize: "520px 1040px",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.23] mix-blend-screen"
              style={{
                backgroundImage: 'url("/textures/victorian-damask-gilt.webp")',
                backgroundSize: "520px 1040px",
                WebkitMaskImage:
                  "radial-gradient(560px circle at var(--spot-x) var(--spot-y), black 0%, rgba(0,0,0,0.4) 45%, transparent 78%)",
                maskImage:
                  "radial-gradient(560px circle at var(--spot-x) var(--spot-y), black 0%, rgba(0,0,0,0.4) 45%, transparent 78%)",
              }}
            />
          </>
        )}
      </div>

      {/* Real-Time Normal-Mapped 3D Grazing-Candlelight Victorian Damask WebGL Canvas */}
      <canvas
        ref={glCanvasRef}
        className={`absolute inset-0 transition-opacity duration-500 ${
          webglReady ? "opacity-100" : "opacity-0"
        }`}
      />

      {/*
       * Authentic Dip-Pen Capillary Ink Bleed Filters (Zero Screentone / Zero Jagged Bite):
       * Preserves an unbroken, anti-aliased glyph core on top while layering selective,
       * macro-gated (~32% wet pockets, ~68% dry crisp stretches) outward capillary feathering
       * underneath — so stems and serifs never get chewed or stair-stepped.
       */}
      <svg width="0" height="0" aria-hidden="true" className="pointer-events-none fixed">
        <defs>
          <filter id="letterpress-ink" x="-6%" y="-14%" width="112%" height="128%" colorInterpolationFilters="sRGB">
            {/* 1. Unbroken, anti-aliased nib core with subtle organic hand-pressure flow */}
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="2" seed="7" result="nibFlow" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="nibFlow"
              scale="0.34"
              xChannelSelector="R"
              yChannelSelector="G"
              result="intactNibCore"
            />

            {/* 2. Macro wet-pocket mask (~30px patches: ~62% dry = 0, ~38% pooled wet = 0..1) */}
            <feTurbulence type="fractalNoise" baseFrequency="0.028 0.044" numOctaves="2" seed="19" result="macroPool" />
            <feColorMatrix
              in="macroPool"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      8.6 0 0 0 -4.35"
              result="wetPocketMask"
            />

            {/* 3. Purely outward capillary ink wicking along cotton fibers (stronger on thick stems & junctions) */}
            <feMorphology in="intactNibCore" operator="dilate" radius="0.42 0.28" result="inkPool" />
            <feGaussianBlur in="inkPool" stdDeviation="0.95 0.68" result="pooledSpread" />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.12 0.27"
              numOctaves="3"
              seed="43"
              result="cottonFibers"
            />
            <feDisplacementMap
              in="pooledSpread"
              in2="cottonFibers"
              scale="2.75"
              xChannelSelector="R"
              yChannelSelector="G"
              result="wickedSpread"
            />

            {/* Gate outward wicking strictly to sporadic wet pockets */}
            <feComposite in="wickedSpread" in2="wetPocketMask" operator="in" result="localWicking" />

            {/* Smooth anti-aliased capillary meniscus (never 1-bit stair-stepped, zero detached dots) */}
            <feColorMatrix
              in="localWicking"
              type="matrix"
              values="0.90 0 0 0 0
                      0 0.86 0 0 0
                      0 0 0.82 0 0
                      0 0 0 3.6 -0.78"
              result="smoothCapillarySwell"
            />

            {/* Intact anti-aliased glyph core sits cleanly on top of localized outward ink swell */}
            <feMerge>
              <feMergeNode in="smoothCapillarySwell" />
              <feMergeNode in="intactNibCore" />
            </feMerge>
          </filter>

          <filter id="letterpress-ink-sub" x="-5%" y="-12%" width="110%" height="124%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.045 0.06" numOctaves="2" seed="13" result="subFlow" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="subFlow"
              scale="0.24"
              xChannelSelector="R"
              yChannelSelector="G"
              result="subIntactCore"
            />

            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.052" numOctaves="2" seed="29" result="subPool" />
            <feColorMatrix
              in="subPool"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      8.4 0 0 0 -4.28"
              result="subPocketMask"
            />

            <feMorphology in="subIntactCore" operator="dilate" radius="0.28 0.18" result="subDilated" />
            <feGaussianBlur in="subDilated" stdDeviation="0.72 0.52" result="subSpread" />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.14 0.30"
              numOctaves="3"
              seed="53"
              result="subFibers"
            />
            <feDisplacementMap
              in="subSpread"
              in2="subFibers"
              scale="1.95"
              xChannelSelector="R"
              yChannelSelector="G"
              result="subWicked"
            />

            <feComposite in="subWicked" in2="subPocketMask" operator="in" result="subLocalWick" />

            <feColorMatrix
              in="subLocalWick"
              type="matrix"
              values="0.90 0 0 0 0
                      0 0.86 0 0 0
                      0 0 0.82 0 0
                      0 0 0 3.3 -0.74"
              result="subCapillarySwell"
            />

            <feMerge>
              <feMergeNode in="subCapillarySwell" />
              <feMergeNode in="subIntactCore" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <LamplightDustCanvas active={dustActive} />
    </div>
  );
}
