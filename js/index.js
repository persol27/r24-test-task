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
            $( this.selector ).on('input propertychange', '.position__input', e => {
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
            // Window Resize
            $( window ).resize(() => {
                //this.coords_reset();
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

            $( this.selector ).draggable({
                containment: "parent",
                drag: (event, ui) => {
                    position.set('x', ui.position.left);
                    position.set('y', ui.position.top);
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

        customSelect() {
            $.widget( "custom.iconselectmenu", $.ui.selectmenu, {
                _renderItem: (ul, item) => {
                    console.log(item);
                    let li = $( "<li>" ),
                        wrapper = $( "<div>" ),
                        text = $( "<span>", { text: item.label, "class": "ui-text" } ).prependTo(wrapper)

                    if ( item.disabled ) {
                        li.addClass( "ui-state-disabled" );
                    }

                    $( "<span>", {
                        style: `background-image: url(${item.value})`,
                        "class": "ui-icon image-preview"
                    }).prependTo( wrapper );

                    return li.append( wrapper ).appendTo( ul );
                }
              });
        },
        init() {
            this.customSelect();
            
            for (let $i = 0; $i < this.options.length; $i++) {
                let class_list = 'material-select__item material-option';
                //class_list = $i == 0 ? `${class_list} selected` : class_list;
                $( this.selector ).append(`<option class="${class_list}" value="${this.options[$i].src}">${this.options[$i].name}</option>`)
            }
            $( this.selector ).iconselectmenu({
                position: { my : "center bottom", at: "center top" },
                change: (event, data) => {
                    $( image.selector ).hide( 'fade', {}, 200 );
                    setTimeout(() => image.set_src(data.item.value), 250)
                    $( image.selector ).show( 'fade', {}, 400 );
                }
            }).iconselectmenu( "menuWidget").addClass( "ui-menu-icons avatar" );
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