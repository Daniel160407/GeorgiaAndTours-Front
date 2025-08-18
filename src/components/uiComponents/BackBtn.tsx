import '../../styles/uiComponents/BackBtn.scss';

const BackBtn = ({ onClick }) => {
  return (
    <div className="back-btn" onClick={onClick}>
        <p>&larr;</p>
    </div>
  );
};

export default BackBtn;
