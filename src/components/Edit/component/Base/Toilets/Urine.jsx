
import { useRef } from "react";
import * as THREE from 'three';
import { CSG } from "three-csg-ts";
const createMode = () => {
    let heartShape = new THREE.Shape()

    const doorImg = new THREE.TextureLoader().load('/door.jpg')
    // useLoader(THREE.TextureLoader, ['/door.jpg', './logo512.png'])
    //  门 纹理
    // eslint-disable-next-line
    const doorTexture = new THREE.MeshPhongMaterial({
        map: doorImg,
        // specular: 0xffffff,
        // color: 0xffffff
    });

    heartShape.moveTo(0, -0.2)
    heartShape.bezierCurveTo(0, 1, 0.8, 0, -0.2, -0.8, 0.5, 0)
    // heartShape.ellipse(0, 0.2, 0.35, 0.6, -0.2, 2 * Math.PI, true, 3)
    const ext = {
        curveSegments: 32,
        amount: 0.2,
        depth: 16,
        bevelEnabled: false,
        bevelSegments: 1,
        steps: 2,
        bevelSize: 1,
        bevelThickness: 1
    }
    const mesh1 = new THREE.Mesh(new THREE.ExtrudeGeometry(heartShape, ext))
    mesh1.position.z = 0.1;
    mesh1.position.y = 0.13
    mesh1.position.x = 0.3
    mesh1.rotation.x = 0
    mesh1.rotation.z = 0
    mesh1.rotation.y = 3.1
    //  圆柱体
    const mesh2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.35, 1, 18))
    //  长方体
    const mesh3 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.4))
    mesh3.position.y = 0.05
    //  球体
    const mesh4 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32))
    mesh1.updateMatrix()
    mesh2.updateMatrix()
    mesh3.updateMatrix()
    mesh4.updateMatrix()

    const sub = CSG.intersect(mesh3, mesh4)
    const mesh = CSG.subtract(sub, mesh1)

    mesh.material = new THREE.MeshPhongMaterial({map: doorImg})
    return mesh;
}

const Urine = (props) => {
    const urineRef = useRef()
    const { setTarget } = props || {}
    const mesh = createMode()
    return (
        <mesh ref={urineRef} {...props} onClick={(e) => {
            e.stopPropagation()
            setTarget(urineRef)
        }}>
            <ambientLight intensity={1} color="#fff" />
            <primitive object={mesh} />
            {/* <Sphere>
                <meshBasicMaterial attach="material" color="red" />
            </Sphere> */}
        </mesh>
    )
}

export default Urine;
