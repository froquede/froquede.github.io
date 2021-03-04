import * as THREE from 'https://cdn.skypack.dev/three@^0.117.1';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';
import { EffectComposer } from './EffectComposer.js';
import { RenderPass } from './RenderPass.js';
import { ShaderPass } from './postprocessing/ShaderPass.js';
import { PixelShader } from './PixelShader.js';

var colors = new Uint8Array(5);
for (var c = 0; c <= colors.length; c++) {
    colors[c] = (c / colors.length) * 256;
}
colors = colors.reverse();

var gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.LuminanceFormat);
gradientMap.minFilter = THREE.NearestFilter;
gradientMap.magFilter = THREE.NearestFilter;
gradientMap.generateMipmaps = false;

const scene = new THREE.Scene();
var loader = new GLTFLoader();
var camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000);
camera.position.set(0, 0, 30);
camera.zoom = 300;
camera.updateProjectionMatrix();
var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


let light = new THREE.DirectionalLight(0xffffff, 0.7);
light.position.set(1, 0.4, 0.5);
scene.add(light);

light = new THREE.AmbientLight(0x222222);
scene.add(light);

let composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
let pixelPass = new ShaderPass(PixelShader);
pixelPass.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
pixelPass.uniforms["resolution"].value.multiplyScalar(window.devicePixelRatio);
pixelPass.uniforms["pixelSize"].value = (6 * window.devicePixelRatio);
composer.addPass(pixelPass);

let controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => {
    // renderer.render(scene, camera);
    composer.render();
}); // use if there is no animation loop
controls.minDistance = -10;
controls.maxDistance = 10;
controls.target.set(0, 0, 0);
controls.update();

let material = new THREE.MeshToonMaterial({ color: 0xff7700, gradientMap: gradientMap, lightMapIntensity: 0, aoMapIntensity: 0, displacementScale: 0, emissiveIntensity: 0 });

function computeScreenSpaceBoundingBox(mesh, camera) {
    var vertices = mesh.geometry.vertices;
    var vertex = new THREE.Vector3();
    var min = new THREE.Vector3(1, 1, 1);
    var max = new THREE.Vector3(-1, -1, -1);

    for (var i = 0; i < vertices.length; i++) {
        var vertexWorldCoord = vertex.copy(vertices[i]).applyMatrix4(mesh.matrixWorld);
        var vertexScreenSpace = vertexWorldCoord.project(camera);
        min.min(vertexScreenSpace);
        max.max(vertexScreenSpace);
    }

    return new THREE.Box2(min, max);
}

let all = [];
let loaded = false;
loader.load(
    // resource URL
    './suzane.glb',
    // called when the resource is loaded
    function (gltf) {
        all.push(gltf.scene);

        gltf.scene.traverse((o) => {
            if (o.isMesh) {
                o.material = material;
            }
        });
        scene.add(gltf.scene);

        loader.load(
            // resource URL
            './suzane.glb',
            // called when the resource is loaded
            function (gltf) {
                all.push(gltf.scene);

                let outline_mat = new THREE.MeshBasicMaterial({ color: 0x391513, side: THREE.BackSide });

                gltf.scene.traverse((o) => {
                    if (o.isMesh) {
                        o.material = outline_mat;
                    }
                });
                gltf.scene.scale.multiplyScalar(1.06);
                scene.add(gltf.scene);

                loaded = true;


                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object

                composer.render();
                requestAnimationFrame(anim);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.log('An error happened');
                console.log(error)
            }
        );


        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

        composer.render();
        requestAnimationFrame(anim);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
        console.log(error)
    }
);

let count = 0;
let anim = () => {
    // console.log('call')
    requestAnimationFrame(anim);
    if (count % 6 == 0 && loaded) {
        for(let i = 0; i < all.length; i++) {
            all[i].rotation.y += .03125 / 2;
            all[i].rotation.x += .0625 / 2;
        }
        // all.rotation.x += 0.005;
        count = 0;
        composer.render();
    }
    count++;
}