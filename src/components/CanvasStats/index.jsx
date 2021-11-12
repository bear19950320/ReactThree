
import { Stats } from '@react-three/drei';
import './index.less';

// const stats = new Stats();
// const animate = () => {
//     // stats.begin();
// 	// // monitored code goes here
// 	// stats.end();
//     requestAnimationFrame(animate)
//     stats.update();
// }
/**
 * 性能组件
 * @param {*} props 
 * @returns 
 */
const StatsMode = (props) => {
    // requestAnimationFrame(animate)
    // setTimeout(() => {
    //     document.getElementById('canvas_stats') && document.getElementById('canvas_stats').appendChild(stats.dom)
    // }, 100)
    return <Stats showPanel={0} className="canvas_stats"></Stats>
}

export default StatsMode;

