"use strict";

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
            let set_value,
                image_sizes = image.get_sizes(), // returned obj(w: width, h: height)
                width = Math.ceil(image_sizes.w/2), // 50% from width (h/2)
                height = Math.ceil(image_sizes.h/2); // 50% from height (w/2)

            if (coord == 'x') {
                set_value = value - width;
            } else if (coord == 'y') {
                set_value = height - value;
            }
            set_value = Math.ceil(set_value);

            this.coords[coord] = set_value;
            $( this.selector ).find(`.position__input[name=position_${coord}]`).val(set_value); // upd inputs
        },
        events() {
            // Input Value Changed
            $( this.selector ).on('input propertychange', '.position__input', e => {
                let target = $(e.target),
                    type = target.attr('name').split('_'), // [position, x], [position, y]
                    val = target.val(),
                    image_sizes = image.get_sizes(), // returned obj(w: width, h: height)
                    width = Math.ceil(image_sizes.w/2), // 50% from width (h/2)
                    height = Math.ceil(image_sizes.h/2); // 50% from height (w/2)

                console.log(this.max, this.min);
                console.log(circle.width/2);

                if (type[1] == 'x') {
                    if (val > this.max['x']) {
                        val = this.max['x'];
                    } else if (val < this.min['x']) {
                        val = this.min['x'];
                    }

                    let result = width + Math.ceil(val - circle.width/2);
                    $( circle.selector ).css('left', result);
                } else if (type[1] == 'y') {
                    if (val > this.max['y']) {
                        val = this.max['y'];
                    } else if (val < this.min['y']) {
                        val = this.min['y'];
                    }

                    let result = Math.ceil(height - circle.height/2) - val;
                    $( circle.selector ).css('top', result);
                }

                target.val(val);
                this.coords[type[1]] = val;
            });
            // Window Resize
            $( window ).resize(() => {
                //this.coords_reset();
            });
        },
        init() {
            let image_sizes = image.get_sizes();
            console.log(circle.width/2);
            this.min = {x: -Math.ceil(image_sizes.w/2 - circle.width/2), y: -Math.ceil(image_sizes.h/2 - circle.height/2)};
            this.max = {x: Math.ceil(image_sizes.w/2 - circle.width/2), y: Math.ceil(image_sizes.h/2 - circle.height/2)};

            $( this.selector ).find('.position__input[name=position_x]').attr('max', this.max['x']).attr('min', this.min['x']); //.val(this.coords.x);
            $( this.selector ).find('.position__input[name=position_y]').attr('max', this.max['y']).attr('min', this.min['y']); //.val(this.coords.y);

            this.events(); // events init
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

            $( this.selector ).draggable({
                containment: "parent",
                stop: (event, ui) => {
                    position.set('x', Math.ceil(ui.position.left + this.width/2));
                    position.set('y', Math.ceil(ui.position.top + this.height/2));
                }
            });
        }
    }, customization = {
        options: [
            {name: 'Material 1', src: 'images/1.jpg'},
            {name: 'Material 2', src: 'images/2.jpg'},
            {name: 'Material 3', src: 'images/3.jpg'},
            {name: 'Material 4', src: 'images/4.jpg'},
            {name: 'Material 5', src: 'images/5.jpg'}
        ],
        default_src: 'images/1.jpg', //this.options[0].src,
        position: position.coords,
        selector: '.material-select',

        init() {
            for (let $i = 0; $i < this.options.length; $i++) {
                let class_list = 'material-select__item material-option';
                //class_list = $i == 0 ? `${class_list} selected` : class_list;
                $( this.selector ).append(`<option class="${class_list}" value="${this.options[$i].src}">${this.options[$i].name}</option>`)
            }
            $( this.selector ).selectmenu({
                change: (event, data) => image.set_src(data.item.value)
            });
        }
    }, image = {
        src: customization.default_src,
        position: position.coords,
        selector: '.slide-image',

        set_src(src) {
            $( this.selector ).attr('src', src);
        },
        get_sizes() {
            let selector = $( this.selector ),
                width = selector.width(),
                height = selector.height();

            return {w: width, h: height};
        },
        init() {
            this.set_src(this.src);
        }
    };

    // Script Init
    let objects_arr = [position, circle, customization, image];
    const init = objects => objects.forEach(el => el.init());

    init(objects_arr);
});