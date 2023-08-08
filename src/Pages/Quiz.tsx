import { useRef, useEffect, useState, useMemo, useContext, ReactElement } from 'react'
import deck_img from "../img/poker-deck.webp"
import dealer_img from '../img/dealer.webp'
import verso_img from '../img/verso.webp'

import { ValueWithChip } from './Chip'
import { QuestionsContext, QuizContext, ReviewContext } from '../context/QuizContext'
import { Question_t, Revue_t } from '../types/types'
import { Header } from './Header'
import { ScenarioRepresentation } from './ScenarioRepresentation'
import { useNavigate } from 'react-router-dom'
import { ExplanationOverlay, ActionInfChoice } from './ExplanationOverlay'
import { GetExplanation } from "./ApiGoogle";
import { VALUE, SUIT, ACTION, MULTIPLE_ACTION, POSITION } from './Enum'

/**
 * players position on the table
 */
const players = [
    { "x": -7, "y": 75 },
    { "x": 3, "y": 10 },
    { "x": 43, "y": -10 },
    { "x": 83, "y": 10 },
    { "x": 93, "y": 75 },
];

/**
 * Array to display the button depending of the player position 
 */
const PlaceDealerBtn = [
    { "top": "-50%", "left": "70%" },
    { "top": "-30%", "left": "70%" },
    { "top": "-50%", "left": "70%" },
    { "top": "-30%", "left": "-70%" },
    { "top": "-50%", "left": "-70%" },
    { "top": "-120%", "left": "60%" },
]

/**
 * Action Information, with the action, the height and color of the card, and how to display the action
 */
const ActionInf =
    [
        { "action": ACTION.FOLD, "cut": 25, "color": "grey", "print": "FOLD" },
        { "action": ACTION.CALL, "cut": 80, "color": "red", "print": <b>CALL</b> },
        { "action": ACTION.RAISE, "cut": 80, "color": "red", "print": <b>RAISE</b> }
    ]

/**
 * @function isNumber - function to know if a character is a number or not
 * @param {string} char - return if the character is a number or not
 * @returns {boolean} - char is a number or not
 */
function isNumber(char: string) {
    return /^\d$/.test(char);
}

/**
 * 
 * @function randomEnumValue - function to return a random value from an enumeration
 * @param {enum} enumeration - the enumeration to choose from 
 * @returns a random value from this enumeration
 */
const randomEnumValue = (enumeration) => {
    // FILTER BECAUSE KEY => VALUE AND VALUE => KEY IS THE SAME FOR JS
    const values = Object.keys(enumeration).filter(x => !(parseInt(x.toString()) >= 0));
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return enumeration[enumKey];
}


/**
 * @public
 * Converts a hand representation in string format to card information.
 * @param {string} hand - Hand representation in string format (e.g., "K2o" for king/2/other).
 * @returns {{ vl: VALUE, sl: SUIT, vr: VALUE, sr: SUIT }} - Information about two cards.
 */
export const strToHand = (hand: string): { vl: VALUE; sl: SUIT; vr: VALUE; sr: SUIT } => {
    const sl: SUIT = randomEnumValue(SUIT);
    let sr: SUIT;
    if (hand[2] === 's') { sr = sl }
    else { do { sr = randomEnumValue(SUIT) } while (sr === sl); }

    const vl: VALUE = isNumber(hand[0]) ? VALUE["_" + hand[0]] : VALUE[hand[0]];
    const vr: VALUE = isNumber(hand[1]) ? VALUE["_" + hand[1]] : VALUE[hand[1]];
    return { vl: vl, sl: sl, vr: vr, sr: sr };
}

const ActiontoButton = ({ action, question, setScore, nbrQuestion, setAnswered, answered, setRevue }) => {
    const [color, setColor] = useState("grey");

    useEffect(() => setColor(question[ActionInfChoice.find(x => x.action === action).abreviation] === undefined ? "grey" :
        answered ?
            question?.Correct === ActionInfChoice.find(x => x.action === action).abreviation ? "green" :
                "red" :
            ActionInfChoice.find(x => x.action === action).color),
        [answered, question, action, nbrQuestion]);
    return (
        <button key={action.toString()} className={`btn btn-primary btn-xs bg-${color} active col mx-3 mb-1 ${question[ActionInfChoice.find(x => x.action === action).abreviation] === undefined || answered ? "disabled" : ""}`}
            onClick={(e) => {
                TestAnswer(action, question, setScore, setAnswered, setRevue)
            }}> {action.toString()}  </button >);
}


