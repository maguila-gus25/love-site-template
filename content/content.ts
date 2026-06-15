// content/content.ts
// -----------------------------------------------------------------------------
// ALL of the site's content lives here. To customize the site, edit ONLY this
// file — you never need to touch the components.
//
// This is a reusable template: replace the placeholder names, dates, photos,
// list items and the letter below with your own, and the whole site updates.
// -----------------------------------------------------------------------------

// ----------------------------- Types -----------------------------------------

export interface Couple {
  /** Your name */
  you: string;
  /** Their name */
  them: string;
}

export interface Moment {
  /** ISO date: "YYYY-MM-DD" */
  date: string;
  title: string;
  description: string;
  /** Photo path, relative to /public (optional) */
  photo?: string;
  /** true = anchor milestone, gets visual emphasis on the timeline (shown in pink) */
  anchor?: boolean;
}

export interface Photo {
  /** Path relative to /public, e.g. "/photos/01.jpg" */
  src: string;
  /** Alt text (accessibility) — describe the photo */
  alt: string;
  /** Handwritten caption (Caveat font) shown under the polaroid */
  caption: string;
}

export interface ThingILove {
  /** Optional emoji to decorate the item */
  emoji?: string;
  text: string;
}

export interface PlaylistTrack {
  /** Track title, exactly as it appears on Spotify */
  title: string;
  /** Artist / band name */
  artist: string;
  /** URI in the form "spotify:track:XXXXXXXXXXXXXXXXXXXXXX" (not the https:// link) */
  uri: string;
}

// ----------------------------- Key dates -------------------------------------
// These two dates drive the "days together" counter and two anchor milestones.

/** When it all began — base for the days-together counter. */
export const START_DATE = "2024-02-14";

/** The day you made it official. */
export const PROPOSAL_DATE = "2024-07-20";

// ----------------------------- Hero ------------------------------------------

export const couple: Couple = {
  you: "Partner One",
  them: "Partner Two",
};

export const hero = {
  /** Short, sweet opening line shown under the names. */
  tagline: "the story of us",
  /** Date shown at the top (usually the start date). */
  displayedDate: START_DATE,
};

// ----------------------------- Timeline --------------------------------------
// Add the moments that matter to you, in chronological order. Anchor moments
// (anchor: true) are highlighted in pink — use them for the big milestones,
// like the day you met or the day you made it official.

export const moments: Moment[] = [
  {
    date: START_DATE,
    title: "The day we met",
    description:
      "Describe how it all started. Anchor moments like this one are highlighted in pink on the timeline.",
    anchor: true,
  },
  {
    date: "2024-03-22",
    title: "Our first trip",
    description:
      "A regular moment. Write a short memory here — where you went, what you did, an inside joke.",
  },
  {
    date: "2024-05-10",
    title: "A favorite day",
    description:
      "Another everyday memory. Add as many of these as you like between the anchor milestones.",
  },
  {
    date: PROPOSAL_DATE,
    title: "The day we made it official",
    description:
      "Your second anchor milestone — also highlighted in pink. Tell the story of this big moment.",
    anchor: true,
  },
  {
    date: "2024-12-05",
    title: "First holidays together",
    description:
      "Keep going — every moment you add here shows up as a card on the timeline.",
  },
];

// ----------------------------- Gallery ---------------------------------------
// Drop your images into /public/photos/ (e.g. 01.jpg) and reference them below.
// Until you add images, the gallery shows a friendly "your photo here" frame,
// so the layout never breaks while you build it out.

export const photos: Photo[] = [
  { src: "/photos/01.jpg", alt: "Describe this photo for accessibility", caption: "Add a caption" },
  { src: "/photos/02.jpg", alt: "Describe this photo for accessibility", caption: "Add a caption" },
  { src: "/photos/03.jpg", alt: "Describe this photo for accessibility", caption: "Add a caption" },
  { src: "/photos/04.jpg", alt: "Describe this photo for accessibility", caption: "Add a caption" },
  { src: "/photos/05.jpg", alt: "Describe this photo for accessibility", caption: "Add a caption" },
  { src: "/photos/06.jpg", alt: "Describe this photo for accessibility", caption: "Add a caption" },
  { src: "/photos/07.jpg", alt: "Describe this photo for accessibility", caption: "Add a caption" },
  { src: "/photos/08.jpg", alt: "Describe this photo for accessibility", caption: "Add a caption" },
  { src: "/photos/09.jpg", alt: "Describe this photo for accessibility", caption: "Add a caption" },
];

