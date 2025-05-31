import {useState} from 'react';
import Swal from 'sweetalert2';
import apiClient from './interceptors/apiClient';

const useApiRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const makeRequest = async (url, method = 'GET', formValues = null, showMessage = true) => {
        setLoading(true);
        setError(null);

        try {
            let response;
            switch (method) {
                case 'POST':
                    response = await apiClient.post(url, formValues);
                    break;
                case 'GET':
                    response = await apiClient.get(url);
                    break;
            }
            
            return response.data;

        } catch (error) {
            setError(error);
            Swal.fire({
                toast: true,
                icon: 'error',
                title: 'Error: ' + error.response?.data.message,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return {loading, error, makeRequest};
};

export default useApiRequest;
