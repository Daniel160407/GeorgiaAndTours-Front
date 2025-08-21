import '../../styles/uiComponents/AddTourBtn.scss';

const AddTourBtn = ({ onClick }) => {
    return (
        <div className="add-tour-btn" onClick={onClick}>
            <p>Add Tour</p>
        </div>
    );
}

export default AddTourBtn;