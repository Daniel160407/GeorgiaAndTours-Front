import type { Key } from "react";
import Tour from "../model/Tour";

const ToursList = ({ tours }) => {
    return (
        <div className="tours-list">
            {tours.map((tour: unknown, index: Key) => (
                <Tour key={index} tour={tour} />
            ))}
        </div>
    );
}

export default ToursList;