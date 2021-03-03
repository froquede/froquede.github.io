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

loader.load(
    './p6x3c.glb',
    function (gltf) {
        document.querySelector('.js-value').innerHTML = 'rendering';
        setTimeout(() => {
            let model = gltf.scene.children[0];
            scene.add(model);
            camera.position.y = 100;
            camera.position.z = 100;
            camera.lookAt(model.position)
            model.position.y = -10;

            document.querySelector('.js-value').innerHTML = 'done';
            animate();
        }, 0);
    },
    function (xhr) {
        // console.log(xhr.total);
        let total = xhr.loaded / 23060400 * 100;
        document.querySelector('.js-value').innerHTML = (total.toFixed(2) + '% loaded - 3% compressed');

        if (total.toFixed(0) == 100) {
            document.querySelector('.js-value').innerHTML = 'processing model';
        }
    },
    function (error) {
        document.querySelector('.js-value').innerHTML = error;
    }
)

const light = new THREE.AmbientLight(0x404040, 3);
scene.add(light);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}