
import "./NavigationButton.css"

const NavigationButton = ({title, onclick, description}) => {
    return (
    <div className="nav-button-container" >
        <button className="nav-button" onClick={onclick}>{title}</button>
        <p className="nav-button-description"> {description} </p>
    </div>
    )
}

export default NavigationButton