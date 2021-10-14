// import logo from './logo.svg';
import './App.css';

import Box from './component/Box';  //  单个盒子组件
// import GLSL from './component/Gltf';  //  GLS
import Edit from './component/Edit';
import ToolBar from './component/ToolBar'
function App() {
  return (
    <div className="App">
      <ToolBar />
      <Box />
      {/* <GLSL /> */}
      <Edit className="max_box" />
    </div>
  );
}

export default App;
