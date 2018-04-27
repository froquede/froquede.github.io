class Handedness {
    constructor(changeListener) {
        window.addEventListener('touchstart', (e) => { this.start(e, this); }, false);
        window.addEventListener('touchend', (e) => { this.end(e, this); }, false);

        this.last_point;
        this.touches = [];
        this.threshold = .25;
        this.last_touch_trail;
        this.last_prediction = '';
        this.last_classification = { total: 0, count: 0, grade: 1 };
        this.changeListener = changeListener;
    }

    start(e, self) {
        self.last_point = new Vector2(e);
    }

    end(e, self) {
        var position = new Vector2(e);
        var touch_trail = {
            start: self.last_point,
            end: position,
            vertical: self.checkIfVertical(self.last_point, position)
        }

        self.updateDebug(touch_trail);

        if (touch_trail.vertical === true) {
            self.touches.push(touch_trail);
            self.classify(touch_trail);
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

        var side;
        var last_config = JSON.parse(JSON.stringify(this.last_classification));
        if (this.last_classification.grade <= 0.5) {
            side = 'left';
            this.updateDebug(this.last_touch_trail, 'left-handed');
        }
        else {
            side = 'right';
            this.updateDebug(this.last_touch_trail, 'right-handed');
        }

        this.last_classification.handedness = side;
        this.checkAndNotify(last_config.handedness || 'right', side);
    }

    classifyTouch(point) {
        return point.x / window.innerWidth;
    }

    checkAndNotify(old_h, new_h) {
        if (old_h !== new_h) {
            if (this.changeListener) {
                try {
                    this.changeListener({ classification: this.last_classification, touches: this.touches, last_handedness: old_h });
                }
                catch(err){
                    console.error(err);
                }
            }
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
