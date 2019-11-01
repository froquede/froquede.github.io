class Fitter {
    constructor(options) {
        this.options = Object.assign(this.defaultOptions, options);
        this.fit();
    }

    get defaultOptions() {
        return {
            element: '[data-fitter]',
            min: 12,
            max: 64
        }
    }

    fit() {
        let el;

        if (this.options.shadowRoot) {
            el = typeof this.options.element === 'string' ? this.options.shadowRoot.querySelector(this.options.element) : this.options.element;
        }
        else {
            el = typeof this.options.element === 'string' ? window.document.querySelector(this.options.element) : this.options.element;
        }

        let style = window.getComputedStyle(el, null);
        let fontSize = style.getPropertyValue('font-size');
        let fontWeight = style.getPropertyValue('font-weight');
        let fontFamily = style.getPropertyValue('font-family');
        let textSize = this.getTextWidth(el.innerText, `${fontWeight} ${fontSize} ${fontFamily}`);

        el.style.overflow = 'hidden';
        el.style['text-overflow'] = 'ellipsis';
        el.style['white-space'] = 'nowrap';

        if (textSize < el.clientWidth) {
            for (let c = parseFloat(fontSize); c < this.options.max; c++) {
                let r = this.getTextWidth(el.innerText, `${fontWeight} ${c}px ${fontFamily}`);
                if (r > el.clientWidth) {
                    el.style.fontSize = `${c - 1 > this.options.max ? this.options.max : c - 1}px`;
                    return;
                }
            }
            el.style.fontSize = `${this.options.max}px`;
            return;
        }
        else {
            for (let c = this.options.min; c < parseFloat(fontSize); c++) {
                let r = this.getTextWidth(el.innerText, `${fontWeight} ${c}px ${fontFamily}`);
                if (r > el.clientWidth) {
                    el.style.fontSize = `${c - 1 < this.options.min ? this.options.min : c - 1}px`;
                    return;
                }
            }
            el.style.fontSize = `${this.options.min}px`;
            return;
        }
    }

    getTextWidth(text, font) {
        let canvas = this.canvas || (this.canvas = document.createElement('canvas'));
        let context = canvas.getContext('2d');
        context.font = font;
        return context.measureText(text).width;
    }

    set(options) {
        this.options = Object.assign(this.options, options);
    }
}

export default Fitter;
