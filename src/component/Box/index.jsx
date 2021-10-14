import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Scene(props) {
    return (
        <>
            <pointLight {...props} />
            <mesh position={[0, 0, 2]}>
                <color attach="background" args={['red']} />
                <boxGeometry />
                <meshNormalMaterial />
            </mesh>
        </>
    );
}
const Index = () => {
    return (
        <div className="box_geometry">
            <Canvas>
                <Suspense fallback={null}>
                    <Scene position={[10, 50, 10]} />
                    <OrbitControls />
                </Suspense>
            </Canvas>
        </div>
    );
}
export default Index
