
import { dequal } from 'dequal/lite';
import { useControls, folder, levaStore, Leva } from 'leva';
let flag = 0
/**
 * 对比key之间的值是否相等 写入Leva 操作栏的数据
 * @param {*} current 
 */
const handleSetLevaStore = (current) => {
    flag++
    const { modeId, position, scale, rotation, title } = current || {}
    const { x: position_x, y: position_y, z: position_z } = position || {}
    const { x: scale_x, y: scale_y, z: scale_z } = scale || {}
    const { _x: rotation_x, _y: rotation_y, _z: rotation_z } = rotation || {}
    const params = {
        'modeId': modeId || '',
        'title': title || '',
        'position': {
            x: position[0] || position_x,
            y: position[1] || position_y,
            z: position[2] || position_z
        },
        'scale': {
            x: scale[0] || scale_x,
            y: scale[1] || scale_y,
            z: scale[2] || scale_z
        },
        'rotation': {
            x: rotation[0] || rotation_x,
            y: rotation[1] || rotation_y,
            z: rotation[2] || rotation_z
        }
    }
    for (const key in params) {
        if (!dequal(params[key], levaStore.get(key))) {
            levaStore.setValueAtPath(key, params[key])
        }
    }
}

const LevaTool = (props) => {
    flag = 0;
    const { GL, setting, setCanvasArray, editModeId } = props || {}
    const { scene } = GL || {}
    const current = scene.getObjectByName(editModeId)
    setTimeout(() => editModeId && handleSetLevaStore(current), 50)
    useControls({
        modeId: { value: '', label: 'ID', disabled: true },
        title: { value: '', label: '名称', onChange: v =>  flag > 1 && setCanvasArray({...current, title: v}) },
        modeSelect: { value: false, label: '可选择' },
        modeEdit: { value: false, label: '可编辑', onChange: v => { } },
        mode: {
            value: props.mode, label: '操作调整', options: {
                '调整位置': 'translate',
                '调整角度': 'rotate',
                '调整大小': 'scale',
            }, onChange: v => props.setMode(v)
        },
        'position': { value: { x: 0, y: 0, z: 0 }, label: '坐标', onChange: v => flag > 1 && setCanvasArray({...current, position: v }) },
        'scale': { value: { x: 0, y: 0, z: 0 }, label: '大小', onChange: v => flag > 1 && setCanvasArray({...current, scale: v }) },
        'rotation': { value: { x: 0, y: 0, z: 0 }, label: '角度', onChange: v => flag > 1 && setCanvasArray({...current, rotation: {
            _x: v.x,
            _y: v.y,
            _z: v.z
        } }) },
        '画布配置': folder({
            '网格颜色': { value: setting.gridColor, hint: '改变网格的线颜色', onChange: v => props.setSetting('gridColor', v) },
            '颜色': { value: setting.canvasColor, onChange: v => props.setSetting('canvasColor', v) },
            "中心线": { value: setting.axesShow, onChange: v => props.setSetting('axesShow', v) },
            "网格线": { value: setting.gridShow, onChange: v => props.setSetting('gridShow', v) },
            "性能图": { value: setting.statsShow, onChange: v => props.setSetting('statsShow', v) },
        },
            { collapsed: true, color: '#8c92a4' }
        )
    })
    return <Leva titleBar={{ title: '工具栏', filter: { tips: '搜索栏' } }} hideCopyButton />
}

export default LevaTool;