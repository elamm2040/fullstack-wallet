import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router";
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import store, {persistor} from './redux/store.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './js/icons.js';

import App from './App.jsx'
import NewClient from "./NewClient.jsx";
import Dashboard from "./Dashboard.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={
                            <App/>
                        }/>
                        <Route path="/new" element={
                            <NewClient/>
                        }/>
                        <Route path="/dashboard" element={
                            <Dashboard/>
                        }/>
                    </Routes>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </StrictMode>
)
