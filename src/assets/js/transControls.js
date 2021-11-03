// import * as THREE from 'three';
// export const transControlsChange = (event, ref) => {
//     const { transControls, cameraRef, cameraOrtho } = ref || {}
//     const control = transControls?.current || null;
//     const currentCamera = cameraRef?.current || null;
//     const cameraPersp = currentCamera
//     console.log('event.keyCode:', event.keyCode)
//     switch (event.keyCode) {
//         case 81: // Q
//             control.setSpace(control.space === 'local' ? 'world' : 'local');
//             break;

//         case 16: // Shift
//             control.setTranslationSnap(100);
//             control.setRotationSnap(THREE.MathUtils.degToRad(15));
//             control.setScaleSnap(0.25);
//             break;

//         case 87: // W
//             control.setMode('translate');
//             break;

//         case 69: // E
//             control.setMode('rotate');
//             break;

//         case 82: // R
//             control.setMode('scale');
//             break;

//         // case 67: // C
//         //     const position = currentCamera.position.clone();

//         //     currentCamera = currentCamera.isPerspectiveCamera ? cameraOrtho : cameraPersp;
//         //     currentCamera.position.copy( position );

//         //     orbit.object = currentCamera;
//         //     control.camera = currentCamera;

//         //     currentCamera.lookAt( orbit.target.x, orbit.target.y, orbit.target.z );
//         //     onWindowResize();
//         //     break;

//         case 86: // V
//             const randomFoV = Math.random() + 0.1;
//             const randomZoom = Math.random() + 0.1;

//             cameraPersp.fov = randomFoV * 160;
//             cameraOrtho.bottom = - randomFoV * 500;
//             cameraOrtho.top = randomFoV * 500;

//             cameraPersp.zoom = randomZoom * 5;
//             cameraOrtho.zoom = randomZoom * 5;
//             // onWindowResize();
//             break;

//         case 187:
//         case 107: // +, =, num+
//             control.setSize(control.size + 0.1);
//             break;

//         case 189:
//         case 109: // -, _, num-
//             control.setSize(Math.max(control.size - 0.1, 0.1));
//             break;

//         case 88: // X
//             control.showX = !control.showX;
//             break;

//         case 89: // Y
//             control.showY = !control.showY;
//             break;

//         case 90: // Z
//             control.showZ = !control.showZ;
//             break;

//         case 32: // Spacebar
//             console.log(control.enabled, '===control')
//             control.enabled = !control.enabled;
//             console.log(control.enabled, '===control enabled')
//             break;

//     }
// }

// function onWindowResize() {
//     const aspect = window.innerWidth / window.innerHeight;
//     cameraPersp.aspect = aspect;
//     cameraPersp.updateProjectionMatrix();

//     cameraOrtho.left = cameraOrtho.bottom * aspect;
//     cameraOrtho.right = cameraOrtho.top * aspect;
//     cameraOrtho.updateProjectionMatrix();

//     renderer.setSize(window.innerWidth, window.innerHeight);

//     render();

// }