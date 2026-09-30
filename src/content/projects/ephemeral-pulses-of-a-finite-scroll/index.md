---
title: Ephemeral Pulses of a Finite Scroll
alternateTitle: Remote Realities
year: "2020"
summary: A sound installation in which wireless swing units complete a chord when their movement reaches rhythmic and harmonic synchronization.
cardSummary: Networked swings complete a chord when their movements synchronize.
depth: flagship
order: 3
featured: true
categories: [technology-art, installation]
roles: [Co-creator]
tools: [Raspberry Pi, MPU-6050, Python, SuperCollider, Audio interface, Amplifier, Surface transducer]
hero: ../../../assets/projects/remote-realities/remote-realities-card.webp
heroAlt: A visitor beside a suspended translucent installation in a blue-lit gallery
media:
  - id: installation-hero
    type: image
    intention: Installation hero
    aspectRatio: 16 / 9
    alt: A visitor beside a suspended translucent installation in a blue-lit gallery
    caption: Ephemeral Pulses of a Finite Scroll installed in a blue-lit gallery.
    state: ready
    image: ../../../assets/projects/remote-realities/remote-realities-card.webp
  - id: participant-interaction
    type: image
    intention: Participant interaction
    aspectRatio: 1079 / 1920
    alt: Visitor beneath a suspended unit in the blue-lit gallery installation
    caption: A visitor moves beneath one of the suspended units.
    state: ready
    image: ../../../assets/projects/remote-realities/participant-interaction.webp
  - id: sculpture-floor-layout-renders
    type: image
    intention: Sculptural arrangement in the gallery
    aspectRatio: 16 / 9
    alt: Wide gallery view of suspended translucent panels arranged around the installation
    caption: Suspended translucent panels shape the space around the swing units.
    state: ready
    image: ../../../assets/projects/remote-realities/sculptural-overview.webp
  - id: sound-synthesis-unit-architecture
    type: diagram
    intention: Sound Synthesis Unit architecture
    aspectRatio: 4 / 3
    alt: Diagram connecting power, Raspberry Pi, MPU-6050 gyroscope and accelerometer, audio amplifier, and surface transducer
    caption: The unit diagram shows the local sensing and sound hardware; the final installation also used a wireless master computer.
    state: ready
    image: ../../../assets/projects/remote-realities/sound-unit-architecture.webp
  - id: hardware-components
    type: image
    intention: Hardware components
    aspectRatio: 1920 / 1484
    alt: Montage of an installed swing unit and its Raspberry Pi, gyroscope and accelerometer board, audio hardware, and internal assembly
    caption: Documentation of the installed unit and its principal electronics.
    state: ready
    image: ../../../assets/projects/remote-realities/hardware-components.webp
  - id: fourteen-note-directional-mapping
    type: diagram
    intention: Fourteen-note directional mapping
    aspectRatio: 8 / 7
    alt: Radial key-mapping diagram and render showing how swing direction maps to musical notes
    caption: The proposal's radial mapping connects movement direction to the installation's note system.
    state: ready
    image: ../../../assets/projects/remote-realities/directional-key-mapping.webp
  - id: installed-swing-detail
    type: image
    intention: Installed swing detail
    aspectRatio: 16 / 9
    alt: Close-up of the suspended unit's translucent enclosure and attached hardware
    caption: A close view of the installed swing enclosure and its physical connections.
    state: ready
    image: ../../../assets/projects/remote-realities/installed-swing-detail.webp
  - id: installation-film
    type: video
    intention: Installation documentation
    aspectRatio: 16 / 9
    alt: Video excerpt showing visitors moving through the Ephemeral Pulses installation
    caption: A short excerpt of visitors moving among the suspended units; sound is part of the work.
    state: ready
    poster: ../../../assets/projects/remote-realities/installation-poster.webp
    sources:
      - src: /media/projects/ephemeral-pulses-of-a-finite-scroll/installation.mp4
        type: video/mp4
context: Remote Realities Themed Commission
collaborators: [Elahe Rostami]
credits:
  - "Creators: Amir Rostami and Elahe Rostami"
  - "Co-presenters: Trinity Square Video and Dames Making Games"
  - "Supporter: EQ Bank"
externalLinks:
  - label: Ephemeral Pulses of a Finite Scroll — Remote Realities
    url: https://remoterealities.jenniefaber.com/project/ephemeral-pulses-of-a-finite-scroll/
liveExperiment: false
outcomes: []
draft: false
---

<!-- chapter:experience -->

## The experience

Ephemeral Pulses of a Finite Scroll connects the movement of swing units through sound. When their movements reach rhythmic and harmonic synchronization, an additional note completes a chord.

<!-- chapter:contribution -->

## My contribution

I co-created the work with Elahe Rostami and personally handled the coding, hardware design, hardware sourcing, system integration, fabrication, and assembly. The installation brings physical movement, sensing, and sound into a shared system.

<!-- chapter:technical -->

## The system

Each wireless swing unit sent accelerometer and gyroscope data to a master computer. The master compared the live movement data, detected rhythmic and harmonic synchronization, and instructed the swings to play the additional note that completed the chord.

The hardware and software stack includes Raspberry Pi, an MPU-6050 accelerometer and gyroscope, Python, SuperCollider, an audio interface, an amplifier, and a surface transducer.

<!-- chapter:process -->

[Explore the installed unit's physical details](#media-installed-swing-detail) and [watch the installation excerpt](#media-installation-film).

<!-- chapter:credits -->

## Public context and credits

Created in 2020 by Amir Rostami and Elahe Rostami, the work was part of the Remote Realities Themed Commission. Trinity Square Video and Dames Making Games co-presented the commission, with support from EQ Bank. Remote Realities names the program; the artwork is Ephemeral Pulses of a Finite Scroll.
