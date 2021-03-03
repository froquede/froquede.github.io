const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const loader = new THREE.GLTFLoader();
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/libs/draco/');
loader.setDRACOLoader(dracoLoader);

loader.load(
    // resource URL
    './p6x2.glb',
    // called when the resource is loaded
    function (gltf) {
        console.log('done');
        let model = gltf.scene.children[0];
        // model.position.y = -1;
        scene.add(model);
        camera.position.y = 100;
        camera.position.z = 100;
        camera.lookAt(model.position)
        renderer.render(scene, camera);

        model.position.y = -10;
        controls.update();
    },
    function (xhr) {
        console.log(xhr.loaded, xhr.total);
        document.querySelector('.js-value').innerHTML = ((xhr.loaded / 13933416 * 100) + '% loaded');
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

animate();