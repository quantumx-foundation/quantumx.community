export type Gif = {
  /** File in public/images/gifs, e.g. "/images/gifs/demo-night.gif". */
  src: string;
  alt: string;
  caption: string;
};

/**
 * GIFs shown after the pixel loops in the homepage's "Quantum, but funny"
 * section. Use our own clips (event moments, memes we made) so there is no
 * question over who owns them.
 */
export const gifs: Gif[] = [];
