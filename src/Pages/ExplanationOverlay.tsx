import { useEffect, useRef } from "react";
import { Question_t } from "../types/types";

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

const createRangeChart = (range: string[][]) => {
    return <div className="container">
        {range.map((row, r) => {
            return <div className="row my-1" key={`row-${row[0]}`}>
                {row.map((col, c) => { console.log(range[0][c] + "   " + row[0]); const info = ActionInfChoice.find(x => x.abreviation === col); return <div className={`col-2 bg-${info ? info.color : "black"} ${range[0][c] === row[0] && c !== 0 ? "border border-3 border-white" : ""}`} key={`col-${range[0][c]}`}> {col} </div> })}
            </div>
        })}
    </div>
}

export const ExplanationOverlay = (info: { question: Question_t, setExplanation: any, chart: string[][] }) => {


    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, info.setExplanation);

    return <div ref={wrapperRef} className="ExplanationOverlay bg-dark d-flex flex-column white">
        <div className="mx-2">
            <h4 className="">Range Chart</h4>
            {createRangeChart(info.chart)}
        </div>
        <div className="mx-5">
            <h4 className="">Details</h4>
            {ActionInfChoice.filter(infoAct => info.question[infoAct.abreviation] !== undefined).map(infoAct => {
                return <div className="row my-1" key={`row-${infoAct.abreviation}`}>
                    <div className={`col-3 bg-${infoAct.color}`}>{infoAct.abreviation}</div>
                    <div className="col-9">{infoAct.action}: {infoAct.abreviation === info.question.Action ? "" : "-"}
                        {info.question[infoAct.abreviation]} points</div>
                </div>
            })}
        </div>
    </div>
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
