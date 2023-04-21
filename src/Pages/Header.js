import logo from '../img/logo.webp';
import '../extend.css';

export const Header = ({ title, leftText, leftSub, rightText }) => {

    return (
        <div className="Header white">
            <nav className="navbar navbar-expand-lg  navbar-dark bg-dark flex-nowrap">
                <div className="container-fluid d-flex justify-content-start">
                    <img src={logo} alt="logo" width="120" href="#" />
                    <h1 className='ms-3 me-1'>{leftText}</h1>
                    <h6 className='mt-5' style={{ fontStyle: 'italic' }}>{leftSub}</h6>
                </div>
                <div className="container-fluid d-flex justify-content-center">
                    <h1>{title}</h1>
                </div>
                <div className="container-fluid d-flex justify-content-end">
                    <h1>{rightText}</h1>
                </div>
            </nav>
        </div >);

}

Header.defaultProps = {
    title: "",
    leftText: "",
    leftSub: "",
    rightText: ""
}