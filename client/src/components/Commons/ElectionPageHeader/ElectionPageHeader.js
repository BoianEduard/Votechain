import { Link } from "react-router-dom";

export default function ElectionPageHeader({ title, description, backLink, backLabel }) {
    return (
        <div className="text-center mb-6">
            {backLink && backLabel && (
                <div className="mb-4 flex justify-center">
                    <Link to={backLink} className="inline-flex text-white hover:underline">
                        ← {backLabel}
                    </Link>
                </div>
            )}
            <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
            <p className="text-indigo-100 max-w-2xl mx-auto">{description}</p>
        </div>
    );
}