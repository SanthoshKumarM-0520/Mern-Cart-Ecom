import React, { Fragment } from "react";
import {
    FcAutomotive,
    FcCurrencyExchange,
    FcCustomerSupport,
    FcRating,
} from "react-icons/fc";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/header/Navbar";
import MetaData from "../../components/MetaData";
import styles from "./About.module.scss";
import about from '../../assets/about-us.jpg'

const About = ({ history }) => {
    const abouts = [
        {
            icon: <FcAutomotive size={60} />,
            title: "Free Delevery",
            description:
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae, nihil!",
        },
        {
            icon: <FcCurrencyExchange size={60} />,
            title: "100% Cash Back",
            description:
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae, nihil!",
        },
        {
            icon: <FcRating size={60} />,
            title: "Quality Product",
            description:
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae, nihil!",
        },
        {
            icon: <FcCustomerSupport size={60} />,
            title: "24/7 Support",
            description:
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae, nihil!",
        },
    ];
    return (
        <Fragment>
            <MetaData title={"About"} />
            <Navbar />
            <div className={styles.about}>
                <div className={styles.about_title}>
                    <div className="container">
                        <h3>About Us</h3>
                    </div>
                </div>
                <div className={styles.about_info}>
                    <div className="container mb-5">
                        <div className="row g-3 p-3">
                            <div className="col-md-6">
                                <div className={styles.image}>
                                    <img
                                        src={about}
                                        alt="About"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className={styles.info}>
                                    <h4>
                                        Know About Our Ecomerce Business,

                                    </h4>
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Eaque voluptatibus
                                        est, assumenda cupiditate id nam illo
                                        odio ipsum itaque maxime.
                                    </p>
                                    <button onClick={() => history.push('/contact')}>Contact Us</button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.features}>
                            <h3 className="text-center">Our Features</h3>

                            <div className="row g-3">
                                <div className="col-md-10 col-md-offset-2 mx-auto">
                                    <div className="row mt-4">
                                        {abouts.map((about, index) => (
                                            <div
                                                className="col-md-3"
                                                key={index}
                                            >
                                                <div className={styles.feature}>
                                                    <span> {about.icon}</span>
                                                    <h5>{about.title}</h5>
                                                    <p>{about.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default About;
