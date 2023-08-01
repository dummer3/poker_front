import { useContext, useEffect, useState } from "react";
import { GetAllChart } from "./ApiGoogle";
import { Revue_t } from "../types/types";
import { ReviewContext } from "../context/QuizContext";
import { ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter } from 'recharts';
import { Header } from "./Header";

const VALUE = {
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
    let row = Object.entries(VALUE).find(([key,]) => { return key === hand_in[0] })[1],
        col = Object.entries(VALUE).find(([key,]) => { return key === hand_in[1] })[1];

    if (hand_in.length === 3 && hand_in[2] === 'o')
        [row, col] = [col, row];
    return { col: col, row: row }
}

const chartstyle = (revue, c, r) => {
    let answer = revue.answers.find(answer => JSON.stringify(HtoRC(answer.hand)) === JSON.stringify({ col: c, row: r }));

    if (answer)
        return answer.answer === answer.solution ? '' : 'bd-white';
    return 'darker';
}


const CreateRangeChart = ({ revue }) => {
    const [chart, setChart] = useState([]);
    useEffect(() => { GetAllChart(revue.scenario, revue.situation).then(response => setChart(response)) }, [revue]);

    const chartWidth = 400;
    const chartHeight = 400;

    const midX = "58%";
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

    console.log(`X ${userX} Y ${userY} X ${solX} Y ${solY}`);

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
                <ScatterChart width={chartWidth} height={chartHeight}
                    data={[
                        { x: 1, y: 10 },
                        { x: 2, y: 15 }]}>

                    <CartesianGrid strokeDasharray="10 10" />
                    <XAxis dataKey="x" type="number" name="Loose/Tight" domain={[-1, 1]} stroke={"#FFF"} />
                    <YAxis dataKey="y" type="number" name="Passive/Agressive" domain={[-1, 1]} stroke={"#FFF"} />

                    <text
                        x={midX}
                        y={topLabelY}
                        style={{ fontSize: 20, fill: '#6F6' }}
                        textAnchor='middle'
                        alignment-baseline='middle'
                    >
                        Agressive
                    </text>
                    <text
                        x={midX}
                        y={bottomLabelY}
                        style={{ fontSize: 20, fill: '#F66' }}
                        textAnchor='middle'
                        alignment-baseline='middle'
                    >
                        Passive
                    </text>
                    <text
                        x={rightLabelX}
                        y={midY}
                        style={{ fontSize: 20, fill: '#6F6' }}
                        textAnchor='middle'
                        alignment-baseline='middle'
                    >
                        Tight
                    </text>
                    <text
                        x={leftLabelX}
                        y={midY}
                        style={{ fontSize: 20, fill: '#F66' }}
                        textAnchor='middle'
                        alignment-baseline='middle'
                    >
                        Loose
                    </text>


                    <Tooltip cursor={{ strokeDasharray: '10 10' }} />
                    <Legend />
                    <Scatter name="Solution" data={[{ x: solX, y: solY }]} fill="#8884d8" />
                    <Scatter name="Yours" data={[{ x: userX, y: userY }]} fill="#82ca9d" />
                </ScatterChart>
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

    return (<>
        <div className="row mx-2 gx-2 h-75" >
            <div className="col-6 my-2">
                {Object.entries(userAnswer).map(([category, number]) => { return number > 0 && <div className={`bg-${ActionInfChoice.find(x => x.abreviation === category).color} bar`} style={{ height: `${number * 100 / userTotal}%` }}>{category} ({Math.round(number * 100 / userTotal)}%)</div> })}
            </div>
            <div className="col-6 my-2">
                {Object.entries(correctAnswer).map(([category, number]) => { return number > 0 && <div className={`bg-${ActionInfChoice.find(x => x.abreviation === category).color} bar`} style={{ height: `${number * 100 / totalCorrect}%` }}>{category} ({Math.round(number * 100 / totalCorrect)}%)</div> })}
            </div>

        </div>
        <div className="h-25">
            <h4>Hand Played: {Math.round((userAnswer.R + userAnswer.C) / userTotal * 100)}%</h4>
            <h4>Hand raised: {Math.round(userAnswer.R / userTotal * 100)}%</h4>
            <h4>Correct Answer: {Math.round(rightAnswer / total * 100)}%</h4>
        </div>
    </>)
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
            <div className="col-3 bg-subMenu">
                <CreateBar revues={informations} />
            </div>
        </div>
    </>
} 