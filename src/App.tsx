
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import './extend.css';

import { Header } from './Pages/Header.js'
//import { Home } from './Pages/Home.js';
import { Quizz } from './Pages/Quizz';

function App() {
  return (
    <div className="App">
      <Header title="Quizz" />
      <Quizz position={3} />
    </div>
  );
}

export default App;
