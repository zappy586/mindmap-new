import React from "react";
import ReactDOM from "react-dom/client";
import MyForm from "./App";
import { GoogleOAuthProvider } from '@react-oauth/google';

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
    <GoogleOAuthProvider clientId="204690750388-ca8obf60acch7h3sunmegj2oned0fu16.apps.googleusercontent.com">
        <React.StrictMode>
            <MyForm />
        </React.StrictMode>
        
    </GoogleOAuthProvider>
);
