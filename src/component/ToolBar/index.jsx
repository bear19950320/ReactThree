import { useState } from "react";
import { Col, Row, Collapse } from 'antd'
import qiangmian from '../../assets/image/qiangmian.png'
import styles from  './index.less'

const { Panel } = Collapse;
const modeArray = [
    {
        title: '基础图元',
        mode: [
            {
                title: '墙壁',
                image: qiangmian
            }
        ]
    }
]
const ToolBar = () => {
    const [ tool, setTool ] = useState('')
    return (<Collapse className="tool_bar">
        {
            modeArray.map((item) => {
                const { title, mode } = item || {}
                return <Panel header={title} key={title} className="tool_bar_panel">
                    <Row className="tool_bar_item">
                        {mode && mode.map((modeItem, index) => {
                            const { title: modeTitle, image: modeImage } = modeItem || {}
                            return <Col span={8} key={index} className="tool_bar_item_col">
                                <img src={modeImage} alt="" />
                                <p className="title">{modeTitle}</p>
                            </Col>
                        })}
                    </Row>
                </Panel>
            })
        }
        
    </Collapse>)
}

export  default ToolBar;