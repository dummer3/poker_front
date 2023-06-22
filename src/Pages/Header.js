import logo from '../img/logo.webp';
import '../extend.css';

export const Header = ({ title, leftText, leftSub, rightText, titleSub, rightSub }) => {

    return (
        <div className="Header white">
            <nav className="navbar navbar-expand-lg  navbar-dark bg-dark flex-nowrap justify-content-between">
                <div className='container d-flex justify-content-start align-items-center ms-2 '>
                    <img src={logo} alt="logo" width="80" href="#" />
                    <div className="d-flex justify-content-start flex-column">
                        <h3 className='ms-3 me-1'>{leftText}</h3>
                        <h6 style={{ fontStyle: 'italic' }}>{leftSub}</h6>
                    </div>
                </div>
                <div className="container d-inline-flex flex-column justify-content-center">
                    <h3>{title}</h3>
                    <h6 style={{ fontStyle: 'italic' }}>{titleSub}</h6>
                </div>
                <div className="container d-flex justify-content-end flex-column me-2 align-items-end">
                    <h3>{rightText}</h3>
                    <h6 style={{ fontStyle: 'italic' }}>{rightSub}</h6>
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