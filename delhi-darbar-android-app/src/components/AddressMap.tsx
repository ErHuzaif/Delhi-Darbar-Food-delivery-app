"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/utils";
import { PinIcon, SearchIcon } from "./icons";
import { Spinner } from "./ui";

// Leaflet is imported lazily (browser only) so static pages never
// evaluate its `window`-dependent module code during SSR.
type LeafletNS = typeof import("leaflet");

export type Picked = { lat: number; lng: number; label: string };

const ANANTNAG: [number, number] = [32.9622, 75.3877];

function pinSvg() {
  return `<svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 43C17 43 32 27.5 32 16.5C32 8.5 25.3 2 17 2C8.7 2 2 8.5 2 16.5C2 27.5 17 43 17 43Z" fill="#F2B84B" stroke="#0C0A08" stroke-width="2.5"/>
    <circle cx="17" cy="16.5" r="6" fill="#0C0A08"/>
    <circle cx="17" cy="16.5" r="2.6" fill="#FF7A1F"/>
  </svg>`;
}

type Result = { id: string; name: string; lat: number; lon: number };

export function AddressMap({
  initial,
  onPick,
  external,
  readOnly = false,
  className,
}: {
  initial?: Picked | null;
  onPick?: (p: Picked) => void;
  external?: Picked | null;
  readOnly?: boolean;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const Lref = useRef<LeafletNS | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const onPickRef = useRef(onPick);
  const initialRef = useRef(initial);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searching, setSearching] = useState(false);
  const reqId = useRef(0);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  // Initialise map once (browser only)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !divRef.current || mapRef.current) return;
      Lref.current = L;

      const map = L.map(divRef.current, {
        zoomControl: true,
        attributionControl: true,
        dragging: !readOnly,
        scrollWheelZoom: false,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      const start = initialRef.current
        ? ([initialRef.current.lat, initialRef.current.lng] as [number, number])
        : ANANTNAG;
      map.setView(start, initialRef.current ? 16 : 13);

      if (initialRef.current) {
        const icon = L.divIcon({
          className: "dd-pin",
          html: pinSvg(),
          iconSize: [34, 44],
          iconAnchor: [17, 42],
        });
        const marker = L.marker(start, { icon, draggable: !readOnly }).addTo(map);
        markerRef.current = marker;
        if (!readOnly) {
          marker.on("dragend", async () => {
            const ll = marker.getLatLng();
            let label = `Pinned spot (${ll.lat.toFixed(5)}, ${ll.lng.toFixed(5)})`;
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${ll.lat}&lon=${ll.lng}&zoom=18`,
              );
              const data = (await res.json()) as { display_name?: string };
              if (data.display_name) label = data.display_name;
            } catch {
              /* keep fallback label */
            }
            onPickRef.current?.({ lat: ll.lat, lng: ll.lng, label });
          });
        }
      }

      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 80);
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        Lref.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to externally chosen locations (saved addresses)
  useEffect(() => {
    if (!external || !mapRef.current) return;
    mapRef.current.flyTo([external.lat, external.lng], 16, { duration: 0.6 });
    const L = Lref.current;
    if (!L) return;
    if (markerRef.current) markerRef.current.setLatLng([external.lat, external.lng]);
    else {
      const icon = L.divIcon({
        className: "dd-pin",
        html: pinSvg(),
        iconSize: [34, 44],
        iconAnchor: [17, 42],
      });
      markerRef.current = L.marker([external.lat, external.lng], {
        icon,
        draggable: !readOnly,
      }).addTo(mapRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [external?.lat, external?.lng]);

  // Debounced autocomplete via OpenStreetMap Nominatim
  useEffect(() => {
    if (readOnly) return;
    const term = q.trim();
    if (term.length < 3) {
      setResults([]);
      return;
    }
    const id = ++reqId.current;
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(term)}`,
          { headers: { Accept: "application/json" } },
        );
        if (id !== reqId.current) return;
        const data = (await res.json()) as Array<{
          place_id: number;
          display_name: string;
          lat: string;
          lon: string;
        }>;
        setResults(
          data.map((d) => ({
            id: String(d.place_id),
            name: d.display_name,
            lat: parseFloat(d.lat),
            lon: parseFloat(d.lon),
          })),
        );
      } catch {
        if (id === reqId.current) setResults([]);
      } finally {
        if (id === reqId.current) setSearching(false);
      }
    }, 420);
    return () => clearTimeout(t);
  }, [q, readOnly]);

  const select = (r: Result) => {
    if (!mapRef.current || !Lref.current) return;
    mapRef.current.flyTo([r.lat, r.lon], 16, { duration: 0.6 });
    const L = Lref.current;
    if (markerRef.current) markerRef.current.setLatLng([r.lat, r.lon]);
    else {
      const icon = L.divIcon({
        className: "dd-pin",
        html: pinSvg(),
        iconSize: [34, 44],
        iconAnchor: [17, 42],
      });
      markerRef.current = L.marker([r.lat, r.lon], { icon, draggable: !readOnly }).addTo(
        mapRef.current,
      );
    }
    setResults([]);
    onPickRef.current?.({ lat: r.lat, lng: r.lon, label: r.name });
  };

  return (
    <div className={cx("relative overflow-hidden rounded-2xl border border-line", className)}>
      <div ref={divRef} className="h-full w-full" />

      {!readOnly && (
        <div className="absolute left-3 top-3 z-[1001] w-[calc(100%-24px)]">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-bg/95 px-3 py-2.5 shadow-lg backdrop-blur">
            <SearchIcon className="h-4 w-4 shrink-0 text-gold" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search your street, area or landmark…"
              className="w-full bg-transparent text-[13px] font-medium text-cream outline-none placeholder:text-muted/60"
            />
            {searching && <Spinner className="h-3.5 w-3.5 shrink-0" />}
          </div>
          {results.length > 0 && (
            <div className="mt-1.5 overflow-hidden rounded-xl border border-line bg-bg/95 shadow-lg backdrop-blur">
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => select(r)}
                  className="flex w-full items-start gap-2 border-b border-line px-3 py-2.5 text-left transition last:border-0 active:bg-raise"
                >
                  <PinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                  <span className="line-clamp-2 text-[12px] font-medium text-cream">{r.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!readOnly && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-[1001] rounded-lg border border-line bg-bg/90 px-2.5 py-1.5 text-[10px] font-bold text-gold backdrop-blur">
          Drag the golden pin to confirm the exact spot
        </div>
      )}
    </div>
  );
}
