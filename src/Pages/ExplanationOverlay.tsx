import { useEffect, useRef } from "react";
import { Question_t } from "../types/types";


export const VALUE = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "T": 10,
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14
}

/**
 * @var ActionInfChoice - All the action (simple and complex) with the button color and their abreviation
 */
export const ActionInfChoice: { color: string, action: string, abreviation: string }[] =
    [
        { color: "red", action: 'FOLD', abreviation: 'F' },
        { color: "magenta", action: 'CALL/FOLD', abreviation: 'CF' },
        { color: "blue", action: 'CALL', abreviation: 'C' },
        { color: "teal", action: 'RAISE/CALL', abreviation: 'RC' },
        { color: "green", action: 'RAISE', abreviation: 'R' },
        { color: "yellow", action: 'RAISE/FOLD', abreviation: 'RF' },
    ]


const HandCell = (range: string[][], hand: string, row: number, col: number) => {
    if (hand[2] === "s") return range[row][0] === hand[0] && range[0][col] === hand[1];
    else return range[row][0] === hand[1] && range[0][col] === hand[0];

}

const sameSuit = (range: string[][], row: number, col: number) => {
    return VALUE[range[row][0]] <= VALUE[range[0][col]] || row === 0 || col === 0 ? "" : "bd-circle";
}

const createRangeChart = (range: string[][], hand: string) => {
    return <div className="container">
        {range.map((row, r) => {
            return <div className="row my-1" key={`row-${row[0]}`}>
                {row.map((col, c) => {
                    const info = ActionInfChoice.find(x => x.abreviation === col);
                    return <div className={`col-2 bg-${info ? info.color : "black"} ${sameSuit(range, r, c)} 
                        ${HandCell(range, hand, r, c) ? "bd-black " : range[0][c] === row[0] && c !== 0 ? "bd-white" : ""}`}
                        key={`col-${range[0][c]}`}> {col} </div>
                })}
            </div>
        })}
    </div>
}

const createSuitChart = (range: string[][], hand: string) => {
    return <div className="container my-3">
        {range.map((row, r) => {
            return <div className="row my-1 black" key={`row-${row[0]}`}>
                {row.map((col, c) => {
                    return <div className={`col-2 ${r === 0 || c === 0 ? "bg-black white" : VALUE[range[r][0]] <= VALUE[range[0][c]] ? "bg-suit" : "bg-suit-n bd-circle"} 
                        ${HandCell(range, hand, r, c) ? "bd-black" : range[0][c] === row[0] && c !== 0 ? "bd-white bg-pair " : ""}`}
                        key={`col-${range[0][c]}`}> {r === 0 || c === 0 ? col : VALUE[range[r][0]] === VALUE[range[0][c]] ? "P" : VALUE[range[r][0]] <= VALUE[range[0][c]] ? "O" : "S"} </div>
                })}
            </div>
        })}
    </div>
}


export const ExplanationOverlay = (info: { question: Question_t, setExplanation: any, chart: string[][] }) => {


    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, info.setExplanation);

    return <div ref={wrapperRef} className="ExplanationOverlay bg-dark d-flex flex-column white xxs-font">
        <div className="mx-2">
            <h4 className="">Range Chart</h4>
            {createRangeChart(info.chart, info.question.hand)}
            {createSuitChart(info.chart, info.question.hand)}
        </div>

        <div className="mx-auto" style={{ width: "88%" }}>
            <h4>Details</h4>
            <div className="d-flex flex-row">
                <div className="me-3 col-6">
                    {ActionInfChoice.filter(infoAct => info.question[infoAct.abreviation] !== undefined).map(infoAct => {
                        return <div className="row mb-2" key={`row-${infoAct.abreviation}`}>
                            <div className={`col-3 bg-${infoAct.color}`}>{infoAct.abreviation}</div>
                            <div className="col-9">{infoAct.action}: {infoAct.abreviation === info.question.Action ? info.question.difficulty : `-${info.question[infoAct.abreviation]}`} points</div>
                        </div>
                    })}
                </div>
                <div className="col-6">
                    <div className="row mb-2">
                        <div className="col-3 bd-black"></div>
                        <div className="col-9"> Actual Hand ({info.question.hand})</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-3 bd-white"></div>
                        <div className="col-9"> Pair </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-3 bg-suit-n"></div>
                        <div className="col-9"> Different suits </div>
                    </div>
                    <div className="row">
                        <div className="col-3 bg-suit"></div>
                        <div className="col-9"> Same suit </div>
                    </div>
                </div>
            </div>
        </div>
    </div >
}



/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, setOverlay) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setOverlay(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, setOverlay]);
}
