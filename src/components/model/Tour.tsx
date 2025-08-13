const Tour = ({ tour }) => {
  return (
    <div className="tour">
      <div className="image-container">
        <img src={tour.imageUrl} />
      </div>
      <div className="tour-info">
        <h1 className="tour-title">{tour.name}</h1>
        <p className="tour-direction">{tour.direction}</p>
        <p className="tour-duration">{tour.duration}</p>
        <p className="tour-price">{tour.price}</p>
      </div>
    </div>
  );
};

export default Tour;
