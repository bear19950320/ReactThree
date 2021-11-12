import { Provider } from 'react-redux';
import store from '@/store';
import Edit from '@/components/Edit';

import 'lib-flexible';
import './App.css';

function App() {
  return (
    <Provider store={store} className="App" >
      {/* canvas编辑 */}
      <Edit className="max_box" />
    </Provider>
  );
}

export default App;
