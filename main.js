import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { Reflector } from 'three/addons/objects/Reflector.js';

const fileUrl = new URL('./door.glb', import.meta.url)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( -10, 30, 30 );
camera.lookAt( 0, 0, 0 );


// -- LIGHT START --

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1) // направленый свет
directionalLight.position.set( 50, 50, 50 );
directionalLight.shadow.camera.bottom = -12 // увеличение полигона направленного источника света
scene.add(directionalLight)



// -- LIGHT END --


// -- HELPERS START --

const orbit = new OrbitControls(camera, renderer.domElement) // перемещение в пространстве
orbit.update()

// -- HELPERS END --

const mirrorGeometry = new THREE.PlaneGeometry( 110, 110);
let groundMirror = new Reflector( mirrorGeometry, {
	clipBias: 0.003,
	textureWidth: window.innerWidth * window.devicePixelRatio,
	textureHeight: window.innerHeight * window.devicePixelRatio,
	color: 0xffffff
} );
groundMirror.rotateX( - Math.PI / 2 );
scene.add( groundMirror );


const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(3, 50, 50),
	new THREE.MeshStandardMaterial({
		roughness: 0,
		metalness: 0.5,
		color: 0x993354
	}) // for realistic need standart or phisical material
)
scene.add(sphere)
sphere.position.y = 3

const assetsLoader = new GLTFLoader()
assetsLoader.load(fileUrl.href, function(gltf){
	const model = gltf.scene
	model.scale.set(.01,.01,.01)
	model.position.set( 10, 0, -10 );
	scene.add(model)
	console.log(model);
	
}, undefined, // функция сообщающая о прогрессе загрузки модели
function(error){ // возвращает ошибки
	console.error(error);
})

function animate() {
	
	renderer.render( scene, camera );
}
renderer.setAnimationLoop(animate)


// canvas media resize

window.addEventListener('resize', function(){
	camera.aspect = window.innerWidth/window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight, )
})






