import axios from 'axios';
import {API_URL_LOCAL} from '../../js/constants';
import Swal from 'sweetalert2';

const useLogin = (setLoading, setSuccess) => {
    const login = async (data) => {
        setLoading(true);

        try {
            return await axios.post(`${API_URL_LOCAL}/login`, {
                email: data.email,
                password: data.password,
            }).then(({data}) => {
                setSuccess(true);
                return data;
            });
        } catch (err) {
            if (err.response.status === 401) {
                Swal.fire({
                    toast: true,
                    icon: 'error',
                    title: err.response.data.message,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            } else {
                Swal.fire({
                    toast: true,
                    icon: 'error',
                    title: 'An error occurred. Please try again.',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {login};
};

export default useLogin;
