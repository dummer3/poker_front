
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import './extend.css';
import { Question_t, Quizz_t } from './types/type';
import { Home } from './Pages/Home';
import { Quizz } from './Pages/Quizz';
import * as API from './Pages/ApiGoogle';
import { QuestionsContext, QuizzContext } from './context/QuizzContext';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  const [quizz, setQuizz] = useState<Quizz_t>({ nbrQuestion: 10, position: [], situation: [], scenario: [], difficulty: 10, id: 0 });
  const [questions, setQuestions] = useState<Question_t[]>([{ hand: "AAo", difficulty: 10, R: 0, F: 0, C: 0, RC: 0, CF: 0, RF: 0, Action: "R" }]);

  API.Api()

  return (
    <div className="App">
      <QuizzContext.Provider value={[quizz, setQuizz]}>
        <QuestionsContext.Provider value={[questions, setQuestions]}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/quiz" element={<Quizz position={0} />} />
            </Routes>
          </BrowserRouter>
        </QuestionsContext.Provider>
      </QuizzContext.Provider>
    </div>
  );
}

export default App;
