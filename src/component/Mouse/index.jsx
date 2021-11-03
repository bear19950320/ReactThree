import { useState, useEffect } from "react";
const Mouse = (props) => {
    const { children, data, x: propsX, y: propsY, handleUp } = props || {}
    const [{x,y}, setXY] = useState({x: propsX, y: propsY})
    const [down, setDown] = useState(true)
    function handleMouseUp(e) {
        console.log('handleMouseUp')
        e && handleMouseMove(e, true)
        setXY({x: 0, y: 0})
        handleUp && handleUp(e)
        window.removeEventListener('mouseup', handleMouseUp, false)
    }
    function handleMouseMove (e, type) {
        const { clientX, clientY } = e || {}
        if (e) {
            data && !down && setDown(true)
            setXY({
                x: clientX,
                y: clientY
            })
            return;
        }
        setXY({x: 0, y: 0})
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