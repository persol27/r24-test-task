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
                width = image_sizes.w,
                height = image_sizes.h;

            if (coord == 'x') {
                set_value = value - width/2;
            } else if (coord == 'y') {
                set_value = height/2 - value;
            }

            this.coords[coord] = set_value;

            $( this.selector ).find(`.position__input[name=position_${coord}]`).val(set_value); // upd inputs
        },
        events() {
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
        },
        init() {
            let image_sizes = image.get_sizes();
            this.min = {x: -(image_sizes.w/2 - circle.width/2), y: -(image_sizes.h/2 - circle.height/2)};
            this.max = {x: image_sizes.w/2 - circle.width/2, y: image_sizes.h/2 - circle.height/2};

            $( this.selector ).find('.position__input[name=position_x]').attr('max', this.max['x']).attr('min', this.min['x']); //.val(this.coords.x);
            $( this.selector ).find('.position__input[name=position_y]').attr('max', this.max['y']).attr('min', this.min['y']); //.val(this.coords.y);

            this.events(); // events init
        }
    }, circle = {
        width: 48, //px
        height: 48, //px
        position: position.coords,
        selector: '.circle_target',

        init() {
            $( this.selector ).draggable({
                containment: "parent",
                stop: (event, ui) => {
                    console.log(ui.position);
                    position.set('x', ui.position.left + this.height/2);
                    position.set('y', ui.position.top + this.width/2);
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