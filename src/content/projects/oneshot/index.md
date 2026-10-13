---
title: OneShot
year: "2021"
summary: A browser-based augmented-reality runner that turns a Sapporo beer can into a game screen.
cardSummary: A DJ races to the stage, collecting vinyl records on a game screen anchored to a Sapporo can.
depth: flagship
order: 3
featured: true
categories: [augmented-reality, game, commercial]
roles: [Implementation lead, Game developer, AR developer]
tools: [Unity, WorldCAST]
hero: ../../../assets/projects/oneshot/oneshot-hero.webp
heroAlt: OneShot pixel artwork of a DJ running through a crowd toward a purple-lit concert stage
detailHero: ../../../assets/projects/oneshot/oneshot-hero.webp
detailHeroAlt: OneShot pixel artwork of a DJ running through a crowd toward a purple-lit concert stage
media:
  - id: gameplay
    type: video
    intention: Runner gameplay
    aspectRatio: 432 / 960
    alt: A DJ collects vinyl records and dodges obstacles in OneShot, with the game screen anchored to a Sapporo can
    caption: The runner game plays on a virtual screen anchored to the can.
    state: ready
    poster: ../../../assets/projects/oneshot/gameplay-poster.webp
    sources:
      - src: /media/projects/oneshot/gameplay.mp4
        type: video/mp4
  - id: campaign-packaging
    type: image
    intention: Sapporo campaign packaging
    aspectRatio: 3024 / 4032
    alt: A Sapporo six-pack held in a store, with packaging inviting customers to unlock a hidden game and enter to win a home music studio
    caption: The six-pack packaging invites players to unlock the game and enter the campaign's prize draw.
    state: ready
    image: ../../../assets/projects/oneshot/oneshot-card.webp
  - id: can-tracking
    type: video
    intention: Can recognition and AR anchoring
    aspectRatio: 432 / 960
    alt: A phone camera recognizes a Sapporo can and anchors OneShot content to it as the can moves
    caption: Recognizing the can connects the physical packaging to the AR experience.
    state: ready
    poster: ../../../assets/projects/oneshot/can-tracking-poster.webp
    sources:
      - src: /media/projects/oneshot/can-tracking.mp4
        type: video/mp4
  - id: campaign-introduction
    type: video
    intention: Campaign introduction and game entry
    aspectRatio: 444 / 960
    alt: OneShot's Sapporo campaign introduction and animated DJ story appear around a can in a phone camera view
    caption: The campaign introduction leads into the DJ's journey to the stage.
    state: ready
    poster: ../../../assets/projects/oneshot/campaign-introduction-poster.webp
    sources:
      - src: /media/projects/oneshot/campaign-introduction.mp4
        type: video/mp4
  - id: start-screen
    type: image
    intention: Game start screen
    aspectRatio: 796 / 1420
    alt: OneShot start screen with its yellow star wordmark, a Tap to Start button, and the pixel-art DJ holding a vinyl record
    caption: The game start screen introduces OneShot and its DJ character.
    state: ready
    image: ../../../assets/projects/oneshot/start-screen.webp
  - id: instructions-screen
    type: image
    intention: Gameplay instructions
    aspectRatio: 804 / 1420
    alt: OneShot instructions explaining left and right movement, record collection, and the choice to cash out or continue after a level
    caption: The instructions introduce the controls and the choice to continue playing or cash out.
    state: ready
    image: ../../../assets/projects/oneshot/instructions-screen.webp
  - id: gameplay-concept
    type: image
    intention: Gameplay concept mockup
    aspectRatio: 974 / 1482
    alt: A OneShot design mockup showing the DJ, vinyl collectibles, and concert stage inside a phone outline layered over a Sapporo can
    caption: A design mockup exploring the relationship between the can, game screen, and runner.
    state: ready
    image: ../../../assets/projects/oneshot/gameplay-concept.webp
  - id: story-animation
    type: image
    intention: Animated story introduction
    aspectRatio: 280 / 480
    alt: Animated pixel-art story introducing the DJ Art on a beach at sunset
    caption: The animated story introduces Art before his run to the stage.
    state: ready
    image: ../../../assets/projects/oneshot/story-animation.webp
  - id: runner-animation
    type: image
    intention: Animated runner gameplay
    aspectRatio: 274 / 480
    alt: Animated OneShot gameplay with a countdown, vinyl records, and a DJ running through a crowd toward the stage
    caption: A gameplay animation shows the runner and vinyl collection mechanics.
    state: ready
    image: ../../../assets/projects/oneshot/runner-animation.webp
  - id: game-over-animation
    type: image
    intention: Animated game-over screen
    aspectRatio: 280 / 480
    alt: Animated OneShot game-over screen with Start Over and Cash In Points buttons above the DJ character
    caption: The game-over screen offers another run or the option to cash in points.
    state: ready
    image: ../../../assets/projects/oneshot/game-over-animation.webp
  - id: level-progression
    type: diagram
    intention: Level and reward progression design
    aspectRatio: 2576 / 1164
    alt: OneShot campaign design diagram mapping six levels and increasing scores to prize opportunities and grand-prize draw entries
    caption: A campaign design reference maps score milestones to prize opportunities and draw entries.
    state: ready
    image: ../../../assets/projects/oneshot/level-progression.webp
context: Sapporo promotional campaign, developed by Artifacts in collaboration with BottleCap Media and Sapporo Breweries
collaborators: []
credits:
  - "Game development, AR implementation, and implementation leadership: Amir Bahador Rostami"
  - "Development studio: Artifacts"
  - "Campaign collaborators: BottleCap Media and Sapporo Breweries"
externalLinks:
  - label: OneShot at Artifacts
    url: https://artifactslab.ca/oneshot/
liveExperiment: false
outcomes: []
draft: false
---

<!-- chapter:experience -->

## A DJ on the way to a gig

OneShot follows a DJ racing toward a gig on stage. Players collect vinyl records to score points and dodge obstacles along the route. The 2D runner brings a familiar game format into a physical setting: a Sapporo beer can becomes the surface for its virtual screen.

Players scan a QR code on a Sapporo six-pack to open the experience in their phone's browser. After a short onboarding flow, they point the camera at a can. Once the can is recognized, the game screen appears anchored to it, ready to play.

<!-- chapter:contribution -->

## From game mechanics to AR integration

As a co-founder of Artifacts, I helped lead the project's implementation. I contributed to game development and AR implementation, focusing on the game mechanics and integration.

My work connected the Unity game with the browser-based AR experience, bringing the runner's interactions onto the screen anchored to the can.

<!-- chapter:technical -->

## Unity and WorldCAST

The game was developed in Unity, with WorldCAST providing the web-based AR capabilities. The experience connects the QR entry point, onboarding, can recognition, and runner gameplay in the phone's browser.

<!-- chapter:process -->

## Built for a quick session, replayed for longer

The gameplay was designed for roughly 10 minutes. I remember people replaying and spending as long as 20–25 minutes with the experience. This is a recollection rather than a measured campaign result, but it captures the repeated play I observed.

[Watch the gameplay recording](#media-gameplay) or [see the can recognition in action](#media-can-tracking).

<!-- chapter:credits -->

## Campaign context

OneShot launched in 2021 as part of a Sapporo promotional campaign with prizes for players. Artifacts developed the experience in collaboration with BottleCap Media and Sapporo Breweries.
