import { useContext, useEffect, useRef, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { QuizzContext } from '../context/QuizzContext';

/**
 * Function to create an overlay with checkbox
 * @param  {{ title: string, labels: string[], set }} info - information need to create the overlay, title of the overlay, labels of the checks button, and the function when their check
 * @returns {ReactElement} - return the overlay 
 */
export const Overlay = (info: { title: string, labels: string[], set }) => {
    const [show, setShow] = useState<boolean>(false);
    const [checks, setChecks] = useState<Object>({})
    const [, setQuizz] = useContext(QuizzContext);

    const initialLabelsRef = useRef<string[]>(info.labels);
    const initialSetRef = useRef(info.set);

    useEffect(() => {
        let temp = {};
        for (const key of initialLabelsRef.current) {
            temp[key] = false;
        }
        setChecks(temp);
    }, [setChecks]);

    const Checkbox = ({ legend, value }) => {
        return (<div><input type='checkbox' value={legend} checked={value} onChange={() => {
            const tempChecks = { ...checks };
            tempChecks[legend] = !tempChecks[legend]; setChecks(tempChecks);
        }} /> {legend} </div>);
    }

    useEffect(() => {
        setQuizz(prevQuizz => {
            const temp = { ...prevQuizz };
            initialSetRef.current(checks, temp);
            return temp;
        });
    }, [checks, setQuizz]);

    return (<div className="overlay py-2 align-self-start px-2 w-100">
        <div className='header d-flex '>
            <div className="d-flex" onClick={() => { setShow(!show) }}>
                <h5>{info.title}</h5>
                <p className='bi bi-arrow-right-circle-fill teal me-auto ms-2'></p>
            </div>
            {show && <div className='mx-auto'>
                {/*Type button because by default it's submit */}
                <button type="button" className='btn btn-xs btn-primary me-2' onClick={() => { let temp = { ...checks }; Object.keys(checks).forEach(k => temp[k] = true); setChecks(temp); }}  >Select all</button>
                <button type="button" className='btn btn-xs btn-primary' onClick={() => { let temp = { ...checks }; Object.keys(checks).forEach(k => temp[k] = false); setChecks(temp); }} >Deselect all</button></div>}

        </div>
        {show && <div className='content d-flex flex-wrap w-100 flex-overlay justify-content-center'>
            {Object.entries(checks).map(([k, v]) => <Checkbox key={'checkbox_' + k} legend={k} value={v} />)}
        </div>}

    </div>);
}


/**
 * Function to create an overlay with checkbox for the scenario
 * @param  {{ title: string, labels: string[], set }} info - information need to create the overlay, title of the overlay, scenarios of the checks button
 * @returns {ReactElement} - return the overlay  
 */
export const ScenarioOverlay = (info: { title: string, scenarios: string[] }) => {
    const [show, setShow] = useState(false);
    const [, setQuizz] = useContext(QuizzContext);
    const [checks, setChecks] = useState({});

    useEffect(() => {
        let temp = {};
        for (const key of info.scenarios) {
            temp[key] = false;
        }
        setChecks(temp);
    },
        [info.scenarios]);


    const ScenarioCheckbox = ({ legend, value }) =>
        <div><input type='checkbox' value={legend} checked={value} onChange={(e) => {
            const tempChecks = { ...checks };
            tempChecks[legend] = !tempChecks[legend]; setChecks(tempChecks);
        }} /> {legend} </div>

    useEffect(() => {
        setQuizz(prevQuizz => {
            const temp = { ...prevQuizz };
            temp.scenarios = [];
            Object.keys(checks).filter(key => checks[key]).forEach(key => temp.scenarios.push(key));
            return temp;
        });
    }, [checks, setQuizz])

    return (<div className="overlay py-2 align-self-start px-2 w-100">
        <div className='header d-flex '>
            <div className="d-flex" onClick={() => { setShow(!show) }}>
                <h5>{info.title}</h5>
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