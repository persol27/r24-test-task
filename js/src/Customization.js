const position = {
    coords: {x: 0, y: 0},
    min: {x: 0, y: 0},
    max: {x: 0, y: 0},
    selector: '.position_target',

    set(coord, value, type) {
        let val = Number(value);

        if (coord == 'x') {
            if (val > this.max['x']) {
                val = this.max['x'];
            } else if (val < this.min['x']) {
                val = this.min['x'];
            }

            if (type == 'input') {
                $( this.selector ).find(`.position__input[name=position_${coord}]`).val(Math.round(val));
            }
        } else if (coord == 'y') {
            val = type !== 'resize' ? image.get_sizes().h - val - circle.height : val;

            if (val > this.max['y']) {
                val = this.max['y'];
                $( this.selector ).find(`.position__input[name=position_${coord}]`).val(this.min['y']);
            } else if (val < this.min['y']) {
                val = this.min['y'];
                $( this.selector ).find(`.position__input[name=position_${coord}]`).val(this.max['y']);
            }
        }

        this.coords[coord] = Math.round(val);

        if (type !== 'event') {
            circle.draggable.set(this.coords.x, this.coords.y); // upd inputs
        }
        if (type !== 'input') {
            $( this.selector ).find(`.position__input[name=position_${coord}]`).val(this.coords[coord]);
        }
        
    },
    events() {
        // Input Value Changed
        $( this.selector ).on('input propertychange', '.position__input', e => {
            let target = $(e.target),
                type = target.attr('name').split('_'), // array: [position, x], [position, y]
                val = target.val();

            this.set(type[1], val, 'input');
        });

        $( window ).resize(() => {
            let max = this.max,
                coords = this.coords;

            setTimeout( () => {
                this.set_max();
                circle.resize();

                let cof_x = Math.round(coords.x / (max.x / 100)),
                    cof_y = Math.round(coords.y / (max.y / 100));

                    console.log(this.max.y)
                let new_x = Math.round(this.max.x / 100 * cof_x),
                    new_y = Math.round(this.max.y / 100 * cof_y);

                circle.draggable.set(new_x, image.get_sizes().h - new_y - circle.height);
                $( this.selector ).find(`.position__input[name=position_x]`).val(new_x);
                $( this.selector ).find(`.position__input[name=position_y]`).val(new_y);
            }, 25);
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
            $('.select2-menu-dropdown')
                .css('opacity', 0)
                .animate({opacity: 1}, 275);
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

        $( this.selector ).select2({
            selectionCssClass: 'select2-menu',
            dropdownCssClass: 'select2-menu-dropdown',
            width: 250,
            minimumResultsForSearch: Infinity,
            templateResult: this.templateSelect,
            templateSelection: this.templateSelect
        });

        this.eventsSelect(); // Select2 events init
    }
};