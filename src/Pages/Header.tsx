import logo from '../img/logo.webp';
import '../extend.css';

/**
 * 
 * @param {{ title: string, leftText: string, leftSub: string, rightText: string, titleSub: string, rightSub: string }} info - different information to place in the header
 * @returns {ReactElement} - An header that you can use for every page
 */
export const Header = (info: { title: string, leftText: string, leftSub: string, rightText: string, titleSub: string, rightSub: string }) => {
    return (
        <div className="Header white">
            <nav className="navbar navbar-expand-lg  navbar-dark bg-dark flex-nowrap justify-content-between p-0">
                <div className='container d-flex justify-content-start align-items-center ms-2 '>
                    <img src={logo} alt="logo" width="80" />
                    <div className="d-flex justify-content-start flex-column">
                        <h3 className='ms-3 me-1'>{info.leftText}</h3>
                        <h6 style={{ fontStyle: 'italic' }}>{info.leftSub}</h6>
                    </div>
                </div>
                <div className="container d-inline-flex flex-column justify-content-center">
                    <h3>{info.title}</h3>
                    <h6 style={{ fontStyle: 'italic' }}>{info.titleSub}</h6>
                </div>
                <div className="container d-flex justify-content-end flex-column me-2 align-items-end">
                    <h3>{info.rightText}</h3>
                    <h6 style={{ fontStyle: 'italic' }}>{info.rightSub}</h6>
                </div>
            </nav >
        </div >);

}

Header.defaultProps = {
    title: "",
    leftText: "",
    leftSub: "",
    rightText: "",
    titleSub: "",
    rightSub: ""
}