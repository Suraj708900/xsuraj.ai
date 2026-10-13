/* Progressive enhancement for the user-supplied hero image.
   The semantic, live-text hero remains visible until the real local asset loads.
   If the image has not been uploaded yet, or fails, visitors still see the complete site. */
(() => {
  "use strict";
  const hero = document.getElementById("top");
  const poster = document.getElementById("hero-poster");
  const image = document.getElementById("hero-poster-image");
  if (!hero || !poster || !image) return;
  function showPoster() {
    if (!image.naturalWidth || !image.naturalHeight) return;
    poster.hidden = false;
    hero.classList.add("hero-poster-loaded");
  }
  image.addEventListener("load", showPoster, { once: true });
  image.addEventListener("error", () => {
    poster.hidden = true;
    hero.classList.remove("hero-poster-loaded");
  }, { once: true });
  if (image.complete) showPoster();
})();