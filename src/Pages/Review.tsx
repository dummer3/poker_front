import { useContext, useEffect, useState } from "react";
import { GetAllChart } from "./ApiGoogle";
import { Revue_t } from "../types/types";
import { ReviewContext } from "../context/QuizContext";
import { ScatterChart, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Scatter, ResponsiveContainer } from 'recharts';
import { Header } from "./Header";
import { Link } from "react-router-dom";

const VALUE_BACK = {
    A: 1,
    K: 2,
    Q: 3,
    J: 4,
    T: 5,
    9: 6,
    8: 7,
    7: 8,
    6: 9,
    5: 10,
    4: 11,
    3: 12,
    2: 13
}

/**
 * @var ActionInfChoice - All the action (simple and complex) with the button color and their abreviation
 */
export const ActionInfChoice: { color: string, abreviation: string, value: number }[] =
    [
        { color: "red", abreviation: 'F', value: 0 },
        { color: "magenta", abreviation: 'CF', value: 1 },
        { color: "blue", abreviation: 'C', value: 2 },
        { color: "yellow", abreviation: 'RF', value: 3 },
        { color: "teal", abreviation: 'RC', value: 4 },
        { color: "green", abreviation: 'R', value: 5 },
    ]

function HtoRC(hand_in: string) {
    let row = Object.entries(VALUE_BACK).find(([key,]) => { return key === hand_in[0] })[1],
        col = Object.entries(VALUE_BACK).find(([key,]) => { return key === hand_in[1] })[1];

    if (hand_in.length === 3 && hand_in[2] === 'o')
        [row, col] = [col, row];
    return { col: col, row: row }
}

const chartstyle = (revue, c, r) => {
    let answer = revue.answers.find(answer => JSON.stringify(HtoRC(answer.hand.toString())) === JSON.stringify({ col: c, row: r }));

    if (answer)
        return answer.answer === answer.solution ? '' : 'bd-white';
    return 'darker';
}


const CreateRangeChart = ({ revue }) => {
    const [chart, setChart] = useState([]);
    useEffect(() => { GetAllChart(revue.scenario, revue.situation).then(response => setChart(response)) }, [revue]);

    const midX = "55%";
    const midY = "42%";
    const topLabelY = "6%";
    const bottomLabelY = "80%";
    const leftLabelX = "25%";
    const rightLabelX = "90%";

    let userTotalhand = 0,
        userCalled = 0,
        userRaised = 0,
        solutionTotalHand = 0,
        solutionCalled = 0,
        solutionRaised = 0;

    revue.answers.forEach(answer => {
        answer.solution.split('').forEach(c => {
            solutionTotalHand++
            if (c === "C") solutionCalled++;
            else if (c === "R") solutionRaised++
        });
        answer.answer.split('').forEach(c => {
            userTotalhand++;
            if (c === "C") userCalled++;
            else if (c === "R") userRaised++
        });
    });

    let userX = (userCalled + userRaised) / userTotalhand,
        userY = (userCalled + userRaised) === 0 ? 0.5 : userRaised / (userCalled + userRaised),
        solX = (solutionCalled + solutionRaised) / solutionTotalHand,
        solY = (solutionCalled + solutionRaised) === 0 ? 0.5 : solutionRaised / (solutionCalled + solutionRaised);


    userX = Math.round((userX * 2 - 1) * 100) / 100
    userY = Math.round((userY * 2 - 1) * 100) / 100;
    solX = Math.round((solX * 2 - 1) * 100) / 100;
    solY = Math.round((solY * 2 - 1) * 100) / 100;




    return <div>
        <h1 > {revue.scenario} </h1>
        <div className="d-flex">
            <div className="container w-50">
                {chart.map((row, r) => {
                    return <div className="row my-1" key={`row-${row[0]}`}>
                        {row.map((col, c) => {
                            const info = ActionInfChoice.find(x => x.abreviation === col);
                            return <div className={`col-13 bg-${info ? info.color : "black"} 
                        ${chartstyle(revue, c, r)}`}
                                key={`col-${chart[0][c]}`}> {col} </div>
                        })}
                    </div>
                })}
            </div>
            <div className="w-50">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 15, right: 15, bottom: 15, left: 15 }}>
                        <CartesianGrid strokeDasharray="10 10" />
                        <XAxis dataKey="x" type="number" name="Loose/Tight" domain={[-1, 1]} stroke={"#FFF"} />
                        <YAxis dataKey="y" type="number" name="Passive/Agressive" domain={[-1, 1]} stroke={"#FFF"} />
                        <ZAxis range={[300, 301]} />

                        <text
                            x={midX}
                            y={topLabelY}
                            style={{ fontSize: 20, fill: '#6F6' }}
                            textAnchor='middle'
                            alignmentBaseline='middle'
                        >
                            Agressive
                        </text>
                        <text
                            x={midX}
                            y={bottomLabelY}
                            style={{ fontSize: 20, fill: '#F66' }}
                            textAnchor='middle'
                            alignmentBaseline='middle'
                        >
                            Passive
                        </text>
                        <text
                            x={rightLabelX}
                            y={midY}
                            style={{ fontSize: 20, fill: '#6F6' }}
                            textAnchor='middle'
                            alignmentBaseline='middle'
                        >
                            Tight
                        </text>
                        <text
                            x={leftLabelX}
                            y={midY}
                            style={{ fontSize: 20, fill: '#F66' }}
                            textAnchor='middle'
                            alignmentBaseline='middle'
                        >
                            Loose
                        </text>


                        <Tooltip cursor={{ strokeDasharray: '10 10' }} />
                        <Legend payload={
                            [{
                                id: "Solution",
                                type: "star",
                                color: "#8884d8",
                                value: "Solution"
                            },
                            {
                                id: "your",
                                type: "circle",
                                color: "#82ca9d",
                                value: "Yours"
                            }
                            ]
                        }
                        />
                        <Scatter name="Solution" data={[{ x: solX, y: solY }]} fill="#8884d8" shape="star" />
                        <Scatter name="Yours" data={[{ x: userX, y: userY }]} fill="#82ca9d" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
}

