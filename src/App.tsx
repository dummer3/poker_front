
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import './extend.css';
import { Question_t, Quizz_t } from './types/type';
//import { Home } from './Pages/Home.js';
import { Quizz } from './Pages/Quizz';
import * as API from './Pages/ApiGoogle';
import { QuestionContext, QuizzContext } from './context/QuizzContext';
import { useState } from 'react';

function App() {
  const [quizz, setQuizz] = useState<Quizz_t>();
  const [question, setQuestion] = useState<Question_t>({ hand: "AAo", difficulty: 10, R: 0, F: 0, C: 0, RC: 0, CF: 0, RF: 0, Action: "R" });

  API.Api()

  return (
    <div className="App">
      <button className='btn-primary ' onClick={() => API.FinishLoad()}> LOAD </button >
      <button className='btn-primary ' onClick={() => {
        API.GetQuestions().then((value) => setQuestion(value[0]))
      }}> NEW QUIZZ</button>
      <QuizzContext.Provider value={[quizz, setQuizz]}>
        <QuestionContext.Provider value={[question, setQuestion]}>
          <Quizz position={0} />
        </QuestionContext.Provider>
      </QuizzContext.Provider>
    </div>

  );
}

export default App;
