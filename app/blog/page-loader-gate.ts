const REVEAL_EVENT = "pageLoaderRevealStart";

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
