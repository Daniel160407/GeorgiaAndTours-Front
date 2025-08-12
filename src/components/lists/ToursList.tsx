import Tour from "../model/Tour";

const ToursList = ({ tours }) => {
    return (
        <div className="tours-list">
            {tours.map((tour, index) => (
                <Tour key={index} tour={tour} />
            ))}
        </div>
    );
}

export default ToursList;