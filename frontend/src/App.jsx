import {useState, useCallback} from 'react';
import {useForm} from './hooks';
import {useLogin, useFormValidation} from "./hooks/login";
import Swal from "sweetalert2";
import {useDispatch} from "react-redux";
import {setUser} from "./redux/userSlice";
import {useNavigate} from 'react-router';
import {Link} from 'react-router';

const App = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const {login} = useLogin(setLoading, setSuccess);
    const [errors, setErrors] = useState({email: '', password: ''});
    const {validateForm} = useFormValidation(setErrors);
    const [formValues, handleChange] = useForm({
        email: '',
        password: ''
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = useCallback(() => {
        const loginRequest = async () => {
            if (validateForm(formValues)) {
                const response = await login(formValues);
                if (response) {
                    dispatch(setUser({
                        client: response.client,
                        token: response.token,
                    }));

                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: 'Welcome: ' + response.client.name,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });

                    navigate('/dashboard');
                }
            } else {
                let errorList = "";
                if (errors.email != '') errorList += '- ' + errors.email + '\n';
                if (errors.password != '') errorList += '- ' + errors.password;

                Swal.fire({
                    toast: true,
                    icon: 'error',
                    title: errorList,
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
        };

        return loginRequest();
    }, [formValues, errors]);

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="w-100" style={{maxWidth: '400px'}}>
                <div className="card shadow">
                    <div className="card-body">
                        <h3 className="text-center mb-4">Login</h3>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email"
                                   name="email"
                                   className="form-control"
                                   id="email"
                                   onChange={handleChange}
                                   placeholder="Enter your email"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password"
                                   name="password"
                                   className="form-control"
                                   id="password"
                                   onChange={handleChange}
                                   placeholder="Enter your password"/>
                        </div>
                        <div className="d-grid">
                            <button type="button" onClick={handleLogin} className="btn btn-primary">Login</button>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-3">
                    <Link to="/new" className="text-decoration-none">Add new client</Link>
                </div>
            </div>
        </div>
    );
};

export default App;
