import { useRef, useEffect, useState, useMemo, useContext } from 'react'
import deck_img from "../img/poker-deck.webp"
import dealer_img from '../img/dealer.webp'
import verso_img from '../img/verso.webp'

import { ValueWithChip } from './Chip'
import { QuestionsContext, QuizzContext } from '../context/QuizzContext'
import { Question_t } from '../types/type'
import { Header } from './Header'

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
 * Position enum for the player position.
 * @readonly
 * @private
 * @enum {number}
 */
enum POSITION {
    UTG = 0,
    "UTG+1" = 1,
    "UTG+2" = 2,
    BTN = 3,
    SB = 4,
    BB = 5
}


/**
 * Action enum for the basic user action.
 * @public
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
 * @private
 * @enum {string}
 */
enum MULTIPLE_ACTION {

    "CALL/FOLD" = "CALL/FOLD",
    "RAISE/CALL" = "RAISE/CALL",
    "RAISE/FOLD" = "RAISE/FOLD"
}

/**
 * All the action (simple and complex) with the button color and their abreviation
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
    { "x": -7, "y": 80 },
    { "x": 3, "y": 10 },
    { "x": 43, "y": -10 },
    { "x": 83, "y": 10 },
    { "x": 93, "y": 80 },
];

/**
 * Array to display the button depending of the player position 
 */
const PlaceDealerBtn = [
    { "top": "-50%", "left": "70%" },
    { "top": "-30%", "left": "70%" },
    { "top": "-30%", "left": "70%" },
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
 * 
 * @param {string} char - return if the character is a number or not
 * @returns {boolean} - char is a number or not
 */
function isNumber(char: string) {
    return /^\d$/.test(char);
}

/**
 * 
 * Function return a random value from an enumeration
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
        <button key={action.toString()} className={`btn btn-primary bg-${ActionInfChoice.find(x => x.action === action).color} btn-lg active col mx-3 my-1 ${questions[nbrQuestion][ActionInfChoice.find(x => x.action === action).abreviation] === undefined ? "disabled" : ""}`}
            onClick={(e) => { testAnswer(action, questions, setScore, setQuestion, score, nbrQuestion) }}> {action.toString()} </button>);
});


/**
 * @public
 * Function to verify if the user choice is the correct one, and modify accordingly.
 * @param {string} action - action that the user choose.
 * @param {Question_t[]} questions - the list of questions.
 * @param {any} setScore - function to modify the score.
 * @param {any} setQuestion - function to modify the question.
 * @param {number} score - the actual score.
 * @param {number} nbrQuestion - the actual question number.
 * @returns none.
 */
export const testAnswer = (action, questions: Question_t[], setScore, setQuestion, score: number, nbrQuestion: number) => {
    const abr = ActionInfChoice.find(x => x.action === action).abreviation;
    console.log(questions);
    if (abr === questions[nbrQuestion].Action) {
        setScore(score + questions[nbrQuestion][abr]);
        console.log("CORRECT ANSWER");
    }
    else {
        setScore(score - questions[nbrQuestion][abr]);
        console.log("WRONG ANSWER");
    }
    setQuestion(nbrQuestion + 1);
}

/**
 * Function to crop an card image from a spritesheet and render the result in a canvas
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


const Player = (card, x, y, position, index: number) => {

    const [chips, setChips] = useState(0);
    const [action, setAction] = useState(ACTION.FOLD);

    const key = `[${x},${y}]}`

    // eslint-disable-next-line
    useEffect(() => {
        setChips(Math.floor(Math.random() * 300))
        setAction(randomEnumValue(ACTION));
    }, []);

    let dealer;
    const info = ActionInf.find(x => x.action === action);

    if (position === 3) {
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
                        <div> {Math.floor(Math.random() * 1000) + '$'}</div>
                    </div>
                    <div className={`col my-auto bg-grey black w-33 mx-1 p-0 ${info.color}`}>
                        {info.print}
                    </div>
                </div>
            </div>
            <div className='d-flex white justify-content-center flex-column align-items-center'>
                <h3 className=''>{chips}</h3>
                {ValueWithChip(chips)}
            </div>
            {dealer}
        </div>);
}

export const Quizz = ({ position }) => {

    const [questions] = useContext(QuestionsContext);
    const [quizz] = useContext(QuizzContext);
    const [nbrQuestion, setNbrQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [heroCard, setHeroCard] = useState({ sr: SUIT.CLUB, sl: 0, vr: VALUE.Q, vl: 0 });

    const deck = useMemo(() => new Image(), []);
    const verso = useMemo(() => new Image(), []);
    useEffect(() => {
        deck.src = deck_img;
        verso.src = verso_img
    })

    const chips = Math.floor(Math.random() * 300)
    let card = [];
    let dealer;

    if (position === 3) {
        dealer = <img src={dealer_img} alt='dealer-btn' className="dealer-btn"
            style={PlaceDealerBtn[5]} />
    }

    useEffect(() => {
        setHeroCard(strToHand(questions[nbrQuestion].hand));
    }, [nbrQuestion, questions]);

    card = [Crop(deck, "hero__1", 92, 134, heroCard.vl,
        heroCard.sl, { color: "black", cut: 110 }),
    Crop(deck, "hero__2", 92, 134, heroCard.vr,
        heroCard.sr, { color: "black", cut: 110 }
    )]

    return (
        <div className="quizz d-flex flex-column">
            <Header title={`Score: ${score}`} leftText="3-bet" leftSub="UTG" rightText={`Question n°${nbrQuestion + 1}/${Math.min(questions.length, quizz.nbrQuestion)}`} />
            <div className="board m-auto my-5">
                <div className='villain inline-layered'>
                    {players.map(
                        ({ x, y }, index) => {
                            return Player(verso, `${x}%`, `${y}%`, (position + index + 1) % 6, index)
                        }
                    )}
                </div>
                <div className='Hero mx-auto'>
                    <div className="mx-auto">
                        <div className='d-flex white justify-content-center flex-column  align-items-center'>
                            <h3 className=''>{chips}</h3>
                            {ValueWithChip(chips)}
                        </div>
                        <div className="hold-cards d-flex mx-auto mt-2 justify-content-center">
                            {card[0]}
                            {card[1]}
                        </div>
                        <div className='container Information bg-black white p-auto'>
                            <div className="row">
                                <div>{Object.keys(POSITION).find(
                                    key => POSITION[key] === position)}
                                </div>
                            </div>
                            <div className='row'>
                                <div> {Math.floor(Math.random() * 1000) + '$'}</div>
                            </div>
                        </div>
                        {dealer}
                    </div >
                </div>

            </div>
            <div className='Answer grid justify-content-around mt-3 mx-5'>
                <div className='row'>
                    {ActiontoButton(ACTION, questions, setScore, setNbrQuestion, score, nbrQuestion)}
                </div>
                <div className='row'>
                    {ActiontoButton(MULTIPLE_ACTION, questions, setScore, setNbrQuestion, score, nbrQuestion)}
                </div>
            </div>
        </div>

    );
}