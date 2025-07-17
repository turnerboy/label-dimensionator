# Label-Dimensionator

**A design thinking experiment for my sister’s label business**

---

## The Back Story

My sister juggles several ventures at once, so every minute counts. I noticed from our conversation that one task keeps slowing her process. It was adding fold lines and dimensions to label artwork that needs to sent to the vendors. Usually, the remote graphic designer in Edmonton handles it, but the bottleneck happens when that graphics designer takes a day off and the whole workflow stalls.  

After two years of immersing myself in Design Thinking and working as a product manager, I was itching to work on this design challenge. Early this morning, I sat with my bro-in-law and drilled into their process. I asked lots of **How might** we questions, hunting for the “aha” moment:

- How might we let her preview folds without waiting on a human designer?
- How might we turn the specs she already knows into instant, visual feedback?
- How might we keep the interface so familiar that it feels like sending instructions to her designer?

---

## Design Statement

My sister, a busy entrepruner who runs a label manufacturing business, wants to add fold lines and dimensions to labels instantly because she needs to keep daily orders moving without delay but the process stalls whenever her remote graphics designer is unavailable.

---

## Why This Matters

- Saves a day of downtime whenever the Grapics designer is away.
- Frees my sister to focus on strategy and clients instead of chasing tiny edits.
- Shows how lightweight automation, guided by design thinking, can remove a bottleneck without forcing anyone to “learn tech.”

---

## What It Does in One Sentence

> You enter width, height, fold type (center, left-right, top-bottom), pick an image, and the canvas renders a ready-to-print label preview while you watch.

---

## How It Reflects Design Thinking

1. **Empathize** – I listened to my bro-in-law describe their  busiest days and the pain of stalled production.

2. **Define** – The core problem is wasted hours waiting on routine fold-line markup.  

3. **Ideate** – Brainstormed solutions that stay inside her comfort zone of simple forms and immediate visuals.

4. **Prototype** – Built a quick React + TypeScript canvas app using lovable.dev in three iterations before lunch.

5. **Test** – Shared the link with her by noon; she confirmed the preview felt as natural as sending specs to her designer.

---

## Getting Started

```bash
git clone <repo>
cd label-fold-preview
npm install
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

Using Lovable.Dev and a lot of coffee :)
