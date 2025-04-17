
import "./NavigationButton.css"

const NavigationButton = ({title, onClick, description}) => {
    return (
        <div className="nav-button-container" >
            <button className="nav-button" onClick={onClick}>{title}</button>
            <p className="nav-button-description"> {description} </p>
        </div>
    )
}

export default NavigationButton