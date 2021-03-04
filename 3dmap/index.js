const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const loader = new THREE.GLTFLoader();
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/libs/draco/');
loader.setDRACOLoader(dracoLoader);

const light = new THREE.AmbientLight(0x404040, 3);
scene.add(light);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

let sizes = {
    'low': 2639052,
    'medium': 11196044,
    'high': 31216188
}

let last_model;
function loadModel(path) {
    loader.load(
        path,
        function (gltf) {
            document.querySelector('.js-value').innerHTML = 'rendering';
            setTimeout(() => {
                if (last_model) scene.remove(last_model);
                console.log(scene.children);

                let model = gltf.scene.children[0];
                scene.add(model);
                camera.position.y = 100;
                camera.position.z = 100;
                camera.lookAt(model.position)
                model.position.y = -10;

                last_model = model;

                document.querySelector('.js-value').innerHTML = 'done';
            }, 0);
        },
        function (xhr) {
            console.log(xhr.total, sizes[quality]);
            let total = xhr.loaded / sizes[quality] * 100;
            document.querySelector('.js-value').innerHTML = (total.toFixed(2) + '% loaded');

            if (total.toFixed(0) == 100) {
                document.querySelector('.js-value').innerHTML = 'processing model';
            }
        },
        function (error) {
            console.log(error);
            document.querySelector('.js-value').innerHTML = 'error: ' + error.type;
        }
    )
}

let quality = localStorage.getItem('quality') || 'low';
loadModel(`./p6_${quality}.glb`);

function changeQuality(evt) {
    quality = evt.currentTarget.getAttribute('value');
    localStorage.setItem('quality', quality);
    loadModel(`./p6_${quality}.glb`);
}

let toggles = document.querySelectorAll('.js-quality');
for (let t of toggles) {
    t.onclick = changeQuality;
}