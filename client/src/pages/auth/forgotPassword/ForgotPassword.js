import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from "../../../actions/userActions";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import MetaData from "../../../components/MetaData";
import styles from "./ForgotPassword.module.scss";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const alert = useAlert();
    const dispatch = useDispatch();

    // Extract error, loading state, and message from Redux store
    const { error, loading, message } = useSelector(
        (state) => state.forgotPassword
    );

    // Handle errors and success messages
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (message) {
            alert.success(message);
        }
    }, [dispatch, alert, error, message]);

    // Submit handler for forgot password form
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email)); // Dispatch Redux action
    };

    return (
        <Fragment>
            <MetaData title="Forgot Password" />
            <Navbar />

            <div className={styles.forgot_password}>
                <div className={styles.wrapper}>
                    <div className={styles.form_container}>
                        <form className={styles.form} onSubmit={submitHandler}>
                            <h1 className={styles.title}>Forgot Password</h1>

                            <div className={styles.form_group}>
                                <label htmlFor="email_field">Enter Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className={styles.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                id="forgot_password_button"
                                type="submit"
                                className={styles.button}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Email"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </Fragment>
    );
};

export default ForgotPassword;