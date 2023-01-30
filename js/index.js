"use strict";

import {position, materials} from "./Customization.js";
import {circle, image} from "./Content.js";

window.addEventListener('load', () => {
  const el = document.querySelector('.main');
  el.classList.remove("main_no-load");
});

jQuery(document).ready($ => {

    // Script Init
    let objects_arr = [image, position, circle, materials];
    const init = objects => objects.forEach(el => el.init());

    init(objects_arr);
});