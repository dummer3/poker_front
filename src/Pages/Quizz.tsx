import { useRef, useEffect, useState, useMemo, useContext, ReactElement } from 'react'
import deck_img from "../img/poker-deck.webp"
import dealer_img from '../img/dealer.webp'
import verso_img from '../img/verso.webp'

import { ValueWithChip } from './Chip'
import { QuestionsContext } from '../context/QuizzContext'
import { Question_t } from '../types/types'
import { Header } from './Header'
import { POSITION } from './ScenarioRepresentation'
import { ScenarioRepresentation } from './ScenarioRepresentation'
import { useNavigate } from 'react-router-dom'

/**
 * Value enum for the value of a card.
 * @readonly
 * @private
 * @enum {number}
 */
enum VALUE {
    _2 = 1,
    _3 = 2,
    _4 = 3,
    _5 = 4,
    _6 = 5,
    _7 = 6,
    _8 = 7,
    _9 = 8,
    T = 9,
    J = 10,
    Q = 11,
    K = 12,
    A = 0
}

/**
 * Value enum for the suit of a card.
 * @readonly
 * @private
 * @enum {number}
 */
enum SUIT {
    CLUB = 0,
    DIAMOND = 1,
    HEART = 2,
    SPADES = 3
}


/**
 * Action enum for the basic user action.
 * @readonly
 * @enum {string}
 */
enum ACTION {
    FOLD = "FOLD",
    CALL = "CALL",
    RAISE = "RAISE",
}

/**
 * Multiple_action enum for complex user action.
 * @readonly
 * @enum {string} 
 */
enum MULTIPLE_ACTION {

    "CALL/FOLD" = "CALL/FOLD",
    "RAISE/CALL" = "RAISE/CALL",
    "RAISE/FOLD" = "RAISE/FOLD"
}

/**
 * @var ActionInfChoice - All the action (simple and complex) with the button color and their abreviation
 */
const ActionInfChoice: { color: string, action: string, abreviation: string }[] =
    [
        { color: "red", action: 'FOLD', abreviation: 'F' },
        { color: "magenta", action: 'CALL/FOLD', abreviation: 'CF' },
        { color: "blue", action: 'CALL', abreviation: 'C' },
        { color: "teal", action: 'RAISE/CALL', abreviation: 'RC' },
        { color: "green", action: 'RAISE', abreviation: 'R' },
        { color: "yellow", action: 'RAISE/FOLD', abreviation: 'RF' },
    ]

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

