import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import "./signin.scss";
import { ReactComponent as GoogleIcon } from "../../../../assets/icons/Google.svg";

export default function SignIn({ switchToSignUp }) {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" }); // добавляем состояние для ошибок
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const validate = () => {
        let valid = true;
        let errors = {};

        // Проверка email
        if (!credentials.email) {
            errors.email = "Email is required";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
            errors.email = "Email is invalid";
            valid = false;
        }

        // Проверка пароля
        if (!credentials.password) {
            errors.password = "Password is required";
            valid = false;
        } else if (credentials.password.length < 4) {
            errors.password = "Password must be at least 6 characters";
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка перед отправкой
        if (!validate()) {
            return; // если есть ошибки, не отправляем запрос
        }

        try {
            const response = await fetch("https://testchatback-production.up.railway.app/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();

            if (response.ok) {
                login(data.token);
                navigate("/"); // редирект на главную страницу
            } else {
                setMessage(data.message || "Login failed.");
            }
        } catch (error) {
            setMessage("Error connecting to server.");
        }
    };

    return (
        <div className="Login">
            <h1 className="Login-title">Sign In</h1>
            <form className="Login-form" onSubmit={handleSubmit}>
                <div className="Login-emailall">
                    <p className="Login-email">E-mail</p>
                    <input
                        type="email"
                        className="Login-email-input"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error">{errors.email}</p>} {/* отображение ошибки для email */}
                </div>
                <div className="Login-passwordall">
                    <p className="Login-password">Password</p>
                    <input
                        type="password"
                        className="Login-password-input"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className="error">{errors.password}</p>} {/* отображение ошибки для пароля */}
                </div>
                <p className="Login-forgotpass">Forgot Password?</p>
                <div className="Login-buttall">
                    <button type="submit" className="Login-buttall-buttlog">
                        Log In
                    </button>
                    <button type="button" className="Login-buttall-buttlog-withG">
                        Log In with <GoogleIcon />
                    </button>
                </div>
                <p className="Login-logup">
                    Don’t have an account?{" "}
                    <span className="Login-logup-link" onClick={switchToSignUp}>
                        Sign Up
                    </span>
                </p>
            </form>
            <p>{message}</p> {/* отображение общего сообщения */}
        </div>
    );
}
