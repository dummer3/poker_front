import { Header } from "./Header";
import * as API from "./ApiGoogle";
import { useContext, useEffect, useState } from "react";
import { QuestionsContext, QuizzContext } from "../context/QuizzContext";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReactStars from "react-rating-stars-component";
import { Quizz_t } from "../types/types";
import { Overlay, ScenarioOverlay } from "./Overlay";

const SubMenu = ({ col, title, content, logo, subTitle }) => <div className={`SubMenu bg-subMenu ${col} px-0 d-flex flex-column`}>
    <div className="header d-flex justify-content">
        <p className={`h1 bi ${logo} me-3 bg-teal px-2 py-1`} />
        <h2 className="d-flex justify-content-start align-self-center w-75">{title}</h2>
        <div className="m-auto">{subTitle}</div>

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
    const [quizz, setQuizz] = useContext(QuizzContext);
    const [createdQuizz, setCreatedQuizz] = useState<Quizz_t[]>([]);
    const [scenarios, setScenarios] = useState([]);
    const [errors, setErrors] = useState({ positions: false, scenarios: false, situations: false, star_rating: false, questions: false });
    const [selectedQuiz, setSelectedQuiz] = useState(-1);

    useEffect(() => {
        API.getQuizz().then(setCreatedQuizz)
    }, []);

    const listofQuizz = createdQuizz.map((x: Quizz_t, index: number) => {
        return (<div key={`quizz_${index}`} className={`row separator text-center align-middle hover ${selectedQuiz === index ? "bg-black white" : ""}`}
            onClick={() => setSelectedQuiz(index)} >
            <div className="col-8 d-inline-flex flex-column align-items-center justify-content-center">  {x.scenarios.map(el => { return <div key={`position_${el}`}> {el} </div> })} </div>
            <div className="col-2 d-inline-flex align-items-center justify-content-center">  {x.nbrQuestion} </div>
            <div className="col-2 d-inline-flex align-items-center justify-content-center">  {x.difficulty} </div>
        </div>);
    });

    useEffect(() => {
        try {
            if (quizz.situations !== null && quizz.positions != null)
                API.getScenarios({ positions: quizz.positions, situations: quizz.situations }).then(setScenarios);
        }
        catch
        {
            console.log("gapi not load");
        }
    }, [quizz.situations, quizz.positions])

    const verifyForm = () => {
        let tempo = { ...errors };
        tempo.star_rating = quizz.difficulty < 0 ? true : false;
        tempo.situations = quizz.situations.length === 0 ? true : false;
        tempo.scenarios = quizz.scenarios.length === 0 ? true : false;
        tempo.positions = quizz.positions.length === 0 ? true : false;
        tempo.questions = quizz.nbrQuestion < 0 ? true : false;
        setErrors(tempo);

        return !Object.keys(tempo).some(k => tempo[k])
    }
    const submit = (e) => {
        console.log("submit");
        e.preventDefault();
        if (verifyForm())
            API.saveQuizz(quizz).then(() => API.getQuizz()).then((value) => { setCreatedQuizz(value); console.log(value) });
    }

    return (
        <div className="Home">
            <Header title="Quizz" />
            <div className="grid white mx-2">
                <div className="row gx-0">
                    <SubMenu col="col-4" logo="bi-plus-circle" title="CREATE QUIZZ" content={
                        <div className="content">
                            <form className="d-inline-flex flex-column flex-wrap align-items-center w-100" onSubmit={submit}>

                                <div className="row">
                                    <label htmlFor="difficulty" className="justify-content w-50 ">
                                        Difficulty :
                                        <ReactStars
                                            required
                                            name="star"
                                            value={0}
                                            starRatedColor="yellow"
                                            onChange={(value: number) => { let temp = { ...quizz }; temp.difficulty = value * 2; setQuizz(temp); }}
                                            numberOfStars={5}
                                            size={30}
                                            isHalf={true}
                                        />
                                        {errors.star_rating && <div className="bg-white black px-1">{"Choose a difficulty"}</div>}
                                    </label>

                                    <label htmlFor="nbr_question" className="w-50">
                                        <div>Number of question :</div>
                                        <input className="w-75" type="number" min={1} max={50} placeholder={"how many questions ?"}
                                            onChange={(e) => { let temp = { ...quizz }; temp.nbrQuestion = e.target.value; setQuizz(temp); }} />
                                        {errors.questions && <div className="bg-white black px-1">{"Choose how many"}</div>}
                                    </label>
                                </div>


                                <Overlay title={"situations"} labels={["OP", "3-Bet", "4-Bet", "5-Bet"]} set={(checks, temp) => {
                                    temp.situations = []; Object.keys(checks).filter(key => checks[key]).forEach((key) => { temp.situations.push(key) })
                                }} />
                                {errors.situations && <div className="bg-white black px-1">{"Choose some situations"}</div>}

                                <Overlay title={"positions"} labels={["UTG", "HJ", "CO", "BTN", "SB", "BB"]} set={(checks, temp) => {
                                    temp.positions = []; Object.keys(checks).filter(key => checks[key]).forEach((key) => { temp.positions.push(key) })
                                }} />
                                {errors.positions && <div className="bg-white black px-1">{"Choose some positions"}</div>}

                                <ScenarioOverlay title={"scenarios"} scenarios={scenarios} />
                                {errors.scenarios && <div className="bg-white black px-1">{"Choose scenarios"}</div>}

                                <input type="submit" className="btn btn-primary my-2" value="CREATE QUIZZ" />
                            </form >
                        </div>
                    } />






                    <SubMenu col="col-8 ms-2 h-50" logo="bi-play-circle-fill" title="CREATED QUIZZ" subTitle={selectedQuiz !== -1 &&
                        <button className="btn btn-primary me-3 py-1 px-3 " onClick={() => { API.GetQuestions(createdQuizz[selectedQuiz]).then(value => { setQuestions(value); setQuizz(createdQuizz[selectedQuiz]); navigate("/quiz"); }) }}> Play it</button>}

                        content={
                            <div className="content black bg-white m-2 ">
                                <div className="row separator" style={{ overflowX: "hidden", overflowY: "auto", scrollbarGutter: "stable" }}>
                                    <div className="col-8"> Scenarios </div>
                                    <div className="col-2"> Number </div>
                                    <div className="col-2"> Difficulty </div>
                                </div>
                                <div className="mx-0" style={{ height: "50vh", overflowY: "auto", overflowX: "hidden", scrollbarGutter: "stable" }}>
                                    {listofQuizz}
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