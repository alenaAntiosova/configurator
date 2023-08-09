import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { Scene } from 'three'
import { Group } from 'three'
import { BoxGeometry } from 'three'
import { MeshStandardMaterial } from 'three'
import { PerspectiveCamera } from 'three'
import { TextureLoader } from 'three'

THREE.ColorManagement.enabled = false
const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

//texture wall
const textureLoader = new THREE.TextureLoader()
const wallsColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const wallsNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const wallAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const wallsRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

wallsColorTexture.repeat.set(5,1)
wallAmbientOcclusionTexture.repeat.set(5,1)
wallsNormalTexture.repeat.set(5,1)
wallsRoughnessTexture.repeat.set(5,1)

wallsColorTexture.wrapS = THREE.RepeatWrapping
wallAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
wallsNormalTexture.wrapS = THREE.RepeatWrapping
wallsRoughnessTexture.wrapS = THREE.RepeatWrapping

wallsColorTexture.wrapT = THREE.RepeatWrapping
wallAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
wallsNormalTexture.wrapT = THREE.RepeatWrapping
wallsRoughnessTexture.wrapT = THREE.RepeatWrapping

//door texture
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normalGL.jpg')
const doorDisplacementTexture = textureLoader.load('/textures/door/displacement.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')


//house
const house = new THREE.Group()
scene.add(house)

//wall
const wall = new THREE.Mesh (
    new THREE.BoxGeometry(10, 2.5, 5),
    new THREE.MeshStandardMaterial({
        transparent: true,
        map: wallsColorTexture,
        aoMap:wallAmbientOcclusionTexture,
        normalMap: wallsNormalTexture,
        roughnessMap: wallsRoughnessTexture
    })
)
wall.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(wall.geometry.attributes.uv.array,2))
wall.position.y = 1.25
house.add(wall)


//door
const door = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 2, 0.1),
    new THREE.MeshStandardMaterial({
        //transparent: true,
        map: doorColorTexture,
        normalMap: doorNormalTexture,
        roughnessMap: wallsRoughnessTexture,
        displacement: doorDisplacementTexture
    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2))
door.position.set(0, 0.03, 2.5)
wall.add(door)


//roof
const roof = new THREE.Mesh(
    new THREE.BoxGeometry(10.5, 0.4, 5.1),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.position.y = 1.4
wall.add(roof)


//windows
const windowGeometry = new THREE.BoxGeometry(0.9, 1.5, 0.02)
/*const windowMaterial = new THREE.MeshStandardMaterial({
    map: windowColorTexture,
    normalMap: windowNormalTexture,
    roughnessMap: windowRoughnessTexture
})*/
const windowMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#bde0ff',
    roughness: 0.2,   
    transmission: 1,  
    thickness: 1
});

const windowsBlock = []
for (let i = 0; i < 16; i++) {
    const windows = new THREE.Mesh(windowGeometry, windowMaterial)
    let gap = 0.01
    let x = i + gap
    windows.position.x = x
    windows.position.z = 2.5
    windowsBlock.push(windows)
}

const windowsBlockFirst = windowsBlock.slice(0,4);
const windowsBlockSecond = windowsBlock.slice(5,9);
const leftSideWindowBlock = windowsBlock.slice(10,14);
const rightSideWindowBlock = windowsBlock.slice(15,16);


const firstWindowSection = new THREE.Group();
firstWindowSection.position.y = 0.18;
firstWindowSection.position.x = -4.2;
firstWindowSection.position.z = 0.06;
const secondWindowSection = new THREE.Group();
secondWindowSection.position.y = 0.18;
secondWindowSection.position.x = -3.8;
secondWindowSection.position.z = 0.06;



windowsBlockFirst.map(item => firstWindowSection.add(item));
windowsBlockSecond.map(item => secondWindowSection.add(item));
wall.add(firstWindowSection, secondWindowSection);

//right, left sides. Cover and windows
const sidesGeometry = new THREE.BoxGeometry (4.7, 2, 0.1);
const sidesMaterial = new THREE.MeshStandardMaterial({color:'#FFDB8B' });
const rightSideWall = new THREE.Mesh(sidesGeometry, sidesMaterial);
const leftSideWall = new THREE.Mesh(sidesGeometry, sidesMaterial);

rightSideWall.position.x = 5;
rightSideWall.position.y = 1.3
rightSideWall.rotation.y = Math.PI * 0.5

leftSideWall.position.x = -5;
leftSideWall.position.y = 1.3;
leftSideWall.rotation.y = Math.PI * 0.5;

house.add(rightSideWall,leftSideWall);

const rightSideWindowGroup = new THREE.Group()
const leftSideWindowGroup = new THREE.Group()
rightSideWindowBlock.map(item=>rightSideWindowGroup.add(item))
rightSideWindowGroup.position.set(-16.7,0,-2.45)
leftSideWindowBlock.map(item=>leftSideWindowGroup.add(item))
leftSideWindowGroup.position.x = -11.5;
leftSideWindowGroup.position.y = 0;
leftSideWindowGroup.position.z = -2.56;


rightSideWall.add(rightSideWindowGroup);
leftSideWall.add(leftSideWindowGroup);

//cover material front side
const frontSidesGeometry = new THREE.BoxGeometry (4, 2, 0.1);
const frontSidesMaterial = new THREE.MeshStandardMaterial({color:'#FFDB8B' });
const frontRightSideWall = new THREE.Mesh(frontSidesGeometry, frontSidesMaterial);
const frontLeftSideWall = new THREE.Mesh(frontSidesGeometry, frontSidesMaterial);
frontRightSideWall.position.set(-2.7, 0.03, 2.5);
frontLeftSideWall.position.set(2.7, 0.03, 2.5);
wall.add(frontRightSideWall, frontLeftSideWall);


//light
const light = new THREE.AmbientLight()
scene.add(light)


//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width= window.innerWidth,
    sizes.height= window.innerHeight,

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100)
camera.position.z = 5
scene.add(camera)


//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


//render
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor(0x000000, 0)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//animation
const tick = () =>
{
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()