let ActiontoButton = (actions, questions: Question_t[], setScore, setQuestion, score: number, nbrQuestion: number) => (Object.keys(actions) as Array<keyof typeof actions>).filter(x => !(parseInt(x.toString()) > 0)).map((action) => {
    return (
        <button key={action.toString()} className={`btn btn-primary bg-${ActionInfChoice.find(x => x.action === action).color} btn-xs active col mx-3 mb-1 ${questions[nbrQuestion][ActionInfChoice.find(x => x.action === action).abreviation] === undefined ? "disabled" : ""}`}
            onClick={(e) => { TestAnswer(action, questions, setScore, setQuestion, score, nbrQuestion) }}> {action.toString()} </button>);
});


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
export const TestAnswer = (action: any, questions: Question_t[], setScore, setQuestion, score: number, nbrQuestion: number) => {
    const abr = ActionInfChoice.find(x => x.action === action).abreviation;
    if (abr === questions[nbrQuestion].Action) {
        setScore(score + questions[nbrQuestion][abr]);
    }
    else {
        setScore(score - questions[nbrQuestion][abr]);
    }

    setQuestion(nbrQuestion + 1);
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
export const Crop = (deck: HTMLImageElement, key: string, initialW: number, initialH: number, value: number, suit: number, info: { cut: number, color: string }) => {

    // if the crop image in load or not
    const [isLoaded, setIsLoaded] = useState(false);

    // Like a pointer to a new canvas
    const canvasRef = useRef(null);

    // UseEffect to know change the canvas when the deck image is load
    useEffect(() => {
        const onLoad = () => {
            setIsLoaded(true);
        };

        if (deck.complete) {
            onLoad();
        } else {
            deck.addEventListener('load', onLoad);
        }

        return () => {
            deck.removeEventListener('load', onLoad);
        };
    }, [deck, isLoaded, value, suit]);

    // When the image is finaly load and the canvas ready
    useEffect(() => {
        if (isLoaded && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.drawImage(deck, value * 92, suit * 134, initialW, initialH, 0, 0, 92, 134);
        }
    });

    // return the canvas
    return (
        <canvas className={`card ${info.color}-img`} ref={canvasRef} width={92} height={info.cut} key={key} />
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
    // Action choose by this player
    const [action, setAction] = useState(ACTION.FOLD);

    const key = `[${x},${y}]`





    useEffect(() => {
        setChips(Math.floor(bets.find(bet => bet.position === position).bet * 10))

        let max = -Infinity, ind;
        bets.forEach(v => {
            if (max < v.bet) {
                max = v.bet;
                ind = v.position;
            }
        });

        if (situation === "4-Bet" || situation === "5-Bet") {
            ind === position ? setAction(ACTION.RAISE) : setAction(ACTION.FOLD);
        }
        else {
            if ((POSITION[heroPosition as unknown as keyof typeof POSITION] + 4) % 6 < (position + 4) % 6)
                setAction(ACTION.CALL);
            else
                setAction(ind === position ? ACTION.RAISE : ACTION.FOLD);
        }

    }, [bets, heroPosition, position, situation]);

    let dealer;
    const info = ActionInf.find(x => x.action === action);

    if (position === POSITION.BTN) {
        dealer = <img src={dealer_img} alt='dealer-btn' className="dealer-btn"
            style={PlaceDealerBtn[index]} />
    }


    return (
        <div className="player" key={key} style={{ left: x, top: y }}>

            <div className="hold-cards d-flex m-auto justify-content-center">
                {Crop(card, `${key}__1`, 600, 840,
                    0,
                    0, info)}
                {Crop(card, `${key}__2`, 600, 840,
                    0,
                    0, info)}
            </div>
            <div className='container Information bg-black white'>
                <div className="row">
                    <div className="col stackem w-66 text-start ps-1 pe-0">
                        <div>{Object.keys(POSITION).find(
                            key => POSITION[key] === position)}
                        </div>
                        <div> {Math.floor(Math.random() * 100) + ' BB'}</div>
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
            {dealer}
        </div>);
}

/**
 * 
 * @returns {ReactElement} - The quiz page
 */
export const Quizz = () => {

    const [questions] = useContext(QuestionsContext);
    const [nbrQuestion, setNbrQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [heroCard, setHeroCard] = useState({ sr: SUIT.CLUB, sl: 0, vr: VALUE.Q, vl: 0 });
    const [bets, setBets] = useState([{ position: POSITION.SB, bet: 0.5 }, { position: POSITION.BB, bet: 1 },
    { position: POSITION.UTG, bet: 0 }, { position: POSITION.HJ, bet: 0 },
    { position: POSITION.CO, bet: 0 }, { position: POSITION.BTN, bet: 0 }]);
    const navigate = useNavigate();
    const [answered, setAnswered]: [boolean, any] = useState<boolean>(false);

    const deck = useMemo(() => new Image(), []);
    const verso = useMemo(() => new Image(), []);
    useEffect(() => {
        deck.src = deck_img;
        verso.src = verso_img
    })

    let chips;
    let card = [];
    let dealer;

    useEffect(() => {
        if (nbrQuestion === questions.length - 1) {
            console.log("end");
            navigate("/home");
        }
        else {
            setHeroCard(strToHand(questions[nbrQuestion].hand));
            setBets(ScenarioRepresentation(questions[nbrQuestion].scenario));
        }
    }, [nbrQuestion, questions, navigate]);

    if (POSITION.BTN === questions[nbrQuestion].position) {
        dealer = <img src={dealer_img} alt='dealer-btn' className="dealer-btn" style={PlaceDealerBtn[5]} />;
    }

    card = [Crop(deck, "hero__1", 92, 134, heroCard.vl,
        heroCard.sl, { color: "black", cut: 90 }),
    Crop(deck, "hero__2", 92, 134, heroCard.vr,
        heroCard.sr, { color: "black", cut: 90 }
    )]
    chips = Math.floor(bets.find(bet => bet.position === POSITION[questions[nbrQuestion].position.trim() as keyof typeof POSITION])?.bet * 10);
    return (
        <div className="quizz d-flex flex-column">
            <Header title={questions[nbrQuestion].scenario} leftText={questions[nbrQuestion].situation} leftSub={questions[nbrQuestion].position}
                rightText={`Score: ${score}`} rightSub={`Question n°${nbrQuestion + 1}/${questions.length}`} titleSub={`Difficulty: ${questions[nbrQuestion].difficulty}`} />
            <div className="board m-auto my-5">
                <div className='villain inline-layered'>
                    {players.map(
                        ({ x, y }, index) => {
                            return Player(verso, `${x}%`, `${y}%`, (Object.values(POSITION).findIndex((x: string) => questions[nbrQuestion].position.startsWith(x)) + index + 1) % 6, index, bets, questions[nbrQuestion].situation, questions[nbrQuestion].position)
                        }
                    )}
                </div>
                <div className='Hero row mx-auto'>
                    <div className='col-3 align-self-end'> <button className='btn btn-primary  btn-lg '>next</button></div>
                    <div className="col-6 HeroCard">
                        <div className='d-flex white justify-content-center flex-column  align-items-center'>
                            <h3 className=''>{chips / 10 + " BB"}</h3>
                            {ValueWithChip(chips)}
                        </div>
                        <div className="d-flex mx-auto mt-1 justify-content-center">
                            {card[0]}
                            {card[1]}
                        </div>
                        <div className='container Information bg-black white p-auto'>
                            <div className="row">
                                <div>{questions[nbrQuestion].position}
                                </div>
                            </div>
                            <div className='row'>
                                <div> {Math.floor(Math.random() * 100) + ' BB'}</div>
                            </div>
                        </div>
                        {dealer}
                    </div >
                    <div className='col-3 align-self-end'> <button className='btn btn-primary btn-lg '>explanation</button></div>
                </div>

            </div >
            <div className='Answer grid justify-content-around mt-3 mx-5'>
                <div className='row'>
                    {ActiontoButton(ACTION, questions, setScore, setNbrQuestion, score, nbrQuestion)}
                </div>
                <div className='row'>
                    {ActiontoButton(MULTIPLE_ACTION, questions, setScore, setNbrQuestion, score, nbrQuestion)}
                </div>
            </div>
        </div >

    );
}