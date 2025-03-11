import React from "react";
import { withRouter } from "react-router-dom"; // ✅ Import withRouter
import styles from "./Category.module.scss";
import { useDispatch } from "react-redux";
import { CATEGORY_SELECTION } from "../../../constants/productsConstants";

const Category = ({ history }) => {
    const dispatch = useDispatch()
    const categories = [
        {
            image: "https://res.cloudinary.com/mehedi08h/image/upload/v1648871045/shopx/21_odgu2m.jpg",
            title: "Men's Fashion",
            category: "Men"
        },
        {
            image: "https://res.cloudinary.com/mehedi08h/image/upload/v1648871046/shopx/20_vtlnkz.jpg",
            title: "Women's Fashion",
            category: "Women"
        },
        {
            image: "https://res.cloudinary.com/mehedi08h/image/upload/v1648871045/shopx/18_y8o95o.jpg",
            title: "Kid's Fashion",
            category: "Kids"
        },
        {
            image: "https://res.cloudinary.com/mehedi08h/image/upload/v1648871045/shopx/13_upzdtm.jpg",
            title: "Accessories",
            category: "Accessories"
        },
    ];

    const onClickHandler = (e) => {
        const selectedCategory = e.target.getAttribute("data-category"); // ✅ Correct way to get category
        if (selectedCategory) {
            dispatch({ type: CATEGORY_SELECTION, payload: selectedCategory });
            history.push("/products");
        }
    };


    return (
        <div className={styles.category}>
            <div className="container mb-5 mt-5">
                <div className="row g-3">
                    {categories.map((item, index) => (
                        <div className="col-md-3 text-center" key={index}>
                            <div className={styles.item}>
                                <img src={item.image} alt={item.title} />

                                <div>
                                    <h4>{item.title}</h4>
                                    <p
                                        className="text-center"
                                        style={{ cursor: "pointer", transition: "color 0.3s ease" }}
                                        onMouseEnter={(e) => (e.target.style.color = "#ff5733")}
                                        onMouseLeave={(e) => (e.target.style.color = "inherit")}
                                        onClick={onClickHandler}
                                        data-category={item.category} // ✅ Correct way to store data
                                    >
                                        {item.category}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ✅ Wrap component with withRouter to get access to history
export default withRouter(Category);
