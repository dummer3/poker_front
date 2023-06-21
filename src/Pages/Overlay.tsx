import { useContext, useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Quizz_t } from '../types/type';
import { QuizzContext } from '../context/QuizzContext';


export const SituationOverlay = ({ title }) => {
    const [show, setShow] = useState(false);
    const [checks, setChecks] = useState({ OP: false, "3-Bet": false, "4-Bet": false, "5-Bet": false })
    const [quizz, setQuizz] = useContext(QuizzContext);

    const SituationCheckbox = ({ legend, value }) => {
        return (<div><input type='checkbox' value={legend} checked={value} onChange={(e) => {
            const tempChecks = { ...checks };
            tempChecks[legend] = !tempChecks[legend]; setChecks(tempChecks);
        }} /> {legend} </div>);
    }

    let checkbox = Object.entries(checks).map(([k, v]) => <SituationCheckbox key={'checkbox_' + k} legend={k} value={v} />);

    useEffect(() => {
        checkbox = Object.entries(checks).map(([k, v]) => <SituationCheckbox key={'checkbox_' + k} legend={k} value={v} />)
        const temp: Quizz_t = { ...quizz };
        temp.situations = [];
        Object.keys(checks).filter(key => checks[key]).forEach(key => temp.situations.push(key));
        setQuizz(temp);
    }, [checks])


    return (<div className="overlay py-2 align-self-start px-2 w-100">
        <div className='header d-flex '>
            <div className="d-flex" onClick={() => { setShow(!show) }}>
                <h5>{title}</h5>
                <p className='bi bi-arrow-right-circle-fill teal me-auto ms-2'></p>
            </div>
            {show && <div className='mx-auto'>
                {/* Type button because by default it's submit */}
                <button type="button" className='btn btn-xs btn-primary me-2' onClick={() => { let temp = { ...checks }; Object.keys(checks).forEach(k => temp[k] = true); setChecks(temp); }}  >Select all</button>
                <button type="button" className='btn btn-xs btn-primary' onClick={() => { let temp = { ...checks }; Object.keys(checks).forEach(k => temp[k] = false); setChecks(temp); }} >Deselect all</button></div>}

        </div>
        {show && <div className='content d-flex flex-wrap w-100 flex-overlay justify-content-center'>
            {checkbox}
        </div>}

    </div>);
}

export const PositionOverlay = ({ title }) => {
    const [show, setShow] = useState(false);
    const [checks, setChecks] = useState({ UTG: false, HJ: false, CO: false, BTN: false, SB: false, BB: false })
    const [quizz, setQuizz] = useContext(QuizzContext);

    const PositionCheckbox = ({ legend, value }) => {

        return (<div><input type='checkbox' value={legend} checked={value} onChange={(e) => {
            const tempChecks = { ...checks };
            tempChecks[legend] = !tempChecks[legend]; setChecks(tempChecks);
        }} /> {legend} </div>);
    }

    let checkbox = Object.entries(checks).map(([k, v]) => <PositionCheckbox key={'checkbox_' + k} legend={k} value={v} />);

    useEffect(() => {
        checkbox = Object.entries(checks).map(([k, v]) => <PositionCheckbox key={'checkbox_' + k} legend={k} value={v} />)
        const temp: Quizz_t = { ...quizz };
        temp.positions = [];
        Object.keys(checks).filter(key => checks[key]).forEach(key => temp.positions.push(key));
        setQuizz(temp);
    }, [checks])

    return (<div className="overlay py-2 align-self-start px-2 w-100">
        <div className='header d-flex '>
            <div className="d-flex" onClick={() => { setShow(!show) }}>
                <h5>{title}</h5>
                <p className='bi bi-arrow-right-circle-fill teal me-auto ms-2'></p>
            </div>
            {show && <div className='mx-auto'>
                <button type="button" className='btn btn-xs btn-primary me-2' onClick={(e) => { e.preventDefault(); let temp = { ...checks }; Object.keys(checks).forEach(k => temp[k] = true); setChecks(temp); }} >Select all</button>
                <button type="button" className='btn btn-xs btn-primary' onClick={(e) => { e.preventDefault(); let temp = { ...checks }; Object.keys(checks).forEach(k => temp[k] = false); setChecks(temp); }} >Deselect all</button></div>}

        </div>
        {show && <div className='content d-flex flex-wrap w-100 flex-overlay justify-content-center'>
            {Object.entries(checks).map(([k, v]) => <PositionCheckbox key={'checkbox_' + k} legend={k} value={v} />)}
        </div>}

    </div>);
}

export const ScenarioOverlay = ({ title, scenarios }) => {
    const [show, setShow] = useState(false);
    const [quizz, setQuizz] = useContext(QuizzContext);
    const [checks, setChecks] = useState({});

    useEffect(() => {
        let temp = {};
        for (const key of scenarios) {
            temp[key] = false;
        }
        setChecks(temp);
    },
        [scenarios]);


    const ScenarioCheckbox = ({ legend, value }) =>
        <div><input type='checkbox' value={legend} checked={value} onChange={(e) => {
            const tempChecks = { ...checks };
            tempChecks[legend] = !tempChecks[legend]; setChecks(tempChecks);
        }} /> {legend} </div>

    let checkbox = Object.entries(checks).map(([k, v]) => <ScenarioCheckbox key={'checkbox_' + k} legend={k} value={v} />);

    useEffect(() => {
        checkbox = Object.entries(checks).map(([k, v]) => <ScenarioCheckbox key={'checkbox_' + k} legend={k} value={v} />)
        const temp: Quizz_t = { ...quizz };
        temp.scenarios = [];
        Object.keys(checks).filter(key => checks[key]).forEach(key => temp.scenarios.push(key));
        setQuizz(temp);
    }, [checks])

    return (<div className="overlay py-2 align-self-start px-2 w-100">
        <div className='header d-flex '>
            <div className="d-flex" onClick={() => { setShow(!show) }}>
                <h5>{title}</h5>
                <p className='bi bi-arrow-right-circle-fill teal me-auto ms-2'></p>
            </div>
            {show && <div className='mx-auto'>
                <button type="button" className='btn btn-xs btn-primary me-2' onClick={(e) => { e.preventDefault(); let temp = { ...checks }; Object.keys(checks).forEach(k => temp[k] = true); setChecks(temp); }} >Select all</button>
                <button type="button" className='btn btn-xs btn-primary' onClick={(e) => { e.preventDefault(); let temp = { ...checks }; Object.keys(checks).forEach(k => temp[k] = false); setChecks(temp); }} >Deselect all</button></div>}

        </div>
        {show && <div className='content d-flex flex-wrap w-100 flex-overlay justify-content-center'>
            {Object.entries(checks).map(([k, v]) => <ScenarioCheckbox key={'checkbox_' + k} legend={k} value={v} />)}
        </div>}

    </div>);
}