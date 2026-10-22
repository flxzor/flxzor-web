const REVEAL_EVENT = "pageLoaderRevealStart";
const IMAGE_WAIT_TIMEOUT_MS = 15_000;

function waitForImageLoad(image: HTMLImageElement) {
  return new Promise<void>((resolve) => {
    const timeout = window.setTimeout(settle, IMAGE_WAIT_TIMEOUT_MS);

    function settle() {
      window.clearTimeout(timeout);
      image.removeEventListener("load", settle);
      image.removeEventListener("error", settle);
      resolve();
    }

    image.addEventListener("load", settle, { once: true });
    image.addEventListener("error", settle, { once: true });
    if (image.complete) settle();
  });
}

function waitForImageDecode(image: HTMLImageElement) {
  return new Promise<void>((resolve) => {
    const timeout = window.setTimeout(settle, IMAGE_WAIT_TIMEOUT_MS);

    function settle() {
      window.clearTimeout(timeout);
      resolve();
    }

    Promise.resolve().then(() => image.decode()).then(settle, settle);
  });
}

export async function waitForBlogImages() {
  const articleCover = document.querySelector<HTMLImageElement>(".article-page .article-cover img");
  const images = articleCover
    ? [articleCover]
    : Array.from(document.querySelectorAll<HTMLImageElement>(".blog-page img"));

  await Promise.all(images.map(async (image) => {
    // Article body images stay lazy; only the visible cover blocks the initial reveal.
    // In the gallery, start downloading its rendered covers while the loader is up.
    image.loading = "eager";

    if (!image.complete) {
      await waitForImageLoad(image);
    }

    // `load` means the bytes arrived; `decode` also ensures the image is ready to paint.
    try {
      await waitForImageDecode(image);
    } catch {
      // A failed image should not keep the page loader on screen forever.
    }
  }));
}

export function afterPageLoader(callback: () => void) {
  let preloaderWasShown = false;
  try {
    preloaderWasShown = Boolean(sessionStorage.getItem("preloader_shown"));
  } catch {
    callback();
    return () => {};
  }

  const preloader = document.querySelector<HTMLElement>("[data-page-preloader]");
  const pageLoader = document.querySelector<HTMLElement>("[data-page-transition-loader]");
  const preloaderActive = preloaderWasShown
    ? preloader?.dataset.active === "true"
    : !preloader || preloader.dataset.active === "true";
  const transitionActive = pageLoader?.dataset.active === "true";

  if (!preloaderActive && !transitionActive) {
    callback();
    return () => {};
  }

  const handleComplete = () => {
    window.removeEventListener(REVEAL_EVENT, handleComplete);
    callback();
  };
  window.addEventListener(REVEAL_EVENT, handleComplete, { once: true });
  return () => window.removeEventListener(REVEAL_EVENT, handleComplete);
}
