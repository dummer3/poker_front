import { Header } from "./Header";
import * as API from "./ApiGoogle";
import { useContext, useEffect, useState } from "react";
import { QuestionsContext, QuizContext, ReviewContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReactStars from "react-rating-stars-component";
import { Quiz_t } from "../types/types";
import { Overlay, ScenarioOverlay } from "./Overlay";

const SubMenu = ({ col, title, content, logo, subTitle }) => <div className={`SubMenu bg-subMenu ${col} px-0 d-flex flex-column`}>
    <div className="header d-flex align-items-start">
        <p className={`h1 bi ${logo} me-3 bg-teal px-2 py-1`} />
        <h2 className="d-flex justify-content-between align-self-center w-100">{title} {subTitle}</h2>
    </div>
    {content}
</div>

SubMenu.defaultProps = {
    col: "",
    title: "",
    content: "",
    logo: "",
    subTitle: "",
}

/**
 * function to create the home page
 * @returns {HTMLElement} - The home page
 */
export const Home = () => {
    const navigate = useNavigate();
    const [, setQuestions] = useContext(QuestionsContext);
    const [quiz, setQuiz] = useContext(QuizContext);
    const [, setReview] = useContext(ReviewContext);
    const [createdQuiz, setCreatedQuiz] = useState<Quiz_t[]>([]);
    const [scenarios, setScenarios] = useState([]);
    const [errors, setErrors] = useState({ positions: "", scenarios: "", situation: "", star_rating: "", questions: "", name: "" });
    const [selectedQuiz, setSelectedQuiz] = useState(-1);
    const [sortType, setSortType] = useState(0);
    const [waitCreate, setWaitCreate] = useState(false);
    const [waitQuiz, setWaitQuiz] = useState(false);

    useEffect(() => {
        API.getQuiz().then(setCreatedQuiz)
        document.title = "Home";
    }, []);

    useEffect(() => {
        if (quiz.situation !== null && quiz.positions != null)
            API.getScenarios({ positions: quiz.positions, situation: quiz.situation }).then(setScenarios);
    }, [quiz.situation, quiz.positions])

    useEffect(() => {
        setCreatedQuiz(created => {
            let temp = created.slice();
            temp.sort((q1, q2) => {
                switch (sortType) {
                    case 1: return q1.nbrQuestion - q2.nbrQuestion;
                    case 2: return q2.nbrQuestion - q1.nbrQuestion;
                    case 3: return q1.difficultyMin - q2.difficultyMin;
                    case 4: return q2.difficultyMax - q1.difficultyMax;
                    case 5: return q1.quizName.localeCompare(q2.quizName);
                    case 6: return q2.quizName.localeCompare(q1.quizName);
                    case 7: return q1.positions.toString().localeCompare(q2.positions.toString());
                    case 8: return q2.positions.toString().localeCompare(q1.positions.toString());
                    case 9: return q1.scenarios.toString().localeCompare(q2.scenarios.toString());
                    case 10: return q2.scenarios.toString().localeCompare(q1.scenarios.toString());
                    case 11: return q1.situation.localeCompare(q2.situation);
                    default: return q2.situation.localeCompare(q1.situation);
                }
            }); return temp;
        })
    }, [sortType])

    const verifyForm = () => {
        let tempo = { ...errors };
        tempo.star_rating = quiz.difficultyMin < 0 || quiz.difficultyMax < 0 ? "Enter a difficulty range" : "";
        tempo.situation = quiz.situation.length === 0 ? "Choose one situation" : "";
        tempo.scenarios = quiz.scenarios.length === 0 && quiz.situation !== "Opening" ? "Choose some scenarios" : "";
        tempo.positions = quiz.positions.length === 0 ? "Choose some positions" : "";
        tempo.questions = quiz.nbrQuestion < 0 ? "Choose a number" : "";
        tempo.name = quiz.quizName === "" ? "Enter a name for this quiz" : "";
        setErrors(tempo);

        return !Object.keys(tempo).some(k => tempo[k])
    }
    const submit = (e) => {
        e.preventDefault();
        if (verifyForm()) {
            setWaitCreate(true);
            API.saveQuiz(quiz).then(() => API.getQuiz()).then((value) => { setCreatedQuiz(value); setWaitCreate(false); });
        }
    }

    return (
        <div className="Home">
            <Header title="Quiz" />
            <div className="grid white mx-2">
                <div className="row gx-0">
                    <SubMenu col="col-4" logo="bi-plus-circle" title="CREATE QUIZ" content={
                        <div className="content">
                            <form className="d-inline-flex flex-column flex-wrap align-items-center w-100" onSubmit={submit}>

                                <div className="row mx-2">
                                    <label htmlFor="difficulty_min" className="w-50 text-start">
                                        Difficulty Min :
                                        <ReactStars
                                            name="stars_min"
                                            key={`stars_${quiz.difficultyMin}`}
                                            value={quiz.difficultyMin / 2}
                                            starRatedColor="yellow"
                                            onChange={(value: number) => {
                                                let temp = { ...quiz }; temp.difficultyMin = value * 2;
                                                temp.difficultyMax = Math.max(temp.difficultyMax, temp.difficultyMin); setQuiz(temp);
                                            }}
                                            numberOfStars={5}
                                            size={30}
                                            isHalf={true}
                                        />
                                    </label>
                                    <label htmlFor="difficulty_max" className="w-50 text-start">
                                        Difficulty Max :

                                        <ReactStars
                                            key={`stars_${quiz.difficultyMax}`}
                                            name="stars_max"
                                            value={quiz.difficultyMax / 2}
                                            starRatedColor="yellow"
                                            onChange={(value: number) => {
                                                let temp = { ...quiz }; temp.difficultyMax = value * 2;
                                                temp.difficultyMin = Math.min(temp.difficultyMax, temp.difficultyMin); setQuiz(temp);
                                            }}
                                            numberOfStars={5}
                                            size={30}
                                            isHalf={true}
                                        />
                                    </label>
                                    {errors.star_rating && <div className="bg-white black px-1 w-50 m-2">{errors.star_rating}</div>}


                                    <label htmlFor="nbr_question" className="w-50">
                                        <div>Number of question :</div>
                                        <input className="w-75" type="number" min={1} max={20} placeholder={"how many questions ?"}
                                            onChange={(e) => { let temp = { ...quiz }; temp.nbrQuestion = e.target.value; setQuiz(temp); }} />
                                        {errors.questions && <div className="bg-white black px-1 mt-2">{errors.questions}</div>}
                                    </label>
                                </div>


                                <Overlay title={"Situations"} labels={["Opening", "3Bet", "4Bet", "5Bet"]} set={(checks, temp) => {
                                    console.log(Object.keys(checks).find(key => checks[key] && checks[key] === true)); temp.situation = Object.keys(checks).find(key => checks[key] && checks[key] === true);
                                }} />
                                {errors.situation && <div className="bg-white black px-1">{errors.situation}</div>}

                                <Overlay title={"Hero position"} labels={["UTG", "HJ", "CO", "BTN", "SB", "BB"]} set={(checks, temp) => {
                                    temp.positions = []; Object.keys(checks).filter(key => checks[key]).forEach((key) => { temp.positions.push(key) })
                                }} />
                                {errors.positions && <div className="bg-white black px-1">{errors.positions}</div>}

                                {quiz.situation !== "Opening" && <ScenarioOverlay title={"Vilains Positions"} scenarios={scenarios} />}
                                {errors.scenarios && <div className="bg-white black px-1">{errors.scenarios}</div>}

                                <label htmlFor="quiz_name" className="w-100">
                                    <div>Quiz name :</div>
                                    <input className="w-75" type="text" value={quiz.quizName} maxLength={200} placeholder={"Enter quiz name"}
                                        onChange={(e) => { let temp = { ...quiz }; temp.quizName = e.target.value; setQuiz(temp); }} />
                                    {errors.name && <div className="bg-white black px-1 w-50 mx-auto mt-2">{errors.name}</div>}
                                </label>

                                {waitCreate ? <div>Please wait</div> :
                                    <input type="submit" className="btn btn-primary my-2" value="CREATE QUIZ" />}
                            </form >

                        </div>
                    } />

                    <SubMenu col="col-8 ms-2 h-50" logo="bi-play-circle-fill" title="CREATED QUIZ" subTitle={<div className="d-flex align-items-center ml-auto">
                        {selectedQuiz !== -1 && (waitQuiz ? <div>Quiz loading, please wait</div> :
                            <button className="btn btn-primary me-5 py-1 px-3"
                                onClick={() => {
                                    setReview([]);
                                    setWaitQuiz(true);
                                    API.GetQuestions(createdQuiz[selectedQuiz])
                                        .then(value => { setQuestions(value); setQuiz(createdQuiz[selectedQuiz]); setWaitQuiz(false); navigate("/quiz"); })
                                }}
                            > Play it</button>)}


                        <h5 className="me-3">Length:{createdQuiz.length}</h5> </div>}

                        content={
                            <div className="content black bg-white m-2 ">
                                <div className="row separator" style={{ overflowX: "hidden", overflowY: "auto", scrollbarGutter: "stable" }}>
                                    <div className="col-1"> Index </div>
                                    <div className={`col-3 bi ${sortType === 5 ? "bi-caret-up-fill" : sortType === 6 ? "bi-caret-down-fill" : ""}`}
                                        onClick={() => setSortType(sortType === 5 ? 6 : 5)}> Name </div>
                                    <div className={`col-2 bi ${sortType === 11 ? "bi-caret-up-fill" : sortType === 12 ? "bi-caret-down-fill" : ""} px-1`}
                                        onClick={() => setSortType(sortType === 11 ? 12 : 11)}> Situation </div>
                                    <div className={`col-2 bi ${sortType === 7 ? "bi-caret-up-fill" : sortType === 8 ? "bi-caret-down-fill" : ""} px-1`}
                                        onClick={() => setSortType(sortType === 7 ? 8 : 7)}> Hero </div>
                                    <div className={`col-2 bi ${sortType === 9 ? "bi-caret-up-fill" : sortType === 10 ? "bi-caret-down-fill" : ""} px-1`}
                                        onClick={() => setSortType(sortType === 9 ? 10 : 9)}> Adversity </div>
                                    <div className={`col-1  bi ${sortType === 1 ? "bi-caret-up-fill" : sortType === 2 ? "bi-caret-down-fill" : ""} px-1`}
                                        onClick={() => setSortType(sortType === 1 ? 2 : 1)}> Number </div>
                                    <div className={`col-1 bi ${sortType === 3 ? "bi-caret-up-fill" : sortType === 4 ? "bi-caret-down-fill" : ""} px-1`}
                                        onClick={() => setSortType(sortType === 3 ? 4 : 3)}> Difficulty </div>
                                </div>
                                <div className="mx-0" style={{ height: "50vh", overflowY: "auto", overflowX: "hidden", scrollbarGutter: "stable" }}>
                                    {createdQuiz.map((x: Quiz_t, index: number) => {
                                        return (<div key={`quiz_${index}`} className={`row separator text-center align-middle hover ${selectedQuiz === index ? "bg-black white" : ""}`}
                                            onClick={() => setSelectedQuiz(index)}
                                            onDoubleClick={() => {
                                                setReview([]); setSelectedQuiz(index); setWaitQuiz(true);
                                                API.GetQuestions(createdQuiz[selectedQuiz]).then(value => { setQuestions(value); setQuiz(createdQuiz[selectedQuiz]); setWaitQuiz(false); navigate("/quiz"); })
                                            }}>
                                            <div className="col-1 d-inline-flex flex-column align-items-center justify-content-center">{index + 1}</div>
                                            <div className="col-3 d-inline-flex flex-column align-items-center justify-content-center">  {x.quizName}</div>
                                            <div className="col-2 d-inline-flex flex-column align-items-center justify-content-center">  {x.situation}</div>
                                            <div className="col-2 d-inline-flex flex-column align-items-center justify-content-center">  {x.positions.map((el) => <div key={el}>{el}</div>)}</div>
                                            <div className="col-2 d-inline-flex flex-column align-items-center justify-content-center">  {x.scenarios.map((el) => <div key={el}>{el}</div>)}</div>
                                            <div className="col-1 d-inline-flex align-items-center justify-content-center">  {x.nbrQuestion} </div>
                                            <div className="col-1 d-inline-flex align-items-center justify-content-center">  [{x.difficultyMin}-{x.difficultyMax}] </div>                                   </div>)
                                    })}
                                </div>
                            </div>}
                    />
                </div>
                <div className="row mt-2 gx-0">
                    <SubMenu col="col-4" logo="bi-plus-circle" title="STATISTIC" content={<></>} />
                    <SubMenu col="col-8 ms-2" logo="bi-plus-circle" title="HISTORIC" content={<></>} />
                </div>
            </div>
        </div >
    );
} 