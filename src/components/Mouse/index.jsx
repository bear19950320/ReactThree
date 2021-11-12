import { useState, useEffect } from "react";
const Mouse = (props) => {
    const { children, data, x: propsX, y: propsY, handleUp, setMouseData } = props || {}
    const [{x,y}, setXY] = useState({x: propsX, y: propsY})
    const [down, setDown] = useState(true)
    function handleMouseUp(e) {
        const { clientX } = e || {}
        const { clientWidth } = document.getElementsByClassName('tool_bar')[0] || {}
        console.log('handleMouseUp')
        setXY({x: 0, y: 0})
        // 鼠标放开时候(X轴)超出操作栏添加模型
        clientX > clientWidth && handleUp && handleUp(e)
        // 鼠标放开时候(X轴)未超出操作栏 不添加模型
        if (clientX < clientWidth) {
            setMouseData(null)
        }
        // 放开后鼠标恢复为自动
        setTimeout(() => document.body.style.cursor = 'auto', 20)
    }
    function handleMouseMove (e, type) {
        const { clientX, clientY } = e || {}
        const { clientWidth } = document.getElementsByClassName('tool_bar')[0] || {}
        if (e) {
            data && !down && setDown(true)
            // if ()
            setXY({
                x: clientX,
                y: clientY
            })
            // 当移动鼠标的坐标小于操作栏宽度 鼠标样式(禁止添加) 大于是显示 添加
            if (clientX < clientWidth) {
                document.body.style.cursor = `url("/image/cursor/notPush.ico"),auto`
                return;
            }
            !type && (document.body.style.cursor = `cell`)
            return;
        }
    }
    useEffect(() => {
        if (data?.image) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])
    useEffect(()=>{
        return () => {
            window.removeEventListener('mousemove', handleMouseMove, false);
            window.removeEventListener('mouseup', handleMouseUp, false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return <div>
        {children({x, y})}
    </div>
}
export default Mouse