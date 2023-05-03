import logo from '../img/logo.webp';
import '../extend.css';

export const Header = ({ title, leftText, leftSub, rightText }) => {

    return (
        <div className="Header white">
            <nav className="navbar navbar-expand-lg  navbar-dark bg-dark flex-nowrap">
                <div className="container-fluid d-flex justify-content-start">
                    <img src={logo} alt="logo" width="80" href="#" />
                    <h3 className='ms-3 me-1'>{leftText}</h3>
                    <h6 className='mt-5' style={{ fontStyle: 'italic' }}>{leftSub}</h6>
                </div>
                <div className="container-fluid d-flex justify-content-center">
                    <h3>{title}</h3>
                </div>
                <div className="container-fluid d-flex justify-content-end">
                    <h3>{rightText}</h3>
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