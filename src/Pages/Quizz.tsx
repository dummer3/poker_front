import { useRef, useEffect, useState, useMemo } from 'react'
import deck_img from "../img/poker-deck.webp"
import dealer_img from '../img/dealer.webp'
import verso_img from '../img/verso.webp'

import { ValueWithChip } from './Chip'

const VALUE =
{
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
    9: 8,
    10: 9,
    JACK: 10,
    QUEEN: 11,
    KING: 12,
    ACE: 0
}
const SUIT =
{
    CLUB: 0,
    DIAMOND: 1,
    HEART: 2,
    SPADES: 3
}

const POSITION =
{
    UTG: 0,
    "UTG+1": 1,
    "UTG+2": 2,
    BTN: 3,
    BB: 4,
    SB: 5
}

enum ACTION {
    FOLD = "FOLD",
    "CALL/FOLD" = "CALL/FOLD",
    CALL = "CALL",
    "RAISE/CALL" = "RAISE/CALL",
    RAISE = "RAISE",
    "RAISE/FOLD" = "RAISE/FOLD"
}

const ActionColor: { color: string, action: ACTION }[] =
    [
        { color: "red", action: ACTION.FOLD },
        { color: "magenta", action: ACTION['CALL/FOLD'] },
        { color: "blue", action: ACTION.CALL },
        { color: "teal", action: ACTION['RAISE/CALL'] },
        { color: "green", action: ACTION.RAISE },
        { color: "yellow", action: ACTION['RAISE/FOLD'] },
    ]

let Actions = (Object.keys(ACTION) as Array<keyof typeof ACTION>).filter(x => !(parseInt(x) > 0)).map((action) => {
    return (
        <button key={action} className={`btn btn-primary bg-${ActionColor.find(x => x.action === action).color} btn-lg active`}
            onClick={(e) => { console.log(action) }}> {action} </button>);
});


const PlacePlayer = () => {
    let players = [
        { "x": -7, "y": 80 },
        { "x": 3, "y": 10 },
        { "x": 43, "y": -10 },
        { "x": 83, "y": 10 },
        { "x": 93, "y": 80 },
    ];
    return players
}

const PlaceDealerBtn = [
    { "top": "-50%", "left": "70%" },
    { "top": "-30%", "left": "70%" },
    { "top": "-30%", "left": "70%" },
    { "top": "-30%", "left": "-70%" },
    { "top": "-50%", "left": "-70%" },
    { "top": "-120%", "left": "60%" },
]

const ActionInf =
    [
        { "action": ACTION.FOLD, "cut": 25, "color": "grey", "print": "FOLD" },
        { "action": ACTION.CALL, "cut": 80, "color": "red", "print": <b>CALL</b> },
        { "action": ACTION.RAISE, "cut": 80, "color": "red", "print": <b>RAISE</b> }
    ]

const Crop = (deck, key, initialW, initialH, value, suit, info) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const canvasRef = useRef(null);


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
    }, [deck, isLoaded]);

    useEffect(() => {
        if (isLoaded && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.drawImage(deck, value * 92, suit * 134, initialW, initialH, 0, 0, 92, 134);
        }
    });

    return (
        <canvas className={`card ${info.color}-img`} ref={canvasRef} width={92} height={info.cut} key={key} />
    );
};

const Player = (card, x, y, position, action: ACTION, index: number) => {

    const key = `[${x},${y}]}`
    const chips = Math.floor(Math.random() * 300)
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

const randomEnumValue = (enumeration) => {
    const values = Object.keys(enumeration);
    const enumKey = values[2];
    return enumeration[enumKey];
}


export const Quizz = ({ position }) => {
    const deck = useMemo(() => new Image(), []);
    const verso = useMemo(() => new Image(), []);
    useEffect(() => {
        deck.src = deck_img;
        verso.src = verso_img
    })


    const chips = Math.floor(Math.random() * 300)
    let dealer;

    if (position === 3) {
        dealer = <img src={dealer_img} alt='dealer-btn' className="dealer-btn"
            style={PlaceDealerBtn[5]} />
    }


    return (
        <div className="quizz d-flex flex-column">
            <div className="board m-auto my-5">
                <div className='villain inline-layered'>
                    {PlacePlayer().map(
                        ({ x, y }, index) => {
                            return Player(verso, `${x}%`, `${y}%`, (position + index + 1) % 6, randomEnumValue(ACTION), index)
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
                            {Crop(deck, "hero__1", 92, 134, Math.floor(Math.random() * Object.keys(VALUE).length),
                                Math.floor(Math.random() * Object.keys(SUIT).length), { color: "black", cut: 110 })}
                            {Crop(deck, "hero__2", 92, 134, Math.floor(Math.random() * Object.keys(VALUE).length),
                                Math.floor(Math.random() * Object.keys(SUIT).length), { color: "black", cut: 110 }
                            )}
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
            <div className='Answer d-flex justify-content-around mt-5 '>
                {Actions}
            </div>
        </div>

    );
}