// ----------------------------- Things I love about you -----------------------
// One short line per reason. Add or remove as many as you like.

export const thingsILove: ThingILove[] = [
  { emoji: "💛", text: "I love how kind you are" },
  { emoji: "🔥", text: "I love how passionate you are" },
  { emoji: "🌷", text: "I love how hard you try" },
  { emoji: "✨", text: "I love how talented you are" },
  { emoji: "🫶", text: "I love how caring you are" },
  { emoji: "😂", text: "I love how funny you are" },
  { emoji: "🧠", text: "I love how smart you are" },
  { emoji: "😍", text: "I love how beautiful you are" },
  { emoji: "💖", text: "I love how loving you are" },
  { emoji: "🌈", text: "I love how authentic you are" },
  { emoji: "🌻", text: "I love how joyful you are" },
  { emoji: "🤍", text: "I love your hugs" },
];

// ----------------------------- Vinyl playlist --------------------------------
// A hand-curated list, in the same order as your Spotify playlist. The vinyl
// player uses this list to play and navigate between tracks — it does not query
// the Spotify API by name.
//
// To fill it in: on Spotify, click a track's "..." > Share > Copy Song Link.
// Take the ID from the URL (https://open.spotify.com/track/<ID>) and write it
// as "spotify:track:<ID>" (no parameters after the ID). The sample tracks below
// are public songs — replace them with the ones that mean something to you.

export const vinylPlaylist: PlaylistTrack[] = [
  { title: "Die With A Smile", artist: "Lady Gaga, Bruno Mars", uri: "spotify:track:2plbrEY59IikOBgBGLjaoe" },
  { title: "Daylight", artist: "Taylor Swift", uri: "spotify:track:1fzAuUVbzlhZ1lJAx9PtY6" },
  { title: "DAISIES", artist: "Justin Bieber", uri: "spotify:track:5BZsQlgw21vDOAjoqkNgKb" },
  { title: "Cha Cha Cha", artist: "Bruno Mars", uri: "spotify:track:6QletrrmpkUpeJkipX9pgf" },
];

// ----------------------------- Date voucher (spin wheels) --------------------
// A sequence of wheels that draw, one by one, how your next date will go.
// Each item becomes a wheel in the listed order; the combined results form the
// final "date voucher", which can be downloaded as a PDF.

export interface DateVoucherStep {
  question: string;
  options: string[];
  /** When set, the wheel always lands on this value (must match one of `options`). */
  fixedResult?: string;
}

export const dateVoucherSteps: DateVoucherStep[] = [
  {
    question: "Cuisine",
    options: ["Italian", "Japanese", "Mexican", "Burgers", "Steakhouse", "Vegetarian"],
  },
  { question: "Dessert?", options: ["Yes", "No"], fixedResult: "Yes" },
  { question: "Drinks?", options: ["Yes", "No"], fixedResult: "Yes" },
  {
    question: "What's the vibe?",
    options: ["Cozy night in", "Night out", "Adventure", "Something new"],
  },
  {
    question: "What do we do after?",
    options: ["Watch a movie", "Watch the sunset", "Get ice cream", "Go for a walk"],
  },
];

// ----------------------------- The letter ------------------------------------
// The site simply renders the text below. Write your own letter here.

export const LETTER = `Dear [their name],

This is where your letter goes. Write from the heart — the site renders this
text exactly as you type it, in a handwritten font, inside an envelope that
opens when the reader clicks "Open".

Tell them what they mean to you. Mention the little things, the inside jokes,
the moments that made you fall. There are no rules here — just make it yours.

With all my love,

[your name]`;
