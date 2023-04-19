import logo from '../img/logo.webp';
import '../extend.css';

export const Header = ({ title }) => {

    return (
        <div className="Header">
            <nav className="navbar navbar-expand-lg  navbar-dark bg-dark flex-nowrap">
                <div className="container-fluid d-flex justify-content-start">
                    <img src={logo} alt="logo" width="120" href="#" />
                </div>
                <div className="container-fluid d-flex justify-content-center white" >
                    <h1>{title}</h1>
                </div>
                <div className="container-fluid d-flex justify-content-right">
                </div>
            </nav>
        </div >);

}