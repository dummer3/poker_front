import { Header } from "./Header";
import * as API from "./ApiGoogle";
import { useContext } from "react";
import { QuestionsContext } from "../context/QuizzContext";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line 
    const [_, setQuestions] = useContext(QuestionsContext);
    return (
        <div className="Home">
            <button className='btn-primary ' onClick={() => API.FinishLoad()}> LOAD </button >
            <button className='btn-primary ' onClick={() => {
                API.GetQuestions().then(value => { setQuestions(value); console.log(value); navigate("/quiz"); })
            }}> NEW QUIZZ</button>
            <Header title="Quizz" />
            <div className="container white .justify-content-around">
                <div className="row">
                    <div className="bg-black col-4 "> CREATE QUIZ</div>
                    <div className="bg-black col-8 "> CREATED QUIZ</div>
                </div>
                <div className="row">
                    <div className="bg-black col-4 "> STATISTIC </div>
                    <div className="bg-black col-8 "> HISTORIC </div>
                </div>
            </div>
        </div>
    );
} 