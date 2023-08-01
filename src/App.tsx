
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import './extend.css';
import { Question_t, Quiz_t, Revue_t } from './types/types';
import { Home } from './Pages/Home';
import { Quiz } from './Pages/Quiz';
import { Callback, WaitForAuthentification } from './Pages/Callback';
import { QuestionsContext, QuizContext, ReviewContext } from './context/QuizContext';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Review } from './Pages/Review';

function App() {
  const [quiz, setQuiz] = useState<Quiz_t>({ nbrQuestion: -1, positions: [], situation: "", scenarios: [], difficultyMax: -1, quizName: "", difficultyMin: -1 });
  const [questions, setQuestions] = useState<Question_t[]>([{ hand: "AAo", difficulty: -1, R: 0, F: 0, C: 0, RC: 0, CF: 0, RF: 0, Correct: "R", situation: "none", position: "none", scenario: "none" }]);
  const [revueInfo, setRevueInfo] = useState<Revue_t[]>([]);
  return (
    <div className="App">
      <QuizContext.Provider value={[quiz, setQuiz]}>
        <QuestionsContext.Provider value={[questions, setQuestions]}>
          <ReviewContext.Provider value={[revueInfo, setRevueInfo]}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<WaitForAuthentification />} />
                <Route path="/home" element={<Home />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/revue" element={<Review />} />
              </Routes>
            </BrowserRouter>
          </ReviewContext.Provider>
        </QuestionsContext.Provider>
      </QuizContext.Provider>

    </div>
  );
}

export default App;
