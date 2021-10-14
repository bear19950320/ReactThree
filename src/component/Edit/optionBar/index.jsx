import { useControls, folder } from 'leva'

export const toolBar = () => (<>操作</>)
//  ({setCanvasColor, target}) => useControls({
//     'titleBar': {
//         title: '工具栏操作'
//     },
//     'mode': { value: 'translate', options: ['translate', 'rotate', 'scale'] },
//     '模型': {
//         value: 'meshNormalMaterial',
//         options: {
//             '法线网格材质': 'meshNormalMaterial', 
//             '基础网格材质': 'meshBasicMaterial'
//         },
//         onChange: value => {
//             console.log(value, '====模型类型', target)
//         }
//     },
//     'color': { value: '#d3d5bd', onChange: v => setCanvasColor(v)},
//     '背景配置': folder({
//         '颜色': { value: '#d3d5bd', onChange: v => setCanvasColor(v)}
//     }),
    
// })