import {useDispatch, useSelector} from 'react-redux';
import {logout} from './redux/userSlice';
import {useNavigate} from 'react-router';
import {useState} from 'react';
import Swal from 'sweetalert2';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRightFromBracket, faWallet, faMoneyBill, faDollarSign, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import useApiRequest from './hooks/useApiRequest';
import {setSession} from './redux/sessionSlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {client} = useSelector(state => state.user);
    const {session_id} = useSelector(state => state.session);
    const {makeRequest} = useApiRequest();

    const [loadingBalance, setLoadingBalance] = useState(false);
    const [loadingRecharge, setLoadingRecharge] = useState(false);
    const [loadingInitiate, setLoadingInitiate] = useState(false);
    const [loadingConfirm, setLoadingConfirm] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleGetBalance = async () => {
        setLoadingBalance(true);
        const response = await makeRequest('/wallet', 'GET');
        setLoadingBalance(false);
        if (response) {
            Swal.fire({
                icon: 'info',
                title: 'Current balance',
                text: `Your balance is $${response.data.balance}`
            });
        }
    };

    const handleRecharge = async () => {
        const {value: amount} = await Swal.fire({
            title: 'Recharge balance',
            input: 'number',
            inputLabel: 'Amount to recharge',
            showCancelButton: true,
            confirmButtonText: 'Add balance',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value || value <= 0) {
                    return 'Enter a valid amount';
                }
            }
        });

        if (amount) {
            setLoadingRecharge(true);
            const response = await makeRequest('/wallet/recharge', 'POST', {amount: parseFloat(amount)});
            setLoadingRecharge(false);
            if (response) {
                Swal.fire('Updated balance', 'The balance was successfully recharged.', 'success');
            }
        }
    };

    const handleInitiatePayment = async () => {
        const {value: amount} = await Swal.fire({
            title: 'Start payment',
            input: 'number',
            inputLabel: 'Payment amount',
            showCancelButton: true,
            confirmButtonText: 'Start payment',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value || value <= 0) {
                    return 'Enter a valid amount';
                }
            }
        });

        if (amount) {
            setLoadingInitiate(true);
            const response = await makeRequest('/payment/initiate', 'POST', {amount: parseFloat(amount)});
            setLoadingInitiate(false);
            if (response && response.session_id) {
                dispatch(setSession({session_id: response.session_id}));
                Swal.fire('Token sent', 'The confirmation token was sent to the email.', 'success');
            }
        }
    };

    const handleConfirmPayment = async () => {
        const {value: formValues} = await Swal.fire({
            title: 'Confirm payment',
            html: `
                <input id="swal-input1" class="swal2-input" placeholder="Enter confirmation token">
                <input id="swal-input2" class="swal2-input" placeholder="Enter payment amount" type="number">
            `,
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                return {
                    token: document.getElementById('swal-input1').value,
                    amount: parseFloat(document.getElementById('swal-input2').value),
                }
            }
        });

        if (formValues && formValues.token && formValues.amount) {
            setLoadingConfirm(true);
            const response = await makeRequest('/payment/confirm', 'POST', {
                session_id: session_id.session_id,
                token: formValues.token,
                amount: formValues.amount,
            });
            setLoadingConfirm(false);
            if (response) {
                Swal.fire('Confirmed payment', 'Payment has been successfully confirmed.', 'success');
            }
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="w-100" style={{maxWidth: '500px'}}>
                <div className="card shadow position-relative">
                    <button className="btn btn-outline-danger position-absolute end-0 m-3" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </button>
                    <div className="card-body">
                        <h3 className="text-center mb-4">Welcome</h3>
                        <p><strong>Name:</strong> {client.name}</p>
                        <p><strong>Email:</strong> {client.email}</p>
                        <p><strong>Document:</strong> {client.document}</p>
                        <p><strong>Phone:</strong> {client.phone}</p>

                        <hr/>

                        <div className="d-grid gap-2">
                            <button className="btn btn-primary" onClick={handleGetBalance} disabled={loadingBalance}>
                                {loadingBalance && <span className="spinner-border spinner-border-sm me-2" role="status"/>}
                                <FontAwesomeIcon icon={faWallet} className="me-2" /> Check balance
                            </button>
                            <button className="btn btn-success" onClick={handleRecharge} disabled={loadingRecharge}>
                                {loadingRecharge && <span className="spinner-border spinner-border-sm me-2" role="status"/>}
                                <FontAwesomeIcon icon={faMoneyBill} className="me-2" /> Load balance
                            </button>
                            <button className="btn btn-warning" onClick={handleInitiatePayment} disabled={loadingInitiate}>
                                {loadingInitiate && <span className="spinner-border spinner-border-sm me-2" role="status"/>}
                                <FontAwesomeIcon icon={faDollarSign} className="me-2" /> Start payment
                            </button>
                            <button className="btn btn-info" onClick={handleConfirmPayment} disabled={loadingConfirm}>
                                {loadingConfirm && <span className="spinner-border spinner-border-sm me-2" role="status"/>}
                                <FontAwesomeIcon icon={faCheckCircle} className="me-2" /> Confirm payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
