import { useState, useEffect } from "react";
const Mouse = (props) => {
    const { children, data, x: propsX, y: propsY, handleUp } = props || {}
    const [{x,y}, setXY] = useState({x: propsX, y: propsY})
    const [down, setDown] = useState(true)
    // 鼠标移动
    //  eslint-disable-next-line
    // const handleMouseUp = (e, item) => {
    //     // console.log(GL, '===GL')
    //     const { camera: cameraGL } = GL || {}
    //     //  eslint-disable-next-line
    //     const { src } = item || {}
    //     //  eslint-disable-next-line
    //     const { clientX: x, clientY: y } = e || {}
    //     // // 屏幕坐标转标准设备坐标
    //     const x1 = ( x / window.innerWidth ) * 2 - 1;
    //     const y1 = -( y / window.innerHeight ) * 2 + 1;
    //     //新建一个三维单位向量 假设z方向就是0.5
    //     //根据照相机，把这个向量转换到视点坐标系
    //     var vector = cameraGL && new THREE.Vector3(x1, y1, 0.5).unproject(cameraGL)
    //     const { position } = cameraGL || {}
    //     clearInterval(timer)
    //     timer = 0;
    //     console.log(position, '===position', timer)
    //     // const modePosition = {
    //     //     x: position.x + vector.x,
    //     //     y: 0,
    //     //     z: position.z + vector.z
    //     // }
    //     // setCanvasArray({
    //     //     ...item,
    //     //     position: stdVector,
    //     //     modeType: src && 'gltf',
    //     //     modeId: `c_s_${canvasArray.length + 1}`
    //     // })
    //     setMouseData(null)
    // }
    function handleMouseUp(e) {
        console.log('handleMouseUp')
        e && handleMouseMove(e, true)
        // setDown(false)
        setXY({x: 0, y: 0})
        handleUp && handleUp(e)
        window.removeEventListener('mouseup', handleMouseUp, false)
    }
    function handleMouseMove (e, type) {
        const { clientX, clientY } = e || {}
        type && console.log(type, '===type')
        if (e) {
            data && !down && setDown(true)
            setXY({
                x: clientX,
                y: clientY
            })
            // data && type && down && setDown(false)
            // data && type && down && setXY({x: 0, y: 0})
            // data && type && down && handleUp && handleUp(e)
            return;
        }
        setXY({x: 0, y: 0})
    }
    useEffect(() => {
        if (data?.image) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }
    }, [])
    useEffect(()=>{
        return () => {
            console.log('setDown', down)
            window.removeEventListener('mousemove', handleMouseMove, false);
            window.removeEventListener('mouseup', handleMouseUp, false)
        }
      },[down])
    return <div>
        {children({x, y})}
    </div>
}
export default Mouse