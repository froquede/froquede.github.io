var editor = monaco.editor.create(document.getElementById('editor'), {
    value: [
        'function setup() {',
        '\twindow.canvas = createCanvas(vWIDTH, vHEIGHT);',
        "\tcanvas.parent('viewport');",
        '}',
        '',
        'function draw() {',
        '\ttextSize(32);',
        "\ttext('Hello World!', 30, 30);",
        '}'
    ].join('\n'),
    language: 'javascript',
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    scrollbar: {},
    theme: 'vs-dark'
});

// editor.model.onDidChangeContent(debounce(() => {
//     setTimeout(() => {
//         if (monaco.editor.getModelMarkers({}).length === 0) {
//             window.eval(editor.getValue());
//             console.log('eval')
//         }
//     }, 100);
// }, 500));

function run() {
    if (monaco.editor.getModelMarkers({}).length === 0) {
        clear();
        executeJSString(editor.getValue());
        console.log('eval')
    }
}

var viewport = document.getElementById('viewport');
window.vWIDTH = viewport.clientWidth;
window.vHEIGHT = viewport.clientHeight;
executeJSString(editor.getValue());

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function executeJSString(s) {
    setTimeout(s, 0);
}