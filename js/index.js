"use strict";


window.addEventListener('load', () => {
  const el = document.querySelector('.main');
  el.classList.remove("main_no-load");
});

jQuery(document).ready($ => {
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
        set(coord, value) {
            let value_new = value;

            if (coord == 'y') {
                // image.get_sizes() returned obj(w: width, h: height)
                value_new = image.get_sizes().h - value - circle.height;
            }

            this.coords[coord] = Math.round(value_new);
            $( this.selector ).find(`.position__input[name=position_${coord}]`).val(this.coords[coord]); // upd inputs
        },
        events() {
            // Input Value Changed
            $( this.selector ).on('input propertychange change', '.position__input', e => {
                let target = $(e.target),
                    type = target.attr('name').split('_'), // array: [position, x], [position, y]
                    val = target.val();

                if (type[1] == 'x') {
                    if (val > this.max['x']) {
                        val = this.max['x'];
                    } else if (val < this.min['x']) {
                        val = this.min['x'];
                    }

                    let result = Math.round(val);
                    $( circle.selector ).css('left', result);
                } else if (type[1] == 'y') {
                    if (val > this.max['y']) {
                        val = this.max['y'];
                    } else if (val < this.min['y']) {
                        val = this.min['y'];
                    }

                    let result = Math.ceil(image.get_sizes().h - val - circle.height);
                    $( circle.selector ).css('top', result);
                }

                target.val(val);
                this.coords[type[1]] = val;
            });
        },
        init() {
            setTimeout(()=> {
                this.max = {x: Math.ceil(image.get_sizes().w - circle.width), y: Math.ceil(image.get_sizes().h - circle.height)};

                $( this.selector ).find('.position__input[name=position_x]').attr('max', this.max['x']).attr('min', this.min['x']); //.val(this.coords.x);
                $( this.selector ).find('.position__input[name=position_y]').attr('max', this.max['y']).attr('min', this.min['y']); //.val(this.coords.y);

                this.events(); // events init
            },  50)
        }
    }, circle = {
        width: 48, //px
        height: 48, //px
        position: position.coords,
        selector: '.circle_target',
        
        set_sizes() {
            let selector = document.querySelector( this.selector );
            this.width = selector.offsetWidth;
            this.height = selector.offsetHeight;
        },
        init() {
            this.set_sizes(); // init width&height

            let container = document.querySelector( '.content__block' ),
                container_rect = container.getBoundingClientRect(),
                element = document.querySelector( this.selector ),
                options = {
                    limit: {
                        x: [0, container_rect.x - this.width],
                        y: [0, container_rect.height - this.height]
                    },
                    onDrag: (element, x, y) => {
                        position.set('x', x);
                        position.set('y', y);
                    }
                };
                console.log(container_rect);

            this.draggable = new Draggable (element, options);
        }
    }, customization = {
        options: [
            {name: 'Material 1', src: 'images/material/1.jpg', thumb_src: 'images/material_thumb/1_32x32.jpg'},
            {name: 'Material 2', src: 'images/material/2.jpg', thumb_src: 'images/material_thumb/2_32x32.jpg'},
            {name: 'Material 3', src: 'images/material/3.jpg', thumb_src: 'images/material_thumb/3_32x32.jpg'},
            {name: 'Material 4', src: 'images/material/4.jpg', thumb_src: 'images/material_thumb/4_32x32.jpg'},
            {name: 'Material 5', src: 'images/material/5.jpg', thumb_src: 'images/material_thumb/5_32x32.jpg'}
        ],
        default_src: 'images/material/1.jpg', //this.options[0].src,
        position: position.coords,
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
                
            }).on('select2:select', e => {
                console.log(e.params.data);
                $( image.selector ).animate({opacity: 0}, 250);
                setTimeout(() => image.set_src(e.params.data.id), 225)
                $( image.selector ).animate({opacity: 1}, 400);
            });
        },
        init() {
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
    }, image = {
        src: customization.default_src,
        position: position.coords,
        selector: '.slide-image',

        set_src(src) {
            $( this.selector ).attr('src', src);
        },
        get_sizes() {
            let selector = document.querySelector( this.selector ),
                width = selector.offsetWidth,
                height = selector.offsetHeight;

            return {w: width, h: height};
        },
        init() {
            this.set_src(this.src);
        }
    };

    // Script Init
    let objects_arr = [image, position, circle, customization];
    const init = objects => objects.forEach(el => el.init());

    init(objects_arr);
});