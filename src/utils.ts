export function makeImagePath(path: string, size?: string) {
    return `https://image.tmdb.org/t/p/${size ? size : "original"}/${path}`;
  }
  