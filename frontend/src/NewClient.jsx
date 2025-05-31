import {useState, useCallback} from 'react';
import {useForm} from './hooks';
import useNewClientValidation from './hooks/newUser/useNewClientValidation';
import useApiRequest from './hooks/useApiRequest';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router';

const NewClient = () => {
    const [formValues, handleChange] = useForm({
        document: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const {validateForm} = useNewClientValidation(setErrors);
    const {loading, makeRequest} = useApiRequest();
    const navigate = useNavigate();

    const handleSubmit = useCallback(async () => {
        if (validateForm(formValues)) {
            const {confirmPassword, ...payload} = formValues;
            const response = await makeRequest('/register-client', 'POST', payload);

            if (response?.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Client registered successfully',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => navigate('/'));
            }
        } else {
            let errorList = Object.values(errors)
                .filter(err => err !== '')
                .map(err => `- ${err}`)
                .join('\n');

            Swal.fire({
                toast: true,
                icon: 'error',
                title: errorList,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });
        }
    }, [formValues, errors]);

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="w-100" style={{maxWidth: '500px'}}>
                <div className="card shadow">
                    <div className="card-body">
                        <h3 className="text-center mb-4">Register New Client</h3>
                        {['document', 'name', 'email', 'phone', 'password', 'confirmPassword'].map((field, idx) => (
                            <div className="mb-3" key={idx}>
                                <label htmlFor={field} className="form-label">
                                    {field.charAt(0).toUpperCase() + field.slice(1).replace('Password', ' Password')}
                                </label>
                                <input
                                    type={field.toLowerCase().includes('password') ? 'password' : 'text'}
                                    name={field}
                                    className="form-control"
                                    id={field}
                                    onChange={handleChange}
                                    placeholder={`Enter ${field}`}
                                />
                            </div>
                        ))}
                        <div className="d-grid">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading && <span className="spinner-border spinner-border-sm me-2" role="status"
                                                  aria-hidden="true"></span>}
                                Save Client
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewClient;
