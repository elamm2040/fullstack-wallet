import { PASSWORD_PATTERN } from '../../js/constants.js';

const useNewClientValidation = (setErrors) => {
    const validateForm = (data) => {
        let isValid = true;
        const newErrors = {
            document: '',
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        };

        if (!data.document) {
            newErrors.document = 'Document is required';
            isValid = false;
        }

        if (!data.name) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!data.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        }

        if (!data.phone) {
            newErrors.phone = 'Phone is required';
            isValid = false;
        }

        if (!data.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (!PASSWORD_PATTERN.test(data.password)) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (!data.confirmPassword) {
            newErrors.confirmPassword = 'Confirm your password';
            isValid = false;
        } else if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    return { validateForm };
};

export default useNewClientValidation;
