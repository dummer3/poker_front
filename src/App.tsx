
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import './extend.css';
import { Header } from './Pages/Header.js';
//import { Home } from './Pages/Home.js';
import { Quizz } from './Pages/Quizz';
import { Api } from './Pages/ApiGoogle';

function App() {

  return (
    <div className="App">
      <Header title="Quizz" />
      <Quizz position={0} />
      <Api />
    </div>

  );
}

export default App;
