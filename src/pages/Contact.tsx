import { useEffect, useState } from "react";
import useAxios from "../hooks/UseAxios";
import Cookies from 'js-cookie';
import UserForm from "../components/forms/UserForm";
import SocialNetworkBtns from "../components/uiComponents/SocialNetworkBtns";

const Contact = () => {
    const [showForm, setShowForm] = useState(true);

    useEffect(() => {
        if (Cookies.get('name')) {
            setShowForm(false);
        }
    }, []);

    const handleSubmit = async (formData: unknown) => {
        const response = await useAxios.post('/user', formData);
        if (response?.status === 403) {
            setShowForm(true);
        } else {
            setShowForm(false);
        }
    }

    return (
        <div className="contact">
            {showForm && (
                <>
                    <UserForm onSubmit={handleSubmit} />
                    <SocialNetworkBtns />
                </>
            )}
        </div>
    );
}

export default Contact;