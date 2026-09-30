---
title: BioWords
year: "2019"
summary: An artificial-life work that turns words from participants' sentences into biomorphs whose sentiment and DNA shape flocking, community, and survival.
cardSummary: Sentences become artificial creatures with word-shaped DNA.
depth: short
order: 4
featured: false
categories: [artificial-life, generative-art, web-experience]
roles: [Solo creator]
tools: [Local sentiment analysis, PixiJS (production adaptation)]
hero: ../../../assets/projects/biowords/biowords-card.webp
heroAlt: Small line-drawn BioWord creatures arranged across a white field
detailHero: ../../../assets/projects/biowords/biowords-hero.webp
detailHeroAlt: Small line-drawn BioWord creatures arranged across a white field
media:
  - id: opening-image
    type: image
    intention: BioWords opening image
    aspectRatio: 125 / 72
    alt: Small line-drawn BioWord creatures arranged across a white field
    caption: BioWords transforms sentences into artificial creatures with word-shaped DNA.
    state: ready
    image: ../../../assets/projects/biowords/biowords-hero.webp
  - id: original-simulation
    type: video
    intention: Original BioWords simulation
    aspectRatio: 16 / 9
    alt: Screen recording of small line-drawn BioWords creatures moving across a white field
    caption: An excerpt from the original BioWords simulation, before the browser adaptation below.
    state: ready
    poster: ../../../assets/projects/biowords/simulation-poster.webp
    sources:
      - src: /media/projects/biowords/simulation.mp4
        type: video/mp4
context: York University final project and exhibition
collaborators: []
credits: [Solo project by Amir Bahador Rostami]
externalLinks: []
liveExperiment: true
outcomes: []
draft: false
---

<!-- chapter:experience -->

## The original work

BioWords was my solo final project and exhibition at York University in 2019. Participants submitted text through Twitter using the hashtag `#biwords`. Local sentiment analysis scored each sentence, and its words became biomorphs: each sequence of letters supplied a creature's DNA.

Genome and sentiment shaped flocking, community formation, and survival in the environment. The simulation's result returned to Twitter as a sentence formed from surviving words.

<!-- chapter:technical -->

## The production adaptation

The production adaptation replaces the Twitter interaction with direct local text input and uses PixiJS for rendering. Sentiment analysis stays local; the experience has no X dependency and stores no submitted text or results.

The result contains only original surviving words, ordered by survival time, longest-lived first, then by remaining energy. Survival determines the sequence rather than grammatical coherence.
