class Handedness {
    constructor() {
        window.addEventListener('touchstart', this.start, false);
        window.addEventListener('touchend', this.end, false);

        this.last_point;
        this.touches = [];
        this.threshold = .25;
        this.last_touch_trail;
        this.last_prediction = '';
        this.last_classification = { total: 0, count: 0, grade: 1 };
    }

    start(e) {
        this.last_point = new Vector2(e);
    }
    
    end(e) {
        var position = new Vector2(e);
        var touch_trail = {
            start: this.last_point,
            end: position,
            vertical: this.checkIfVertical(this.last_point, position)
        }
    
        this.updateDebug(this.touch_trail);
    
        if (this.touch_trail.vertical === true) {
            this.touches.push(this.touch_trail);
            this.classify(this.touch_trail);
        }
    }
    
    checkIfVertical(s, e) {
        var w = window.innerWidth;
        var h = window.innerHeight;
    
        var _diff = s.diff(e);
        var t = w * this.threshold;
    
        if (_diff.x >= t) {
            return false;
        }
        else {
            if (_diff.x > _diff.y) {
                return false;
            }
            else {
                return true;
            }
        }
    }

    classify(touch_trail) {
        var grade = this.last_classification.total;
        this.last_classification.total += this.classifyTouch(touch_trail.start.getFurther(touch_trail.end));
        this.last_classification.count += 1;
        this.last_classification.grade = this.last_classification.total / this.last_classification.count;
    
        var sides;
        if (this.last_classification.grade <= 0.5) {
            side = 'left';
            updateDebug(this.last_touch_trail, 'left-handed');
        }
        else {
            side = 'right';
            updateDebug(this.last_touch_trail, 'right-handed');
        }
    
        this.checkAndNotify(this.last_classification.handedness, side);
        this.last_classification.handedness = side;
    }

    classifyTouch(point) {
        return point.x / window.innerWidth;
    }
    
    checkAndNotify(old_h, new_h) {
        if (old_h !== new_h) {
    
        }
    }
    
    getSide() {
        return { classification: this.last_classification, touches: this.touches };
    }

    updateDebug(touch_trail, prediction) {
        document.getElementById('debug_info').innerHTML =
            '<p>start: ' + touch_trail.start.x + ' - ' + touch_trail.start.y + '<p> \
             <p>end: ' + touch_trail.end.x + ' - ' + touch_trail.end.y + '<p> \
             <p>vertical? ' + touch_trail.vertical + '<p> \
             <p>threshold: ' + this.threshold * 100 + '%<p><br>\
             <h3>prediction: <b>' + (prediction || this.last_prediction) + '</b></h3>';
    
        if (touch_trail) {
            this.last_touch_trail = touch_trail;
        }
        if (prediction) {
            this.last_prediction = prediction;
        }
    }
}

class Vector2 {
    constructor(event, x, y) {
        this.x = x;
        this.y = y;

        if (Object.keys(event).length > 0) {
            if (event.touches[0]) {
                this.x = event.touches[0].clientX;
                this.y = event.touches[0].clientY;
            }
            if (event.changedTouches[0]) {
                this.x = event.changedTouches[0].clientX;
                this.y = event.changedTouches[0].clientY;
            }
        }
    }

    diff(b) {
        return new Vector2({}, this.positive(this.x - b.x), this.positive(this.y - b.y));
    }

    getFurther(b) {
        if (this.x >= b.x) {
            return this;
        }
        else {
            return b;
        }
    }

    positive(value) {
        if (value < 0) {
            return value * -1;
        }
        return value;
    }
}
