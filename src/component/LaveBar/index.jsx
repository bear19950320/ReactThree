import { useControls, folder, Leva } from 'leva'

const LevaPanle = (props) => {
    const { title, uuid, position } = props || {}
    console.log(uuid, '===uuid', position)
    useControls({
        'uuid': { value: uuid || '', disabled: true},
        '名称': {value: title || '正方形', onChange: v => console.log(v, '===标题')},
        'mode': { value: 'translate', options: ['translate', 'rotate', 'scale'] },
        '大小': {
            value: {
                width: 200,
                height: 200,
                z: 20
            }
        },
        '坐标': {value: position, onChange: v => console.log('坐标: ', v)},
        '旋转': {
            value: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        '模型': {
            value: 'meshNormalMaterial',
            options: {
                '法线网格材质': 'meshNormalMaterial', 
                '基础网格材质': 'meshBasicMaterial'
            },
            onChange: value => {
                console.log(value, '====模型类型')
            }
        },
        'color': { value: '#d3d5bd', onChange: v => {}},
        // '背景配置': folder({
        //         '网格颜色': {value: debugColor, onChange: v => setDebugColor(v)},
        //         '颜色': { value: canvasColor, onChange: v => setCanvasColor(v)}
        //     },
        //     { collapsed: true, color: '#8c92a4' }
        // )
    })
    return <Leva titleBar={{title: "工具栏操作"}} hideCopyButton />
}
export default LevaPanle