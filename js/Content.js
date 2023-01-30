export const circle = {
    width: 48, //px
    height: 48, //px
    position: '',
    selector: '.circle_target',
    
    set_sizes() {
        let selector = document.querySelector( this.selector );
        this.width = selector.offsetWidth;
        this.height = selector.offsetHeight;
    },
    init() {
        this.set_sizes(); // init width&height
        this.position = position.coords;

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

        this.draggable = new Draggable (element, options);
    }
}, image = {
    src: '',
    position: '',
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
        this.src = materials.default_src;
        this.position = position.coords;
    }
};