export interface DesignConcept {
  readonly slug: string;
  readonly name: string;
  readonly shortName: string;
  readonly referenceUrl: string;
  readonly description: string;
  readonly palette: string;
  readonly font: string;
  readonly hero: string;
  readonly motion: string;
}

export const DESIGN_CONCEPTS = [
  {
    slug: 'poster-index',
    name: 'Poster Index',
    shortName: 'Index',
    referenceUrl: 'https://dougalves.com/',
    description: 'A warm editorial index of work, music, and making.',
    palette: 'warm espresso, bone, graphite, one muted mint signal',
    font: 'Space Grotesk Variable',
    hero: 'artistic asymmetry with monumental type and one project image entering from the lower-right edge',
    motion: 'pinned work heading plus image scale/fade as project plates enter and leave',
  },
  {
    slug: 'type-image-collision',
    name: 'Type/Image Collision',
    shortName: 'Collision',
    referenceUrl: 'https://elvinaprasad.com/',
    description: 'An editorial split where oversized type and imagery deliberately collide.',
    palette: 'black, white, smoke gray; no chromatic accent',
    font: 'Archivo Variable',
    hero: 'editorial split whose project imagery passes between layers of oversized type',
    motion: 'sequential text reveal plus image scale/fade',
  },
  {
    slug: 'darkroom-cinema',
    name: 'Darkroom Cinema',
    shortName: 'Darkroom',
    referenceUrl: 'https://opx.studio/',
    description: 'A cinematic darkroom built around immersive project chapters.',
    palette: 'near-black, warm white, graphite',
    font: 'Geist Variable',
    hero: 'cinematic center over a full-bleed Luminous Trails image with a dark wash',
    motion: 'scroll pinning and image scale/fade with reduced-motion static fallbacks',
  },
  {
    slug: 'printed-signal-lab',
    name: 'Printed Signal Lab',
    shortName: 'Signal Lab',
    referenceUrl: 'https://off-brand.com/',
    description: 'A printed technical sheet where signals, annotations, and projects share one field.',
    palette: 'parchment, carbon, oxide red',
    font: 'Outfit Variable',
    hero: 'editorial split with a flat CSS/SVG moiré signal instrument; no sphere, blur, or glossy gradient',
    motion: 'scrubbed text reveal and card stacking',
  },
  {
    slug: 'coral-broadcast',
    name: 'Coral Broadcast',
    shortName: 'Broadcast',
    referenceUrl: 'https://channelstudio.co/',
    description: 'A sharp broadcast transmission with coral as its concentrated signal.',
    palette: 'black, soft bone, concentrated coral',
    font: 'Archivo Variable',
    hero: 'artistic asymmetry with a narrow vertical project frame and oversized broadcast-style statement',
    motion: 'pinned section changes plus card stacking',
  },
  {
    slug: 'clau-poster-wall',
    name: 'Clau Poster Wall',
    shortName: 'Poster Wall',
    referenceUrl: 'https://clau.as.kee/',
    description: 'A flat periwinkle poster wall for monumental type and image apertures.',
    palette: 'flat periwinkle, black, and one signal green',
    font: 'Space Grotesk Variable',
    hero: 'cinematic center presented as a single poster-like typographic composition',
    motion: 'scrubbed text reveal and image scale/fade',
  },
] as const satisfies readonly DesignConcept[];

export function designConceptBySlug(slug: string): DesignConcept | undefined {
  return DESIGN_CONCEPTS.find((concept) => concept.slug === slug);
}
