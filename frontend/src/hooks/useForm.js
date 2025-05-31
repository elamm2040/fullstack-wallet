import {useState} from 'react';

const useForm = (initialValues) => {
    const [formValues, setFormValues] = useState(initialValues);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    return [formValues, handleChange];
};

export default useForm;
