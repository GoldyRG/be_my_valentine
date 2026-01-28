# Be My Valentine (Vite + React)

A playful Valentine prompt with a shy “No” button, a “Ridiculous No Test,” and a celebratory “Yes” flow. No external APIs needed.

## Run it locally
```bash
npm install
npm run dev
```

## Gameplay
- Hearts: 5 lives under the headline. Each hover/tap on **No** burns a heart and yeets the button across the screen. When hearts hit 0 you land on the declined view.
- Declined view: tap **Start quiz** to see the heartbreak overlay then tackle the hard quiz; or **Replay/Try again** to fully reset (hearts, positions, state).
- Quiz: shows rotating riddles; answers must be exact. “Try again” resets you back home with full hearts.
- Yes path: launches confetti, heart rain, and the acceptance screen (only accessible via **Yes**).

## Highlights
- Floating hearts and gradients for a cozy vibe.
- Dramatic “No” dodging with opposite-side jumps so it never just nudges.
- Heartbreak overlay before the quiz for clear feedback.
- Mobile-friendly spacing on modals and buttons.
