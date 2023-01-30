"use strict";

window.addEventListener('load', () => {
  const el = document.querySelector('.main');
  el.classList.remove("main_no-load");
});

jQuery(document).ready($ => {
    const circle = {
        width: 48, //px
        height: 48, //px
        position: '',
        selector: '.circle_target',
        
        set_sizes() {
            let selector = document.querySelector( this.selector );
            this.width = selector.offsetWidth;
            this.height = selector.offsetHeight;
        },
        resize() {
            this.draggable.options.limit.x = [0, image.get_sizes().w - this.width];
            this.draggable.options.limit.y = [0, image.get_sizes().h - this.height];
        },
        init() {
            this.position = position.coords;
            this.set_sizes(); // init width&height
            
            let element = document.querySelector( this.selector ),
                options = {
                    limit: {
                        x: [0, image.get_sizes().w - this.width],
                        y: [0, image.get_sizes().h - this.height]
                    },
                    onDrag: (element, x, y) => {
                        position.set('x', x, 'event');
                        position.set('y', y, 'event');
                    }
                };
    
            this.draggable = new Draggable (element, options);
            console.log(this.draggable);
        }
    }, image = {
        src: '',
        position: '',
        selector: '.slide-image',
    
        set_src(src, animate) { // animate - bool
            if (animate) {
                $( this.selector ).animate({opacity: 0}, 225);
                setTimeout(() => {
                    
                    $( this.selector ).attr('src', src);
                    $( this.selector ).animate({opacity: 1}, 300);
                }, 300);
            } else {
                $( this.selector ).attr('src', src)
            }
        },
        get_sizes() {
            let selector = document.querySelector( this.selector ),
                width = selector.offsetWidth,
                height = selector.offsetHeight;
    
            return {w: width, h: height};
        },
        init() {
            this.src = materials.default_src;
            this.position = position.coords;
    
            this.set_src(this.src, false);
        }
    };
    const position = {
        coords: {x: 0, y: 0},
        min: {x: 0, y: 0},
        max: {x: 0, y: 0},
        selector: '.position_target',
        
        coords_reset() {
            const arr = [
                {coord: 'x', value: 0, css_attr: 'left'},
                {coord: 'y', value: 0, css_attr: 'top'}
            ];
    
            for (let $i = 0; $i < arr.length; $i++) {
                let item = arr[$i];
                this.coords[item.coord] = item.value;
                $( circle.selector ).css(item.css_attr, 'unset');
                $( this.selector ).find(`.position__input[name=position_${item.coord}]`).val('');
            }
        },
        set(coord, value, type) {
            let val = value;
    
            if (coord == 'x') {
                val = val;
    
                if (val > this.max['x']) {
                    val = this.max['x'];
                } else if (val < this.min['x']) {
                    val = this.min['x'];
                }
            } else if (coord == 'y') {
                val = Math.round(image.get_sizes().h - val - circle.height);
    
                if (val > this.max['y']) {
                    val = image.get_sizes().h + this.max['y'] + circle.height;
                } else if (val < this.min['y']) {
                    val = image.get_sizes().h + this.min['y'] + circle.height;
                }
            }
    
            this.coords[coord] = Math.round(val);
    
            if (type !== 'event') {
                console.log(this.coords);
                circle.draggable.set(this.coords.x, this.coords.y); // upd inputs
            }
    
            if (type == 'event' || type == 'resize') {
                $( this.selector ).find(`.position__input[name=position_${coord}]`).val(this.coords[coord]);
            }
        },
        events() {
            // Input regex
    
            // Input Value Changed
            $( this.selector ).on('input propertychange change', '.position__input', e => {
                let target = $(e.target),
                    type = target.attr('name').split('_'), // array: [position, x], [position, y]
                    val = target.val();
    
                this.set(type[1], val, 'input');
            });
    
            $( window ).resize(() => {
                circle.resize();
                this.set_max();
    
                setTimeout(() => {
                    let x = $( this.selector ).find('.position__input[name=position_x]'),
                        y = $( this.selector ).find('.position__input[name=position_y]');
    
                    this.set('x', x.val(), 'resize');
                    this.set('y', y.val(), 'resize');
                }, 75);
            });
        },
        set_max() {
            let x = $( this.selector ).find('.position__input[name=position_x]'),
                y = $( this.selector ).find('.position__input[name=position_y]');
                
            this.max = {
                x: Math.ceil(image.get_sizes().w - circle.width),
                y: Math.ceil(image.get_sizes().h - circle.height)
            };
    
            x.attr('max', this.max['x']).attr('min', this.min['x']); //.val(this.coords.x);
            y.attr('max', this.max['y']).attr('min', this.min['y']); //.val(this.coords.y);
        },
        init() {
            setTimeout(()=> {
                this.set_max(); // min max init
                this.events(); // events init
            },  50)
        }
    },
    materials = {
        options: [
            {name: 'Material 1', src: 'images/material/1.jpg', thumb_src: 'images/material_thumb/1_32x32.jpg'},
            {name: 'Material 2', src: 'images/material/2.jpg', thumb_src: 'images/material_thumb/2_32x32.jpg'},
            {name: 'Material 3', src: 'images/material/3.jpg', thumb_src: 'images/material_thumb/3_32x32.jpg'},
            {name: 'Material 4', src: 'images/material/4.jpg', thumb_src: 'images/material_thumb/4_32x32.jpg'},
            {name: 'Material 5', src: 'images/material/5.jpg', thumb_src: 'images/material_thumb/5_32x32.jpg'}
        ],
        default_src: '',
        position: '',
        selector: '.material-select',
    
        templateSelect(state) {
              if (!state.id) {
                return state.text;
              }
    
              var $state = $(
                '<img src="' + state.element.getAttribute('data-thumb') + '" class="img-thumb" > <span>' + state.text + '</span>'
              );
              return $state;
        },
        eventsSelect() {
            $( this.selector ).on('select2:open', e => {
                
            }).on('select2:select', e => image.set_src(e.params.data.id, true));
        },
        init() {
            this.default_src = this.options[0].src;
            this.position = position.coords;
    
            for (let $i = 0; $i < this.options.length; $i++) {
                let class_list = 'material-select__item material-option';
                $( this.selector )
                    .append(`<option class="${class_list}" value="${this.options[$i].src}" data-thumb="${this.options[$i].thumb_src}">${this.options[$i].name}</option>`);
            }
    
            const templateSelect = this.templateSelect
    
            $( this.selector ).select2({
                selectionCssClass: 'select2-menu',
                dropdownCssClass: 'select2-menu-dropdown',
                width: 250,
                minimumResultsForSearch: Infinity,
                templateResult: templateSelect,
                templateSelection: templateSelect
            });
    
            this.eventsSelect(); // Select2 events init
    
            /*$( this.selector ).iconselectmenu({
                position: { my : "center bottom", at: "center top" },
                create: (event, data) => {
                    $( '.ui-selectmenu-menu' ).css('opacity', 0);
                },
                change: (event, data) => {
                    console.log(data);
                    $( image.selector ).hide( 'fade', {}, 200 );
                    setTimeout(() => image.set_src(data.item.value), 250)
                    $( image.selector ).show( 'fade', {}, 400 );
                },
                close: (event, data) => {
                    $('.ui-selectmenu-menu')
                        .addClass('ui-selectmenu-open')
                        .css('pointer-events', 'none')
                        .animate({opacity: 0}, 275);
                    setTimeout(() => $('.ui-selectmenu-menu').removeClass('ui-selectmenu-open').css('pointer-events', 'all'), 225);
                },
                open: (event, data) => {
                    $('.ui-selectmenu-menu').animate({opacity: 1}, 375);
                }
            }).iconselectmenu( "menuWidget").addClass( "ui-menu-icons avatar" );*/
    
        }
    };


    // Script Init
    let objects_arr = [position, materials, image, circle];
    const init = objects => objects.forEach(el => el.init());

    init(objects_arr);
});