/**
 * @public
 * Function to verify if the user choice is the correct one, and modify accordingly.
 * @param action - action that the user choose.
 * @param {Question_t[]} questions - the list of questions.
 * @param {any} setScore - function to modify the score.
 * @param {any} setQuestion - function to modify the question.
 * @param {number} score - the actual score.
 * @param {number} nbrQuestion - the actual question number.
 * @returns none.
 */
export const TestAnswer = (action: any, question: Question_t, setScore, setAnswered, setReview) => {
    const abr = ActionInfChoice.find(x => x.action === action).abreviation;
    setScore((s: number) => s + question[abr]);

    setReview(revues => {
        let revue: Revue_t = revues.find((revue: Revue_t) => revue.scenario === question.scenario)
        if (revue)
            revue.answers.push({ hand: question.hand.toString(), answer: ActionInfChoice.find(x => x.action === action).abreviation, solution: question.Correct })
        else
            revues.push({ situation: question.situation, scenario: question.scenario, answers: [{ hand: question.hand.toString(), answer: ActionInfChoice.find(x => x.action === action).abreviation, solution: question.Correct }] })
        return revues;
    });

    setAnswered(true);
}



/**
 * @function Crop - Function to crop an card image from a spritesheet and render the result in a canvas
 * @param {HTMLImageElement} deck - image to crop 
 * @param {string} key - key to identify our element for the hook inside it
 * @param initialW - Width to crop 
 * @param initialH - Height to crop
 * @param {VALUE} value - value of the card to crop
 * @param {SUIT} suit - suit of the card to crop
 * @param {{ cut: number, color: number }} info - information about the presentation of the new canvas
 * @returns {HTMLCanvasElement} - canvas of the crop image
 */
export const Crop = (info: { deck: HTMLImageElement, k: string, initialW: number, initialH: number, value: number, suit: number, cut: number, color: string }) => {

    // if the crop image in load or not
    const [isLoaded, setIsLoaded] = useState(false);

    // Like a pointer to a new canvas
    const canvasRef = useRef(null);

    // UseEffect to know change the canvas when the deck image is load
    useEffect(() => {
        const onLoad = () => {
            setIsLoaded(true);
        };

        if (info.deck.complete) {
            onLoad();
        } else {
            info.deck.addEventListener('load', onLoad);
        }

        return () => {
            info.deck.removeEventListener('load', onLoad);
        };
    }, [info.deck, isLoaded, info.value, info.suit]);

    // When the image is finaly load and the canvas ready
    useEffect(() => {
        if (isLoaded && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.drawImage(info.deck, info.value * 92, info.suit * 134, info.initialW, info.initialH, 0, 0, 92, 134);
        }
    });

    // return the canvas
    return (
        <canvas className={`card ${info.color}-img`} ref={canvasRef} width={92} height={info.cut} key={info.k} />
    );
};

/**
 * @param {HTMLImageElement} card - card verso image 
 * @param {string} x - the horizontal position  
 * @param {string} y - the vertical position
 * @param {POSITION} position - position of the player
 * @param {number} index - position of the player on the table
 * @returns 
 */
export const Player = (card: HTMLImageElement, x: string, y: string, position: number, index: number, bets: { position: POSITION, bet: number }[], situation: string, heroPosition: POSITION): ReactElement => {
    // Number of chips on the table
    const [chips, setChips] = useState(0);
    const [stock, setStock] = useState(0);
    // Action choose by this player
    const [action, setAction] = useState(ACTION.FOLD);

    const key = `[${x},${y}]`

    useEffect(() => {
        setChips(Math.floor(bets.find(bet => bet.position === position).bet * 10))
        setStock(100 - bets.find(bet => bet.position === position).bet)
        let max = -Infinity, ind: number;
        bets.forEach(v => {
            if (max < v.bet) {
                max = v.bet;
                ind = v.position;
            }
        });

        if (situation === "4Bet" || situation === "5Bet")
            ind === position ? setAction(ACTION.RAISE) : setAction(ACTION.FOLD);
        else {
            if ((heroPosition?.valueOf() + 4) % 6 < (position + 4) % 6)
                setAction(ACTION.CALL);
            else if (situation === "Opening")
                setAction(ACTION.FOLD);
            else
                setAction(ind === position ? ACTION.RAISE : ACTION.FOLD);
        }

    }, [bets, heroPosition, position, situation]);

    const info = ActionInf.find(x => x.action === action);

    return (
        <div className="player" key={key} style={{ left: x, top: y }}>

            <div className="hold-cards d-flex m-auto justify-content-center">
                {<Crop deck={card} k={`${key}__1`} initialW={600} initialH={840}
                    suit={0}
                    value={0}
                    cut={info.cut}
                    color={info.color} />}
                {<Crop deck={card} k={`${key}__2`} initialW={600} initialH={840}
                    suit={0}
                    value={0}
                    cut={info.cut}
                    color={info.color} />}
            </div>
            <div className='container Information bg-black white'>
                <div className="row">
                    <div className="col stackem w-66 text-start ps-1 pe-0">
                        <div>{Object.keys(POSITION).find(
                            key => POSITION[key] === position)}
                        </div>
                        <div> {stock + ' BB'}</div>
                    </div>
                    <div className={`col my-auto bg-grey black w-33 mx-1 p-0 ${info.color}`}>
                        {action !== ACTION.CALL ? info.print : "..."}
                    </div>
                </div>
            </div>
            <div className='d-flex white justify-content-center flex-column align-items-center'>
                <h3 className=''>{chips / 10} BB</h3>
                {ValueWithChip(chips)}
            </div>
            {position === POSITION.BTN && <img src={dealer_img} alt='dealer-btn' className="dealer-btn"
                style={PlaceDealerBtn[index]} />}
        </div>);
}


