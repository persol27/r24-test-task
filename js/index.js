"use strict";

jQuery(document).ready($ => {
    const position = {
        coords: {x: 0, y: 0},
        selector: '.position_target',
        min: {x: 0, y: 0},
        max: {x: 0, y: 0},
        
        update_sizes() {

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
            /*$( this.selector ).on('input propertychange', '.position__input', e => {
                let target = $(e.target),
                    type = target.attr('name').split('_'), // [position, x], [position, y]
                    val = target.val(),
                    image_sizes = image.get_sizes(); // returned obj(w: width, h: height)

                if (type[1] == 'x') {
                    if (target.val() > this.max['x']) {
                        val = this.max['x'];
                    } else if (target.val() > +this.min['x']) {
                        val = this.min['x'];
                    }

                    $( circle.selector ).css('left', image_sizes.w/2 - val - circle.width/2);
                } else if (type[1] == 'y') {
                    if (target.val() > this.max['y']) {
                        target.val(this.max['y']);
                        return;
                    } else if (target.val() < this.min['y']) {
                        target.val(this.min['y']);
                        return;
                    }

                    $( circle.selector ).css('top', val + image_sizes.h/2 - circle.height/2)
                }

                target.val(val);
                this.coords[type[1]] = val;
            });*/
            //
        },
        init() {
            let image_sizes = image.get_sizes();
            this.min = {x: -Math.ceil(image_sizes.w/2 - circle.width/2), y: -Math.ceil(image_sizes.h/2 - circle.height/2)};
            this.max = {x: Math.ceil(image_sizes.w/2 - circle.width/2), y: Math.ceil(image_sizes.h/2 - circle.height/2)};

            $( this.selector ).find('.position__input[name=position_x]').attr('max', this.max['x']).attr('min', this.min['x']); //.val(this.coords.x);
            $( this.selector ).find('.position__input[name=position_y]').attr('max', this.max['y']).attr('min', this.min['y']); //.val(this.coords.y);

            this.events(); // events init
        }
    }, circle = {
        width: 42, //px
        height: 42, //px
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