import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import styles from "./Banner.module.scss";

const Banner = () => {
    return (
        <div className={styles.banner}>
            <Swiper
                pagination={{
                    dynamicBullets: true,
                }}
                modules={[Pagination]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <div className={styles.swiper2}>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className={styles.slider_text}>
                                        <p>SPRING / SUMMER COLLECTION 2022</p>
                                        <h1>Get up to 30% off New Arrivals</h1>
                                        <div>
                                            <Link to="/products">Shop now</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className={styles.slider_image}>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default Banner;