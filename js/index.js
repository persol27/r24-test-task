"use strict";

window.addEventListener('load', () => {
  const el = document.querySelector('.main');
  el.classList.remove("main_no-load");
  
  if(/iP(hone|ad)/.test(window.navigator.userAgent)) {
    document.body.addEventListener('touchstart', () => {}, false);
  }
});

jQuery(document).ready($ => {
    //=include src/Content.js
    //=include src/Customization.js


    // Script Init
    let objects_arr = [position, materials, image, circle];
    const init = objects => objects.forEach(el => el.init());

    init(objects_arr);
});