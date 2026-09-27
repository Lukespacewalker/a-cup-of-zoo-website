# Watercolor assets — 27 September 2026

Root prepared the assets for the approved paper/watercolor design. Real photos remain source photographs, with CSS presentation masks only. Brush JPGs were supplied by the user and resized/encoded as 1000px WebP for delivery (not repainted).

## Sources

- `src/assets/watercolor/shop-sign-source.png`: supplied watercolor café sign poster; source retained.
- `src/assets/watercolor/wishing-corner.png`: supplied actual café photograph of mascot and wooden wish plaques.
- `src/assets/watercolor/brush-{wide,upright,soft}.jpg`: the user's three brush references, original copies. `.webp` versions are compressed web masks.
- `src/assets/watercolor/meerkats.png`, `ducks.png`, `nine-tailed-fox.png`: generated with the built-in imagegen tool using the user's references; transparent output checked in metadata and visually.

## Prompts

### Meerkats

Use case: style-transfer. Asset: a single transparent hand-painted watercolor spot illustration for a refined warm family café website. Use the LOWER watercolor meerkat group in the provided reference as the visual direction, and the upper photograph only for anatomy. Paint a small friendly group of five meerkats, with two standing tall behind and others gathered low in front, faithful brown-and-golden coats and dark eye patches. Soft pigment washes, fine irregular watercolor edges, understated warm ochre and cocoa palette, delicate sparse ground brush marks. An elegant natural-history storybook watercolor, cute through the real poses, not oversized cartoon eyes. Show entire bodies and tails, balanced compact composition. The output contains ONLY the watercolor group, no photo, no comparison layout, no text or frame. True transparent alpha outside the animal paint and a few ground strokes, absolutely no paper rectangle or background.

### Ducks

Use case: style-transfer. Asset: one transparent watercolor spot illustration for an elegant cream-paper boutique animal café website. Use the LOWER watercolor ducks in this reference as the composition and painting direction. Four white ducks with tiny warm orange bills floating in a diagonal group seen from above, with restrained seafoam/soft teal water brush washes and delicate ripples around them. Hand-painted watercolor, airy translucent pigment, lovely natural poses, warm and family friendly but sophisticated. Keep the graceful negative space and organic irregular edges of the water wash. No upper photograph, no comparison layout, no paper, no background rectangle, no lettering, no frame. Genuine transparent alpha around the irregular water-and-ducks painting. Entire group visible with ample transparent margin. The water edges should delicately dissolve into transparency.

### Nine-Tailed Fox

Paint a watercolor illustration of the golden fox statue in this photo for its café website. Keep the same recognizable friendly face, red forehead spiral, closed curved black eyes, red nose, joined hands, big pink ears, cream muzzle, little feet and nine golden tails. Show the full seated fox alone. Soft hand-painted watercolor pigment and fine edges, warm cream and gold, cute and carefully drawn. Remove all surrounding objects and scenery. No lettering or logo. Transparent background.

The initial detailed mascot prompt was rejected by the tool at output moderation. A simpler benign illustration request with the same source succeeded; no fallback provider was used.

### Hero extraction

Edit this existing café watercolor artwork for a website hero. Remove only the plain cream paper background and the small printed footer below the flowers ('A Cup of Zoo', 'Cafe & Farm', '2026'). Keep the entire existing watercolor scene: diagonal wooden café facade and both its signs, blue sky wash, flowering branch and foliage around the bottom. Preserve the existing lettering on the wooden facade exactly, including 'A Cup of Zoo', 'Cafe & Farm' and the small Thai sign. Preserve the same building, perspective, colors, brushwork and composition; do not redesign or add anything. Crop away the large empty area above and below the scene. Output the remaining whole watercolor scene as a large landscape transparent cutout with all branches and greenery contained, delicately irregular alpha edges, and no paper-colored rectangle. Transparent background.

## Mask reference

### Paper texture

Asset: a seamless repeating texture tile for the background of an elegant watercolor café website. A straight-on macro scan of warm ivory cold-press watercolor paper, with visible but delicate irregular cotton-paper grain and a very fine canvas-like fibre structure. Uniform softly lit cream/off-white tone across the entire square. Natural small-scale tooth, quietly tactile, enough relief to remain apparent behind a website with dark brown text. No objects, no drawings, no stains, no spots, no tears, no folds, no vignette, no shadows at edges, no text, no border. Tileable seamlessly on all four edges, not a photograph of a sheet on a table. Restrained boutique stationery quality.

Built-in output saved as `src/assets/watercolor/canvas-paper.png` with a 1024px WebP delivery copy. The user requested more visible paper/canvas texture during implementation; this replaces the initially subtle existing washi background. Blending uses the current theme background so dark mode stays dark.

### Placement correction

The user requested that the small watercolor ducks move off the homepage to avoid duplication beside the real duck photograph. They now appear only beside the garden heading on the activities page, in both languages.

## Mask implementation

The source brushes are black on white. A solid alpha mask minus the source's luminance reveals the dark brush silhouette while making white margins transparent. This follows [MDN mask-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-mode) and [mask-composite](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-composite). A normal rectangular photo is the fallback when these properties are unsupported.