/**
 * 
 * @returns {ReactElement} - The quiz page
 */
export const Quiz = () => {
    const [questions] = useContext(QuestionsContext);
    const [quiz] = useContext(QuizContext);
    const [nbrQuestion, setNbrQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [heroCard, setHeroCard] = useState({ sr: SUIT.CLUB, sl: 0, vr: VALUE.Q, vl: 0 });
    const [bets, setBets] = useState([{ position: POSITION.SB, bet: 0.5 }, { position: POSITION.BB, bet: 1 },
    { position: POSITION.UTG, bet: 0 }, { position: POSITION.HJ, bet: 0 },
    { position: POSITION.CO, bet: 0 }, { position: POSITION.BTN, bet: 0 }]);

    const [stock, setStock] = useState(0);
    const navigate = useNavigate();
    const [answered, setAnswered]: [boolean, any] = useState<boolean>(false);
    const answeredRef = useRef(answered);
    const [explanation, setExplanation]: [boolean, any] = useState<boolean>(false);
    const [chips, setChips] = useState(0);
    const [cards, setCards] = useState([]);
    const [button, setButton] = useState([]);

    const [question, setQuestion] = useState<Question_t>();
    const questionRef = useRef(question);

    const [review, setReview] = useContext(ReviewContext);

    const deck = useMemo(() => new Image(), []);
    const verso = useMemo(() => new Image(), []);
    useEffect(() => {
        deck.src = deck_img;
        verso.src = verso_img;
        document.title = quiz.quizName;
        window.addEventListener('keydown', keyDownEvent);
        questions.forEach(question => { if (question.situation === "Opening") question.scenarios = question.positions; })
        console.log(review);

        return () => { window.removeEventListener('keydown', keyDownEvent); }
    }, [])

    useEffect(() => {
        answeredRef.current = answered;
    }, [answered]);

    useEffect(() => {
        questionRef.current = question;
    }, [question]);


    const keyDownEvent = (event) => {
        // Check for the specific key you want to bind the action to (e.g., Enter key with keyCode 13)
        switch (event.key) {
            case "e": if (answeredRef.current) setExplanation(exp => !exp); break;
            case " ": if (answeredRef.current) { setAnswered(false); setExplanation(exp => false); setNbrQuestion(nbr => nbr + 1) }; break;
            case "1": if (!answeredRef.current && questionRef.current.CF !== undefined) { TestAnswer(MULTIPLE_ACTION['CALL/FOLD'], questionRef.current, setScore, setAnswered, setReview) } break;
            case "2": if (!answeredRef.current && questionRef.current.RC !== undefined) { TestAnswer(MULTIPLE_ACTION['RAISE/CALL'], questionRef.current, setScore, setAnswered, setReview) } break;
            case "3": if (!answeredRef.current && questionRef.current.RF !== undefined) { TestAnswer(MULTIPLE_ACTION['RAISE/FOLD'], questionRef.current, setScore, setAnswered, setReview) } break;
            case "4": if (!answeredRef.current && questionRef.current.F !== undefined) { TestAnswer(ACTION.FOLD, questionRef.current, setScore, setAnswered, setReview) } break;
            case "5": if (!answeredRef.current && questionRef.current.C !== undefined) { TestAnswer(ACTION.CALL, questionRef.current, setScore, setAnswered, setReview) } break;
            case "6": if (!answeredRef.current && questionRef.current.R !== undefined) { TestAnswer(ACTION.RAISE, questionRef.current, setScore, setAnswered, setReview) } break;
        }
    };

    useEffect(() => {
        if (nbrQuestion === questions.length) {
            navigate("/revue");
        }
        else {
            setQuestion(questions[nbrQuestion]);
        }
    }, [nbrQuestion, questions, navigate]);

    useEffect(() => {
        if (question) {
            setHeroCard(strToHand(question?.hand));
            setBets(ScenarioRepresentation(question?.scenario, question?.situation));
            GetExplanation(question?.hand, question?.scenario, question?.situation).then(result => {
                setChart(result);
            })
            setStock(100 - chips / 10);
        }
    }, [question, chips])

    useEffect(() => {
        setChips(Math.floor(bets.find(bet =>
            bet.position === POSITION[question?.position.trim() as keyof typeof POSITION])?.bet * 10))
    }, [bets, question])

    useEffect(() => {
        if (question)
            setButton([(Object.keys(ACTION) as Array<keyof typeof ACTION>).filter(x => !(parseInt(x.toString()) > 0)).map(action => <ActiontoButton key={`quiz-${quiz.name}-action-${action}`} action={action} question={question} setScore={setScore} nbrQuestion={nbrQuestion} setAnswered={setAnswered} answered={answered} setRevue={setReview} />),
            (Object.keys(MULTIPLE_ACTION) as Array<keyof typeof MULTIPLE_ACTION>).filter(x => !(parseInt(x.toString()) > 0)).map(action => <ActiontoButton key={`action-${action}`} action={action} question={question} setScore={setScore} nbrQuestion={nbrQuestion} setAnswered={setAnswered} answered={answered} setRevue={setReview} />)]);
    }, [question, answered, nbrQuestion, score, setReview]);

    useEffect(() => {
        setCards([<Crop deck={deck} k="hero__1" initialW={92} initialH={134} value={heroCard.vl}
            suit={heroCard.sl} color="black" cut={90} />,
        <Crop deck={deck} k="hero__2" initialW={92} initialH={134} value={heroCard.vr}
            suit={heroCard.sr} color="black" cut={90} />
        ]);
    }, [heroCard, deck])

    const [chart, setChart] = useState([]);

    return (
        <div key={`quiz_${quiz.name}`} className="quiz d-flex flex-column">
            <Header title={question?.scenario.substring(question?.scenario.indexOf(" "), question?.scenario.length)}
                leftText={question?.situation === "OP" ? "Opening" : question?.situation}
                leftSub={question?.position}
                rightText={`Score: ${score}`}
                rightSub={`Question n°${nbrQuestion + 1}/${questions.length}`}
                titleSub={`Difficulty: ${question?.difficulty}`} />
            <div className="board m-auto my-5">
                <div className='villain inline-layered'>
                    {players.map(
                        ({ x, y }, index) => {
                            return Player(verso, `${x}%`, `${y}%`, (Object.values(POSITION).findIndex((x: string) => question?.position.startsWith(x)) + index + 1) % 6, index, bets, question?.situation, POSITION[question?.position])
                        }
                    )}
                </div>
                <div className='Hero row mx-auto'>
                    {answered ? <div className='col-3 align-self-end'> <button className='btn btn-primary  btn-lg' onClick={() => { setAnswered(false); setNbrQuestion(nbrQuestion + 1) }}>NEXT</button></div> : ""}
                    <div className="col-6 HeroCard">
                        <div className='d-flex white justify-content-center flex-column  align-items-center'>
                            <h3 className=''>{chips / 10 + " BB"}</h3>
                            {ValueWithChip(chips)}
                        </div>
                        <div className="d-flex mx-auto mt-1 justify-content-center">
                            {cards[0]}
                            {cards[1]}
                        </div>
                        <div className='container Information bg-black white p-auto'>
                            <div className="row">
                                <div>{question?.position}
                                </div>
                            </div>
                            <div className='row'>
                                <div> {stock + ' BB'}</div>
                            </div>
                        </div>
                        {POSITION[5] === question?.position && <img src={dealer_img} alt='dealer-btn' className="dealer-btn" style={PlaceDealerBtn[5]} />}
                    </div >
                    {answered ? <div className='col-3 align-self-end'> <button className='btn btn-primary btn-lg' onClick={() => setExplanation(true)}>EXPLANATION</button></div> : ""}
                </div>

            </div >
            <div className='Answer grid justify-content-around mt-3 mx-5'>
                <div className='row'>
                    {button[0]}
                </div>
                <div className='row'>
                    {button[1]}
                </div>
            </div>

            {explanation ? <ExplanationOverlay question={questions[nbrQuestion]} setExplanation={setExplanation} chart={chart} /> : <></>}
        </div >
    );
}