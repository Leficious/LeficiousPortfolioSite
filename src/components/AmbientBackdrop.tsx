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

  // 1. Nocturnal Victorian obsidian-espresso wall vignette (deep calm ground, ZERO blue channel)
  vec2 vigDelta = (uvScreen - vec2(0.53, 0.46)) * vec2(1.15, 1.05);
  float vig = clamp(1.0 - dot(vigDelta, vigDelta) * 0.95, 0.0, 1.0);
  vec3 baseWall = mix(vec3(0.018, 0.014, 0.011), vec3(0.052, 0.036, 0.025), pow(vig, 1.3));

  // 2. Whisper-quiet blind-tooled ornament across the unlit wall (~2.8% relief so UI & type stay crisp)
  vec3 ambLight = normalize(vec3(-0.35, -0.72, 0.60));
  float ambDiff = clamp(dot(N, ambLight), 0.0, 1.0);
  float ambCrevice = clamp(dot(N, -ambLight), 0.0, 1.0);
  vec3 col = baseWall;
  col += motifMask * (ambDiff * vec3(0.027, 0.019, 0.011) + height * vec3(0.008, 0.006, 0.003));
  col -= motifMask * ambCrevice * vec3(0.012, 0.009, 0.006);

  // 3. Interactive cursor grazing candlelight & restrained 3D embossed shading
  vec2 toLight = uPointer - fragPx;
  float dist = length(toLight);
  float falloff = pow(smoothstep(580.0, 32.0, dist), 1.85) * uHoverAlpha;

  // Soft trailing candle-wake for sweeping motion feel
  float trailDist = length(uTrail - fragPx);
  float trailFalloff = pow(smoothstep(460.0, 40.0, trailDist), 1.95) * uHoverAlpha * 0.34;
  float totalAura = clamp(falloff + trailFalloff * 0.55, 0.0, 1.0);

  // Grazing 3D light vector (height = 175px above wall -> crisp directional highlight & opposite-edge shadow)
  vec3 L = normalize(vec3(toLight, 175.0));
  float nDotL = dot(N, L);
  float litSlope = clamp(nDotL, 0.0, 1.0);
  float shadowSlope = clamp(-nDotL, 0.0, 1.0);

  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(N, H), 0.0), 24.0) * smoothstep(0.08, 0.62, height);

  // Warm ambient espresso wall glow under the candle
  col += totalAura * vec3(0.019, 0.012, 0.007);

  // Restrained gilded champagne-bronze 3D bas-relief shading on the scrollwork
  vec3 giltDiffuse = vec3(0.128, 0.092, 0.050) * litSlope;
  vec3 giltSpec = vec3(0.195, 0.148, 0.082) * spec;
  vec3 velvetLift = vec3(0.032, 0.020, 0.011) * height;
  col += motifMask * totalAura * (giltDiffuse + giltSpec + velvetLift);

  // Self-shadowing relief crease on the side of each scroll facing away from the cursor
  col -= motifMask * falloff * shadowSlope * vec3(0.032, 0.022, 0.015);

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

/**
 * Persistent nocturnal Victorian Blind-Tooled & Gilt Damask Wall (`#080605`).
 * Renders a sweeping, faded 19th-century acanthus & pomegranate damask bas-relief
 * that rests quietly in dark mahogany shadow and smoothly 3D-shades / glows with
 * grazing antique-gold candlelight wherever the cursor sweeps across it.
 */
export function AmbientBackdrop(_props: { dialStep?: number }) {
  void _props;
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
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
    let disposed = false;

    const img = new Image();
    img.decoding = "async";
    img.src = "/textures/victorian-damask-nh.webp";
    img.onload = () => {
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
      setWebglReady(true);
      scheduleFrame();
    };

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
      targetAlpha: 0.45, // Gentle ambient candle glow even before first pointer move
      curAlpha: 0.45,
      scrollY: window.scrollY,
    };

    let rafId = 0;
    let lastTime = 0;

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
      document.removeEventListener("visibilitychange", onVisibility);
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
      {/* Pure CSS Fallback Layer (instant SSR paint & non-WebGL fallback using pre-lit damask tile) */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          webglReady ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_53%_46%,rgba(58,36,20,0.48)_0%,rgba(14,10,8,0.95)_70%,#050302_100%)]" />
        {/* Faded base damask */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-screen"
          style={{
            backgroundImage: 'url("/textures/victorian-damask-gilt.webp")',
            backgroundSize: "520px 1040px",
          }}
        />
        {/* Cursor-masked illuminated damask fallback */}
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
      </div>

      {/* Real-Time Normal-Mapped 3D Grazing-Candlelight Victorian Damask WebGL Canvas */}
      <canvas
        ref={glCanvasRef}
        className={`absolute inset-0 transition-opacity duration-500 ${
          webglReady ? "opacity-100" : "opacity-0"
        }`}
      />

      <LamplightDustCanvas />
    </div>
  );
}
