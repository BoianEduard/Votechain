import { ArrowRight, ArrowLeft } from "lucide-react";

const NavigationButton = ({
                              title,
                              onClick,
                              direction,
                              ...props
                          }) => {
    return (
        <button
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md font-medium cursor-pointer transition-colors duration-200 hover:bg-indigo-700"
            onClick={onClick}
            {...props}
        >
            {direction === "left" && <ArrowLeft className="mr-2 h-4 w-4" />}
            {title}
            {direction === "right" && <ArrowRight className="ml-2 h-4 w-4" />}
        </button>
    );
};

export default NavigationButton;
