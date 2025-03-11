import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from "../../../actions/userActions";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import MetaData from "../../../components/MetaData";
import styles from "./ResetPassword.module.scss";
import { useParams } from "react-router-dom";


const ResetPassword = ({ history, match }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { token } = useParams()

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, success } = useSelector((state) => state.forgotPassword);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Password updated successfully");
            history.push("/login");
        }
    }, [dispatch, alert, error, success, history]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert.error("Passwords do not match");
            return;
        }
        const formData = {
            password: password,
            confirmPassword: confirmPassword,
        };
        dispatch(resetPassword(token, formData))
    };

    return (
        <Fragment>
            <MetaData title={"Reset Password"} />
            <Navbar />
            <div className={styles.reset_password}>
                <div className={styles.wrapper}>
                    <div className={styles.form_container}>
                        <form className={styles.form} onSubmit={submitHandler}>
                            <h1 className={styles.title}>New Password</h1>

                            <div className={styles.form_group}>
                                <label htmlFor="password_field">Password</label>
                                <input
                                    type="password"
                                    id="password_field"
                                    className={styles.input}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.form_group}>
                                <label htmlFor="confirm_password_field">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm_password_field"
                                    className={styles.input}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                id="new_password_button"
                                type="submit"
                                className={styles.button}
                            >
                                Set Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default ResetPassword;