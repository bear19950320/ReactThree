
import { Text } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const TextView = () => {
	return <Text
		// position={[0, 1, -0.75]}
		fontSize={0.2}
		lineHeight={1.2}
		text={[
			// "surfing",
			// "electric_bike",
			// "clean_hands",
			"whatshot",
			// "star_half",
			// "coronavirus",
			// "usb",
			// "local_florist"
		].join(" ")}
		font="https://fonts.gstatic.com/s/materialicons/v70/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.woff"
		color="#050505"
	/>
}

/**
 * 加载模型
 * @param {*} src 模型文件
 * @returns 
 */
const loadingMode = (src) => {
	const loader = new GLTFLoader();
	return new Promise((resolve) => {
		loader.load(`/models${src}`, resolve);
	});
}

const ShoeMode = (props) => {
	const ShoeModeref = useRef()
	const [hovered, setHovered] = useState(false)
	//	src模型文件路径, cameraRef相机ref, iconShow是否显示icon, modeId当前模型得ID也是数组得id, handleClick点击处理函数
	const { src, cameraRef, iconShow, modeId, handleClick } = props || {}
	// 相机对象
	//	eslint-disable-next-line
	const cameraObj = cameraRef?.current
	const [mesh, setMesh] = useState(null)
	// 异步处理 写入GLTF 模型
	useEffect(() => {
		const getMode = async () => {
			const modeData = await loadingMode(src);
			const { scene } = modeData || {}
			setMesh(scene)
		} 
		getMode()
	}, [src]);

	return (
		<>
			{/* 点击注入 拖拽组件需要的Object */}
			<group
				name={modeId}
				ref={ShoeModeref}
				{...props}
				onClick={handleClick}
				// onDoubleClick={(e) => {
				// 	e.stopPropagation()
				// 	// const { position } = ShoeModeref.current || {}
				// 	// const { x, y, z } = position || {}
				// 	// cameraRef.current.position.set(x || 0, y || 0, z || 0)
				// 	console.log(e, 'onDoubleClick')
				// }}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
			>
				{
					mesh && <primitive  object={mesh}></primitive>
				}
				{ hovered && iconShow &&  <TextView />}
			</group>
			
		</>
	)
}

export default ShoeMode;
