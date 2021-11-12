import { useState } from "react";
import * as THREE from 'three';
import { Col, Row, Collapse } from 'antd'
import { qiangmian, cornerWall, toilet, basin, urine, meshToilet } from './mode.js';
import Mouse from "../Mouse/index.jsx";
import  './index.less';
const { Panel } = Collapse;
const modeArray = [
    {
        title: '基础图元',
        mode: [
            {
                title: '墙壁',
                image: qiangmian,
                type: 'wall',
            },
            {
                title: '折角墙壁',
                image: cornerWall,
                type: 'wallBend',
            },
            {
                title: '卫生间',
                image: meshToilet,
                type: 'toilet'
            }
        ]
    },
    {
        title: '模型图元',
        mode: [
            {
                title: '马桶',
                image: toilet,
                src: '/toilet/scene.gltf',
                iconShow: true
            },
            {
                title: '小便池',
                image: urine,
                src: '/urine/scene.gltf',
                iconShow: true
            },
            {
                title: '洗手台',
                image: basin,
                src: '/basin/scene.gltf',
                iconShow: true
            }
        ]
    }
]
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const ToolBar = (props) => {
    const { setCanvasArray, canvasArray, GL } = props || {}
    //  eslint-disable-next-line
    const { camera: cameraGL, scene, gl } = GL || {}
    const [mouseData, setMouseData] = useState(0)
    // 鼠标放开
    const handleMouseUp = (e, item) => {
        let worldPos = new THREE.Vector3()
        const { src } = item || {}
        const { clientX, clientY } = e || {} //  鼠标放开坐标
        pointer.x = ( clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( pointer, cameraGL );
        const intersects = raycaster.intersectObject(scene.getObjectByName('planeHelper'), false );
        if ( intersects.length > 0 ) {
            worldPos.copy(intersects[0]?.point)          
        }
        worldPos.y = 0
        setCanvasArray({
            ...item,
            position: worldPos,
            modeType: src && 'gltf',
            modeId: `c_s_${canvasArray.length + 1}`
        })
        setMouseData(null)
    }
    // 单击添加模具 坐标默认[0,0,0]
    //  eslint-disable-next-line
    const handleClickMode = (item) => {
        const { src } = item || {}
        setCanvasArray({
            ...item,
            position: [0, 0, 0],
            modeType: src && 'gltf',
            modeId: `c_s_${canvasArray.length + 1}`
        })
    }
    return (<>
        <Collapse className="tool_bar" activeKey={[0,1]}>
            {
                modeArray.map((item, index) => {
                    const { title, mode } = item || {}
                    return <Panel header={title} key={index} collapsible="disabled" className="tool_bar_panel">
                        <Row className="tool_bar_item">
                            {mode && mode.map((modeItem, index) => {
                                const { title: modeTitle, image: modeImage } = modeItem || {}
                                return <Col
                                    span={8}
                                    key={index}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        const { clientX, clientY } = e || {}
                                        setMouseData({
                                            data: modeItem,
                                            x: clientX,
                                            y: clientY
                                        })
                                    }} 
                                    className="tool_bar_item_col"
                                >
                                    <img alt={modeTitle} src={modeImage} />
                                    <p className="title">{modeTitle}</p>
                                </Col>
                            })}
                        </Row>
                    </Panel>
                })
            }
        </Collapse>
        {
            mouseData?.data && <Mouse handleUp={(e) => mouseData?.data && handleMouseUp(e, mouseData?.data)} setMouseData={setMouseData} data={mouseData?.data} x={mouseData?.x} y={mouseData?.y}>
                {({x, y}) => (
                    <img
                        className="mouse_image"
                        style={{
                            top: y - 20,
                            left: x - 20
                        }}
                        src={mouseData && mouseData?.data?.image}
                        alt={mouseData && mouseData?.data?.title}
                    />
                )}
            </Mouse>
        }
    </>)
}

export  default ToolBar;