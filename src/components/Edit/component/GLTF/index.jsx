
import { Text, useHelper } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import { BoxHelper } from 'three';
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
/**
 * helper (react-three/drei=> useHelper) 
 * @param {*} props 
 * @returns 
 */
const HelperView = (props) => {
	const { modeRef } = props || {}
	useHelper(modeRef, BoxHelper, 'cyan')
	return <></>
}
const ShoeMode = (props) => {
	const ShoeModeref = useRef()
	const [hovered, setHovered] = useState(false)
	//	src模型文件路径, cameraRef相机ref, iconShow是否显示icon, modeId当前模型得ID也是数组得id, handleClick点击处理函数
	//	eslint-disable-next-line
	const { src, iconShow, modeId, handleClick, editModeId, hadnleDoubleClick } = props || {}
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
			<mesh
				name={modeId}
				ref={ShoeModeref}
				{...props}
				castShadow
				onClick={handleClick}
				onDoubleClick={hadnleDoubleClick}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
			>
				{/* material-color={editModeId === modeId ? '#ff6080' : 'white'} */}
				{/* [判断修改ID是否等于当前模型的ID]显示用helper */}
				{editModeId === modeId && <HelperView modeRef={ShoeModeref} />}
				{
					mesh && <primitive object={mesh}></primitive>
				}
				{ hovered && iconShow &&  <TextView />}
			</mesh>
			
		</>
	)
}

export default ShoeMode;
