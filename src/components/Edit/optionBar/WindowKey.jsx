import { useEffect } from "react";

function onWindowResize(camera) {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
}

function WindowKey(props) {
    const { GL, setCanvasArray } = props || {}
    useEffect(() => {
        const { camera, scene } = GL || {}
        function handleKeyUp(event) {
            // 方向键 (左:37 上:38 右:39 下:40) 翻页键(pageUP:33 pageDown:34)
            const keyDefault = [37, 38, 39, 40, 33, 34]
            event.stopPropagation()
            event.preventDefault()
            // 判断按键绑定没有这list 才会调用 keyCode（原因：window['keyup/keyDown'] 会触发两次导致累加）
            !keyDefault.includes(event.keyCode) && handleKeyCode(event, true)
        }
        function handleKeyCode(event, up) {
            const { nowControls } = GL
            switch (event.keyCode) {
                case 8: //  backspace (删除键)
                    const modeId = nowControls?.object?.modeId
                    // scene.remove(nowControls.object)
                    modeId && setCanvasArray({
                        modeId
                    })
                    const editObject = modeId && scene.getObjectByName(modeId);
                    modeId && scene.remove(editObject)
                    break;
                case 16: // Shift (视角平行)
                    // camera.position.x = 0.04
                    // camera.position.y = 0.1
                    // camera.position.z = 19.8
                    // onWindowResize(camera)
                    break;
                case 68: // D 相机向👉旋转视角
                    camera.position.x += 0.1
                    break;
                case 65: // A 相机向👈旋转视角
                    camera.position.x -= 0.1
                    break;
                case 87: // W 相机向👆旋转视角(俯视)
                    camera.position.y += 0.1
                    break;
                case 83: // S 相机向👇旋转视角(仰视)
                    camera.position.y -= 0.1
                    break;
                case 81: // Q 相机向远视角(视野放大)
                    camera.position.z += 0.1
                    break;
                case 69: // E 相机向近视角(视野缩小)
                    camera.position.z -= 0.1
                    break;
                case 86: // V 相机📷倍数缩放
                    const randomZoom = Math.random() + 0.1;
                    up && (camera.zoom = randomZoom * 5)
                    up && onWindowResize(camera)
                    break;
                case 107: // 数字键盘＋ 控制器的操作大
                    nowControls && up && nowControls.setSize(nowControls.size + 0.1);
                    
                    break;
                case 109: // 数字键盘- 控制器的操作小
                    nowControls && up && nowControls.setSize(Math.max(nowControls.size - 0.1, 0.1));
                    break;
                case 32: // space (空格键) 修改编辑器的是否编辑
                    nowControls && up && (nowControls.enabled = !nowControls.enabled)
                    break;
                case 37:  //    ←(方向键左) 编辑的元素向左移动
                    nowControls && (nowControls.object.position.x -= 0.05) && setCanvasArray(nowControls.object)
                    break;
                case 38:  //    ↑(方向键上) 编辑的元素向上移动
                    nowControls && (nowControls.object.position.y += 0.05) && setCanvasArray(nowControls.object)
                    break;
                case 39:  //    →(方向键右) 编辑的元素向右移动
                    nowControls && (nowControls.object.position.x += 0.05) && setCanvasArray(nowControls.object)
                    break;
                case 40:  //    ↓(方向键下) 编辑的元素向下移动
                    nowControls && (nowControls.object.position.y -= 0.05) && setCanvasArray(nowControls.object)
                    break;
                case 33: // page-up编辑的元素向近移动
                    nowControls && (nowControls.object.position.z += 0.05) && setCanvasArray(nowControls.object)
                    break;
                case 34: // page-down 编辑的元素向远移动
                    nowControls && (nowControls.object.position.z -= 0.05) && setCanvasArray(nowControls.object)
                    break;
                default:
                    console.log('其它键位', event.keyCode)
            }
        }
        window.addEventListener('keydown', handleKeyCode)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyCode, false);
            window.removeEventListener('keyup', handleKeyUp, false)
        }
    }, [GL, setCanvasArray])
    return <></>
}

export default WindowKey;