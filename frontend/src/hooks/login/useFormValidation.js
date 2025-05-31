import {PASSWORD_PATTERN} from "../../js/constants.js";

const useFormValidation = (setErrors) => {
    const validateForm = (data) => {
        let isValid = true;
        const newErrors = {email: '', password: ''};

        if (!data.email && data.email === '') {
            newErrors.email = 'Email is required';
            isValid = false;
        }

        if (!data.password && data.password === '') {
            newErrors.password = 'Password is required';
            isValid = false;
        } else {
            if (!PASSWORD_PATTERN.test(data.password)) {
                newErrors.password = 'Password must be at least 6 characters long';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    return {validateForm};
};

export default useFormValidation;
