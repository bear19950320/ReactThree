import { useRef, useState } from "react";
import * as THREE from 'three';
import { CSG } from "three-csg-ts";

//  开关门
const doorOpenClose = (object, type) => {
    object.rotation.y = type ? - 0.45 : 0;
    object.position.z = type ? 1.35 : 0.9;
    object.position.x = type ? - 0.05 : 0
}

const createMode = () => {
    const doorImg = new THREE.TextureLoader().load('/door.jpg')
    const toiletImg = new THREE.TextureLoader().load('/image/toilet.jpg')
    toiletImg.wrapS = THREE.RepeatWrapping;
    toiletImg.repeat.set( 1, 1);
    toiletImg.center.set(0.5, 0.5)
    // useLoader(THREE.TextureLoader, ['/door.jpg', './logo512.png'])
    //  门 纹理
    // eslint-disable-next-line
    const doorTexture = new THREE.MeshPhongMaterial({
        map: doorImg,
        specular: 0xffffff,
        color: 0xff0000
    });
    //  蹲坑纹理
    const toiletTexture = new THREE.MeshPhongMaterial({
        map: toiletImg,
        specular: 0xffffff,
        color: 0xffffff
    });
    //  法线网格材质(彩色)
    // eslint-disable-next-line
    const normalMaterial = new THREE.MeshNormalMaterial();
    //  基本材质
    const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff1800});
    // // 环
    // const closedSpline = new THREE.CatmullRomCurve3( [
    //     new THREE.Vector3( - 60, - 100, 60 ),
    //     new THREE.Vector3( - 60, 20, 60 ),
    //     new THREE.Vector3( - 60, 120, 60 ),
    //     new THREE.Vector3( 60, 20, - 60 ),
    //     new THREE.Vector3( 60, - 100, - 60 )
    // ] );

    // closedSpline.curveType = 'catmullrom';
    // closedSpline.closed = true;

    // const extrudeSettings1 = {
    //     steps: 100,
    //     bevelEnabled: false,
    //     extrudePath: closedSpline
    // }

    // const pts1 = [], count = 3;

    // for ( let i = 0; i < count; i ++ ) {
    //     const l = 20;
    //     const a = 2 * i / count * Math.PI;
    //     pts1.push( new THREE.Vector2( Math.cos( a ) * l, Math.sin( a ) * l ) );

    // }

    // const shape1 = new THREE.Shape( pts1 );

    // const geometry1 = new THREE.ExtrudeGeometry( shape1, extrudeSettings1 );

    // const material1 = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );

    // const mesh1 = new THREE.Mesh( geometry1, material1 )
    // // 五角星
    // const material1 = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );
    // const material2 = new THREE.MeshLambertMaterial( { color: 0xff8000, wireframe: false } );
    // const materials = [ material1, material2 ];
    // const extrudeSettings3 = {
    //     depth: 0.5,
    //     steps: 1,
    //     bevelEnabled: true,
    //     bevelThickness: 0.4,
    //     bevelSize: 0.5,
    //     bevelSegments: 4
    // };
    // const pts2 = [], numPts = 5;

    // for ( let i = 0; i < numPts * 2; i ++ ) {
    //     const l = i % 2 == 1 ? 1 : 2;
    //     const a = i / numPts * Math.PI;
    //     pts2.push( new THREE.Vector2( Math.cos( a ) * l, Math.sin( a ) * l ) );
    // }
    // console.log(pts2, '====pts2')
    // const shape2 = new THREE.Shape( pts2 );
    // const geometry3 = new THREE.ExtrudeGeometry(shape2, extrudeSettings3 );
    // const mesh3 = new THREE.Mesh( geometry3, materials );
    // mesh3.position.set(1, 1, 1 );

    // 正方形顶部贴图
    // const geometry = new THREE.BoxGeometry(2,2,2)
    // var mate1 = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./logo192.png')});
    // // [ 东, 西, 上, 下, 南, 北]
    // var mesh = new THREE.Mesh( geometry, [mate1, basicMaterial, basicMaterial, basicMaterial, basicMaterial, basicMaterial] ) ;
    //  开门
    // eslint-disable-next-line
    const animate = () => {
        requestAnimationFrame(animate)
    }
    // 坑位格
    const boxA = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2))
    const boxB = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 1.8))
    boxB.position.x = - 0.1;
    boxA.updateMatrix()
    boxB.updateMatrix()
    const newMesh = CSG.subtract(boxA, boxB);
    newMesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6})
    newMesh.position.y = 0.5
    newMesh.rotation.y = 1.57
    // newMesh.position.x = -1;
    // doorBox.position.x = -1
    // 坑位地面
    const boxC = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 1.6), [basicMaterial, basicMaterial, toiletTexture, basicMaterial,basicMaterial,basicMaterial])
    boxC.position.y =  -0.4
    // 门
    const doorMode = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2, 0.2), basicMaterial)
    doorMode.position.y = 0.5
    return {
        boxC,
        newMesh,
        doorMode
    }
}

const Toilet = (props) => {
    const toiletRef = useRef()
    const [doorOpen, setDoorOpen] = useState(true)
    const { handleClick, modeId } = props || {}
    const { boxC, newMesh, doorMode } = createMode()
    doorOpenClose(doorMode, doorOpen)
    return (
        <group
            ref={toiletRef}
            {...props}
            name={modeId}
            onClick={handleClick}
        >
            {/* <SpotLight penumbra={0.5} position={[-1, 1, 0]} intensity={0.5} angle={0.5} color="#ff005b" castShadow /> */}
            <primitive object={newMesh} />
            <group onClick={(e) => {
                e.stopPropagation()
                setDoorOpen(!doorOpen)
            }}>
                <primitive object={doorMode} />
            </group>
            <primitive object={boxC} /> 
        </group>
    )
}

export default Toilet;