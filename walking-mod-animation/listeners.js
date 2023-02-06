let listeners = {}

window.on = (event, data) => {
    if (listeners[event]) {
        let l = listeners[event];
        for (let i = 0; i < l.length; i++) {
            try {
                l[i](data);
            } catch (err) {
                console.log(err);
            }
        }
    }
}

window.listen = (key, cb) => {
    if (!listeners[key]) listeners[key] = []
    listeners[key].push(cb);
}