const CreateBar = ({ revues }) => {
    let userTotal = 0,
        total = 0,
        totalCorrect = 0,
        rightAnswer = 0,
        userAnswer = { 'F': 0, 'C': 0, 'R': 0 },
        correctAnswer = { 'F': 0, 'C': 0, 'R': 0 };

    revues.forEach((revue: Revue_t) => {
        revue.answers.forEach(answer => {
            answer.answer.split('').forEach(c => { userAnswer[c]++; userTotal++; })
            answer.solution.split('').forEach(c => { correctAnswer[c]++; totalCorrect++; })
            rightAnswer += answer.answer === answer.solution ? 1 : 0
            total++;
        })

    })

    let userRC = Math.max(1, userAnswer.R + userAnswer.C),
        correctRC = Math.max(1, correctAnswer.R + correctAnswer.C)

    return (<div className="h-100 mx-4 my-2">
        <div className="row gx-5 h-75" >
            <div className="col-4">
                Your stats
                {Object.entries(userAnswer).map(([category, number]) => { return number > 0 && <div key={`user-${category}`} className={`bg-${ActionInfChoice.find(x => x.abreviation === category).color} bar`} style={{ height: `${number * 90 / userTotal}%` }}>{category} ({Math.round(number * 100 / userTotal)}%)</div> })}
            </div>
            <div className="col-4">
                Correct Stats
                {Object.entries(correctAnswer).map(([category, number]) => { return number > 0 && <div key={`solution-${category}`} className={`bg-${ActionInfChoice.find(x => x.abreviation === category).color} bar`} style={{ height: `${number * 90 / totalCorrect}%` }}>{category} ({Math.round(number * 100 / totalCorrect)}%)</div> })}
            </div>

        </div>
        <div className="h-25">
            <div className="row gy-2">
                <h5 className="col">Hand Played: {Math.round(userRC / userTotal * 100)}%</h5>
                <h5 className="col">Hand raised: {Math.round(userAnswer.R / userTotal * 100)}%</h5>
            </div>
            <div className="row">
                <h5 className="col">Tightness: {Math.round(userAnswer.F / correctAnswer.F * 100)}%</h5>
                <h5 className="col"> {
                    correctAnswer.C !== 0 ?
                        "Passiveness: " + Math.round(userAnswer.C / (userRC) * (correctRC) / correctAnswer.C * 100)
                        : "Agressiveness: " + Math.round(userAnswer.R / (userRC) * (correctRC) / correctAnswer.R * 100)}%
                </h5>
            </div>
            <h5>Correct Answer: {rightAnswer}/{total} ({Math.round(rightAnswer / total * 100)}%)</h5>

            <Link to="/home" className="btn btn-primary">Return home</Link>
        </div>
    </div>)
}

export const Review = () => {
    const [informations] = useContext(ReviewContext)
    console.log(informations);
    return <>
        <Header title="Review" />
        <div className="d-flex white mt-2">
            <div className="col-9 mx-2 bg-subMenu px-2">
                {informations.map(revue => <CreateRangeChart revue={revue} />)}
            </div>
            <div className="col-3 bg-subMenu" style={{ minHeight: "90vh", maxHeight: "90vh" }}>
                <CreateBar revues={informations} />
            </div>
        </div>
    </>
} 