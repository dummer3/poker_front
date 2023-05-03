import { Header } from "./Header";
import * as API from "./ApiGoogle";
import { useContext, useEffect, useState } from "react";
import { QuestionsContext, QuizzContext } from "../context/QuizzContext";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReactStars from "react-rating-stars-component";
import { Quizz_t } from "../types/type";

const SubMenu = ({ col, title, content, logo }) => <div className={`SubMenu bg-subMenu ${col} px-0 d-flex flex-column`}>
    <div className="header d-flex ">
        <p className={`h1 bi ${logo} me-3 bg-teal px-2 py-1`} />
        <h2 className="d-flex justify-content-center align-self-center w-100">{title}</h2>
    </div>
    {content}
</div>


export const Home = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line 
    const [_, setQuestions] = useContext(QuestionsContext);
    const [quizz, setQuizz] = useContext(QuizzContext);
    const [createdQuizz, setCreatedQuizz] = useState<Quizz_t[]>([]);

    const listofQuizz = createdQuizz.map((x: Quizz_t) => {
        return (<div key={`quizz_${x.id}`} className="row separator">
            <div className="col">  {x.position} </div>
            <div className="col">  {x.scenario}</div>
            <div className="col">  {x.nbrQuestion} </div>
            <div className="col">  {x.difficulty} </div>
        </div>);
    });
    useEffect(() => {
        //API.getQuizz().then(value => setCreatedQuizz(value));
    }, [createdQuizz])

    return (
        <div className="Home">
            <button className='btn-primary ' onClick={() => API.FinishLoad()}> LOAD </button >
            <button className='btn-primary ' onClick={() => {
                API.GetQuestions().then(value => { setQuestions(value); console.log(value); navigate("/quiz"); })
            }}> NEW QUIZZ</button>
            <Header title="Quizz" />
            <div className="grid white mx-2">
                <div className="row gx-0">
                    <SubMenu col="col-4" logo="bi-plus-circle" title="CREATE QUIZZ" content={
                        <div className="content">
                            <form onSubmit={(e) => { e.preventDefault(); API.saveQuizz(quizz).then(() => API.getQuizz()).then((value) => setCreatedQuizz(value)); }}>

                                <label htmlFor="difficulty" className=" d-inline-flex flex-column justify-content center ">
                                    Difficulty :
                                    <ReactStars
                                        value={0}
                                        starRatedColor="yellow"
                                        onChange={(value: number) => { let temp = { ...quizz }; temp.difficulty = value * 2; setQuizz(temp); }}
                                        numberOfStars={5}
                                        size={30}
                                        isHalf={true}
                                    />
                                </label>

                                <label htmlFor="nbr_question" className="w-100">
                                    <div>Number of question :</div>
                                    <input required type="number" min={0} className="col-6" max={50} placeholder={"how many questions ?"}
                                        onChange={(e) => { let temp = { ...quizz }; temp.nbrQuestion = e.target.value; setQuizz(temp); }} />
                                </label>

                                <input type="submit" className="btn btn-primary my-2" value="CREATE QUIZZ" />
                            </form >
                        </div>
                    } />

                    <SubMenu col="col-8 ms-2" logo="bi-plus-circle" title="CREATED QUIZZ" content={<div className="content black bg-white m-2" style={{ height: "200px", overflowY: "auto", overflowX: "hidden" }}>
                        <div className="row separator">
                            <div className="col"> Position </div>
                            <div className="col"> Scenario</div>
                            <div className="col"> Number </div>
                            <div className="col"> Difficulty </div>
                        </div>
                        {listofQuizz}
                    </div>} />
                </div>
                <div className="row mt-2 gx-0">
                    <SubMenu col="col-4" logo="bi-plus-circle" title="STATISTIC" content={<></>} />
                    <SubMenu col="col-8 ms-2" logo="bi-plus-circle" title="HISTORIC" content={<></>} />
                </div>
            </div>
        </div>
    );
} 