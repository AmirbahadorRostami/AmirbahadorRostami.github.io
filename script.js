import './style.css'
import * as THREE from 'three'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'



//texture loader
const loader = new THREE.TextureLoader();
const texture = loader.load('/Terrain002_2K_Color.png');
const height = loader.load('/Height.png');;
const alpha = loader.load('/alpha.png');



// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const planeGeometry = new THREE.PlaneBufferGeometry(3,3,64,64);

const wireFrame = new THREE.WireframeGeometry(planeGeometry);

// Materials
const material = new THREE.MeshStandardMaterial({
    color: 'gray',
    displacementMap: height,
    displacementScale: 0.7,
    alphaMap: alpha,
    transparent: true,
    depthTest: false,
    wireframe: true

})

// Mesh
const plane = new THREE.Mesh(planeGeometry,material);


scene.add(plane);

plane.rotation.x = 181;
//gui.add(plane.rotation, 'x');


// Lights

const pointLight = new THREE.PointLight('#17447a', 2)
pointLight.position.x = 2
pointLight.position.y = 6.5
pointLight.position.z = 0
scene.add(pointLight)

gui.add(pointLight.position,'x');
gui.add(pointLight.position,'y');
gui.add(pointLight.position,'z');



const col = {color : '#00ff00'};

gui.addColor(col,'color').onChange(() => {
    pointLight.color.set(col.color)
})



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove',animateTerrain);

let mouseY;

function animateTerrain(event){
    mouseY = event.clientY;
}



const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    plane.rotation.z = .5 * elapsedTime
    plane.material.displacementScale =  0.3 + mouseY * 0.0008

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()