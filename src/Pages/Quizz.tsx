import { useRef, useEffect, useState, useMemo } from 'react'
import deck_img from "../img/poker-deck.webp"
import chip_img from "../img/chip.webp"

const VALUE =
{
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    JACK: 11,
    QUEEN: 12,
    KING: 13,
    ACE: 14
}
const SUITS =
{

}

const PlacePlayer = (number) => {
    let players = [];
    let angle = 180 / (number - 1) * (Math.PI / 180)

    for (let i = 0; i < number; i++) {
        let x = (Math.cos(angle * i) + 1) * 50 - 7.5,
            y = (1 - Math.sin(angle * i)) * 60;
        players.push({
            x: x + "%",
            y: y + "%"
        })
    }
    return players
}

const chips = [
    { color: "Black", value: 100 },
    { color: "Green", value: 25 },
    { color: "Blue", value: 10 },
    { color: "Red", value: 5 },
    { color: "White", value: 1 }
]

const ChipStack = (stack, stack_index: number) => {
    return (Array.from({ length: stack.value }, (_, index) => {
        return <img src={chip_img} width="30px" className={stack.color + "-token"} key={`stack-${stack_index}-${index}`} style={{
            position: 'relative',
            left: stack_index * 30 + 'px',
            top: -index * 3 + 'px',
        }}></img>
    }))
}



const ValueWithChip = (number: number) => {
    let index = 0;
    let currentChip = [{ color: "Black", value: 0 },
    { color: "Green", value: 0 },
    { color: "Blue", value: 0 },
    { color: "Red", value: 0 },
    { color: "White", value: 0 }];

    while (number > 0) {
        while (chips[index].value > number) {
            index++;
        }

        currentChip[index].value++;
        number -= chips[index].value;
    }

    return (
        <div className='value-bet inline-layered col' style={{ marginLeft: -15 - currentChip.filter(x => x.value !== 0).length * 20 + 'px' }}>
            {currentChip.filter(x => x.value !== 0).map((stack, stack_index) => { return ChipStack(stack, stack_index) })}
        </div>);
}


const Crop = (deck, key) => {
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

            context.drawImage(deck, 0, 0, 92, 134, 0, 0, 92, 134);
        }
    }, [isLoaded]);

    return (
        <canvas className="card" ref={canvasRef} width={92} height={134} key={key} />
    );
};

const Player = (deck, x, y) => {

    const key = `[${x},${y}]}`
    return (
        <div className="player" key={key} style={{ left: x, top: y }}>

            <div className="hold-cards d-flex">
                {Crop(deck, `${key}__1`)}
                {Crop(deck, `${key}__2`)}
            </div>
            <div className='container Information bg-black white'>
                <div className="row">
                    <div className="col stackem w-66">
                        <div> BB</div>
                        <div>1000$</div>
                    </div>
                    <div className="col my-auto bg-grey black w-33 mx-1 p-0">
                        Fold
                    </div>
                </div>
            </div>
            <div className='d-flex white justify-content-center flex-column  align-items-center'>
                <h3 className=''>236</h3>
                {ValueWithChip(236)}
            </div>
        </div>);
}

let Actions = ["Fold", "Call", "Raise"].map((action) => {
    return (
        <button key={action} className='btn btn-primary btn-lg active'
            onClick={(e) => { console.log(action) }}> {action} </button>);
});

export const Quizz = () => {
    const deck = useMemo(() => new Image(), []);
    useEffect(() => {
        deck.src = deck_img;
    }, [])

    return (
        <div className="quizz">
            <div className="board m-auto my-5">
                <div className='vilain inline-layered'>
                    {PlacePlayer(5).map(
                        ({ x, y }) => { return Player(deck, x, y) }
                    )}
                </div>
                <div className='Hero mx-auto mt-5'>
                    <div className="hold-cards d-flex">
                        {Crop(deck, "hero__1")}
                        {Crop(deck, "hero__2")}
                    </div>
                </div>
            </div>
            <div className='Answer d-flex justify-content-around'>
                {Actions}
            </div>
        </div>

    );
}