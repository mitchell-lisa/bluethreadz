/**
 * Personalization taken from the live MFC shop (Cloudlift Live Product Options)
 * and the live Aces shop (ShopPad Infinite Options).
 *
 * Cloudlift's $10 name-and-number fee is an app price adjustment on the checkbox
 * value. It is not a Shopify add-on product or variant, so this shop does not charge it.
 */

export type LineAttribute = { key: string; value: string };

export type PersChoice = { value: string; color: string };

export type PersField = {
  name: string;
  label: string;
  required: boolean;
  maxLength?: number;
  kind: "text" | "choice";
  choices?: PersChoice[];
};

export type PersSchema = {
  id: string;
  gate?: { label: string; value: string };
  fields: PersField[];
};

const FONT: PersField = {
  name: "font-color",
  label: "Choose Font Color",
  required: true,
  kind: "choice",
  choices: [
    { value: "Neon", color: "#59ff00" },
    { value: "White", color: "#ffffff" },
    { value: "Black", color: "#000000" },
  ],
};

const NAME_NUMBER_GATE = {
  label: "Click to Add Player Name & Number",
  value: "Add Player Name & #",
};

const NAME_GATE = {
  label: "Click to Add Player Name",
  value: "Add Player Name",
};

function text(name: string, label: string, required: boolean, maxLength?: number): PersField {
  return { name, label, required, maxLength, kind: "text" };
}

function nameAndNumber(): PersSchema {
  return {
    id: "mfc-name-number",
    gate: NAME_NUMBER_GATE,
    fields: [FONT, text("player-name", "Player Name", false, 20), text("player-number", "Player Number", false, 4)],
  };
}

function playerNameOnly(): PersSchema {
  return {
    id: "mfc-player-name",
    gate: NAME_GATE,
    fields: [FONT, text("player-name", "Player Name", false, 20)],
  };
}

function includes(title: string, fragment: string) {
  return title.toLowerCase().includes(fragment);
}

/** Which products get fields, matched to the live MFC and Aces option sets. */
export function personalizationFor(title: string): PersSchema | null {
  const raw = title.replace(/\s+/g, " ").trim();
  const t = raw.toLowerCase();

  if (includes(t, "custom short sleeve hoodie")) {
    return {
      id: "aces-player",
      fields: [text("player-name", "PLAYER NAME:", true, 15), text("player-number", "PLAYER #:", true, 2)],
    };
  }
  if (includes(t, "camo custom hoodie")) {
    return { id: "aces-custom-name", fields: [text("custom-name", "CUSTOM NAME:", true)] };
  }
  if (t === "aces official league jersey") {
    return { id: "aces-jersey", fields: [text("player-number", "PLAYER NUMBER", true, 2)] };
  }
  if (t === "sports cooling hoodie towel") {
    return { id: "mfc-towel", fields: [text("player-number", "Player Number:", true)] };
  }
  if (includes(t, "personalized")) return playerNameOnly();

  const pal = /^\(pal logo\)\s*/i.test(raw);
  if (!pal && t === "youth core fleece pullover hooded sweatshirt") return nameAndNumber();

  const bags = [
    "nike brasilia small duffel",
    "nike brasilia drawstring pack",
    "nike brasilia medium backpack",
    "picnic blanket",
    "undeniable 5.0 md duffel",
    "contain small convertible duffel",
  ];
  if (bags.some((fragment) => includes(t, fragment))) return nameAndNumber();

  return null;
}

function plain(label: string) {
  return label.replace(/:$/, "").trim().toLowerCase();
}

export function lineAttributes(
  schema: PersSchema,
  gateOn: boolean,
  values: Record<string, string>,
): { attributes: LineAttribute[] } | { error: string } {
  if (schema.gate && !gateOn) return { attributes: [] };

  const attributes: LineAttribute[] = [];
  if (schema.gate) attributes.push({ key: schema.gate.label, value: schema.gate.value });

  for (const field of schema.fields) {
    const value = (values[field.name] ?? "").replace(/\s+/g, " ").trim();
    if (!value) {
      if (field.required) {
        return { error: field.kind === "choice" ? "Choose a font color." : `Enter ${plain(field.label)}.` };
      }
      continue;
    }
    if (field.maxLength && [...value].length > field.maxLength) {
      return { error: `${field.label.replace(/:$/, "").trim()} can be ${field.maxLength} characters.` };
    }
    if (field.kind === "choice" && field.choices && !field.choices.some((choice) => choice.value === value)) {
      return { error: "Choose a font color." };
    }
    attributes.push({ key: field.label, value });
  }

  return { attributes };
}

export function cleanAttributes(input: unknown): LineAttribute[] {
  if (!Array.isArray(input)) return [];
  const out: LineAttribute[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const record = item as { key?: unknown; value?: unknown };
    const key = String(record.key ?? "").trim().slice(0, 80);
    const value = String(record.value ?? "").trim().slice(0, 255);
    if (!key || !value) continue;
    out.push({ key, value });
    if (out.length >= 8) break;
  }
  return out;
}
