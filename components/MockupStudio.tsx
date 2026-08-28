"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { methods, placements } from "@/lib/business";
import { useThread } from "./ThreadContext";

export type StudioGarment = {
  handle: string;
  label: string;
  title: string;
  colors: { name: string; image: string }[];
};

/** Placement presets, expressed as percentages of the stage. */
const PRESETS: Record<string, { x: number; y: number; w: number }> = {
  "Left chest": { x: 38, y: 37, w: 11 },
  "Full front": { x: 50, y: 50, w: 34 },
  "Cap front": { x: 50, y: 47, w: 22 },
  "Left sleeve": { x: 22, y: 45, w: 9 },
};

export default function MockupStudio({ garments }: { garments: StudioGarment[] }) {
  const router = useRouter();
  const { thread } = useThread();

  const [gi, setGi] = useState(0);
  const [ci, setCi] = useState(0);
  const [method, setMethod] = useState<string>(methods[0].name);
  const [placement, setPlacement] = useState<string>("Left chest");
  const [art, setArt] = useState<string | null>(null);
  const [artName, setArtName] = useState<string | null>(null);
  const [pos, setPos] = useState(PRESETS["Left chest"]);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const garment = garments[gi];
  const colors = garment?.colors ?? [];
  const color = colors[Math.min(ci, Math.max(colors.length - 1, 0))];

  useEffect(() => { setCi(0); }, [gi]);

  useEffect(() => {
    const preset = PRESETS[placement];
    if (preset) setPos(preset);
  }, [placement]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    setTouched(true);
  };

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !stageRef.current) return;
      const r = stageRef.current.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      setPos((p) => ({ ...p, x: Math.max(6, Math.min(94, x)), y: Math.max(6, Math.min(94, y)) }));
    },
    [dragging]
  );

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!/^image\//.test(f.type)) return;
    const reader = new FileReader();
    reader.onload = () => {
      setArt(String(reader.result));
      setArtName(f.name);
      setTouched(true);
    };
    reader.readAsDataURL(f);
  };

  const sendToQuote = () => {
    const params = new URLSearchParams({
      garment: garment.title,
      handle: garment.handle,
      color: color?.name ?? "",
      method,
      placement,
      thread: thread.name,
    });
    if (artName) params.set("art", artName);
    router.push(`/quote?${params.toString()}`);
  };

  const hint = useMemo(() => {
    if (!art) return "Add your logo to see it on the garment";
    if (!touched) return "Drag the logo to move it";
    return "Drag to move · use the slider to size";
  }, [art, touched]);

  if (!garment) return null;

  return (
    <div className="studio">
      <div className="studio__head">
        <span className="label">Mockup bench</span>
        <span className="mono" style={{ opacity: 0.7 }}>{garment.label}</span>
      </div>

      <div className="studio__body">
        <div
          className="studio__stage"
          ref={stageRef}
          onPointerMove={onPointerMove}
          onPointerUp={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="studio__garment"
            src={`${color?.image}&width=900`}
            alt={`${garment.title} in ${color?.name}`}
            draggable={false}
          />

          {art && (
            <div
              className="studio__art"
              data-selected={dragging}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: `${pos.w}%`,
                aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)",
              }}
              onPointerDown={onPointerDown}
              role="img"
              aria-label="Your artwork on the garment"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={art} alt="" />
            </div>
          )}

          <span className="studio__hint">{hint}</span>
        </div>

        <div className="studio__panel">
          <div className="field">
            <span className="label">Garment</span>
            <div className="chips">
              {garments.map((g, i) => (
                <button key={g.handle} className="chip" aria-pressed={i === gi} onClick={() => setGi(i)}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="label">Colour · {color?.name}</span>
            <div className="swatches">
              {colors.slice(0, 14).map((c, i) => (
                <button
                  key={c.name}
                  className="swatch"
                  aria-pressed={i === ci}
                  aria-label={c.name}
                  title={c.name}
                  style={{ backgroundImage: `url(${c.image}&width=90)` }}
                  onClick={() => setCi(i)}
                />
              ))}
            </div>
          </div>

          <div className="field">
            <span className="label">Your logo</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="visually-hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <div className="uploadBtn" role="button" tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
            >
              {artName ? `${artName} (change)` : "Upload or drop an image"}
            </div>
          </div>

          {art && (
            <div className="field">
              <span className="label">Size</span>
              <input
                className="range"
                type="range"
                min={5}
                max={55}
                value={pos.w}
                aria-label="Artwork size"
                onChange={(e) => setPos((p) => ({ ...p, w: Number(e.target.value) }))}
              />
            </div>
          )}

          <div className="field">
            <span className="label">Placement</span>
            <div className="chips">
              {Object.keys(PRESETS).map((p) => (
                <button key={p} className="chip" aria-pressed={placement === p} onClick={() => setPlacement(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="label">Method</span>
            <div className="chips">
              {methods.map((m) => (
                <button key={m.slug} className="chip" aria-pressed={method === m.name} onClick={() => setMethod(m.name)}>
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn--thread btn--block" onClick={sendToQuote}>
            Send this to a quote
          </button>
          <p className="mono muted" style={{ margin: 0, fontSize: "0.68rem", lineHeight: 1.5 }}>
            Your image stays in your browser. Your picks come across to the quote form; we ask for the
            artwork file after.
          </p>
        </div>
      </div>
    </div>
  );
}
