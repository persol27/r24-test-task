"use strict";window.addEventListener("load",()=>{document.querySelector(".main").classList.remove("main_no-load")}),jQuery(document).ready(t=>{const e={width:48,height:48,position:"",selector:".circle_target",set_sizes(){let t=document.querySelector(this.selector);this.width=t.offsetWidth,this.height=t.offsetHeight},init(){this.position=i.coords,this.set_sizes(),setTimeout(()=>{let t=document.querySelector(".content__block").getBoundingClientRect(),e=document.querySelector(this.selector),s={limit:{x:[0,t.width-this.width],y:[0,t.height-this.height]},onDrag:(t,e,s)=>{i.set("x",e),i.set("y",s)}};console.log(t.x-this.width,t,t.x,this.width),this.draggable=new Draggable(e,s)},250)}},s={src:"",position:"",selector:".slide-image",set_src(e){t(this.selector).attr("src",e)},get_sizes(){let t=document.querySelector(this.selector);return{w:t.offsetWidth,h:t.offsetHeight}},init(){this.src=o.default_src,this.position=i.coords,this.set_src(this.src)}},i={coords:{x:0,y:0},min:{x:0,y:0},max:{x:0,y:0},selector:".position_target",coords_reset(){const s=[{coord:"x",value:0,css_attr:"left"},{coord:"y",value:0,css_attr:"top"}];for(let i=0;i<s.length;i++){let o=s[i];this.coords[o.coord]=o.value,t(e.selector).css(o.css_attr,"unset"),t(this.selector).find(`.position__input[name=position_${o.coord}]`).val("")}},set(i,o){let a=o;"y"==i&&(a=s.get_sizes().h-o-e.height),this.coords[i]=Math.round(a),t(this.selector).find(`.position__input[name=position_${i}]`).val(this.coords[i])},events(){t(this.selector).on("input propertychange change",".position__input",i=>{let o=t(i.target),a=o.attr("name").split("_"),r=o.val();if("x"==a[1]){r>this.max.x?r=this.max.x:r<this.min.x&&(r=this.min.x);let s=Math.round(r);t(e.selector).css("left",s)}else if("y"==a[1]){r>this.max.y?r=this.max.y:r<this.min.y&&(r=this.min.y);let i=Math.ceil(s.get_sizes().h-r-e.height);t(e.selector).css("top",i)}o.val(r),this.coords[a[1]]=r})},init(){setTimeout(()=>{this.max={x:Math.ceil(s.get_sizes().w-e.width),y:Math.ceil(s.get_sizes().h-e.height)},t(this.selector).find(".position__input[name=position_x]").attr("max",this.max.x).attr("min",this.min.x),t(this.selector).find(".position__input[name=position_y]").attr("max",this.max.y).attr("min",this.min.y),this.events()},50)}},o={options:[{name:"Material 1",src:"images/material/1.jpg",thumb_src:"images/material_thumb/1_32x32.jpg"},{name:"Material 2",src:"images/material/2.jpg",thumb_src:"images/material_thumb/2_32x32.jpg"},{name:"Material 3",src:"images/material/3.jpg",thumb_src:"images/material_thumb/3_32x32.jpg"},{name:"Material 4",src:"images/material/4.jpg",thumb_src:"images/material_thumb/4_32x32.jpg"},{name:"Material 5",src:"images/material/5.jpg",thumb_src:"images/material_thumb/5_32x32.jpg"}],default_src:"",position:"",selector:".material-select",templateSelect:e=>e.id?t('<img src="'+e.element.getAttribute("data-thumb")+'" class="img-thumb" > <span>'+e.text+"</span>"):e.text,eventsSelect(){t(this.selector).on("select2:open",t=>{}).on("select2:select",e=>{t(s.selector).animate({opacity:0},250),setTimeout(()=>s.set_src(e.params.data.id),225),t(s.selector).animate({opacity:1},400)})},init(){this.default_src=this.options[0].src,this.position=i.coords;for(let e=0;e<this.options.length;e++){let s="material-select__item material-option";t(this.selector).append(`<option class="${s}" value="${this.options[e].src}" data-thumb="${this.options[e].thumb_src}">${this.options[e].name}</option>`)}const e=this.templateSelect;t(this.selector).select2({selectionCssClass:"select2-menu",dropdownCssClass:"select2-menu-dropdown",width:250,minimumResultsForSearch:1/0,templateResult:e,templateSelection:e}),this.eventsSelect()}};(t=>t.forEach(t=>t.init()))([i,o,s,e])});