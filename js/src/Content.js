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
                    position.set('y', image.get_sizes().h - y - this.height, 'event');
                }
            };

        this.draggable = new Draggable (element, options);
    }
}, image = {
    src: '',
    position: '',
    selector: '.slide-image',

    set_src(src, animate) { // animate - bool
        if (animate) {
            $( this.selector ).animate({opacity: 0}, 250);
            setTimeout( () => $( this.selector ).attr('src', src), 300);
            setTimeout( () => $( this.selector ).animate({opacity: 1}, 250), 400);
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