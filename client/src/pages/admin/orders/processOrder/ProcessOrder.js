import React, { Fragment, useEffect, useState } from "react";
import Sidebar from "../../../../components/admin/sidebar/Sidebar";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Processorder.module.scss";
import {
    clearErrors,
    getOrderDetails,
    updateOrder,
} from "../../../../actions/orderActions";
import { UPDATE_ORDER_RESET } from "../../../../constants/orderConstants";
import Loader from "../../../../components/loader/Loader";
import { Link } from "react-router-dom";
import Navbar from "../../../../components/admin/navbar/Navbar";
import MetaData from "../../../../components/MetaData";

const ProcessOrder = ({ match }) => {
    const [status, setStatus] = useState("");

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, order = {} } = useSelector((state) => state.orderDetails);
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        user,
        totalPrice,
        orderStatus,
    } = order;
    const { error, isUpdated } = useSelector((state) => state.order);

    const orderId = match.params.id;

    useEffect(() => {
        dispatch(getOrderDetails(orderId));

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("Order updated successfully");
            dispatch({ type: UPDATE_ORDER_RESET });
        }
    }, [dispatch, alert, error, isUpdated, orderId]);

    const updateOrderHandler = (id) => {
        const formData = { status: status }

        dispatch(updateOrder(id, formData));
    };

    const shippingDetails =
        shippingInfo &&
        `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;
    const isPaid =
        paymentInfo && paymentInfo.status === "succeeded" ? true : false;
    return (
        <div className={styles.process_order}>
            <MetaData title={"Process Order"} />
            <div className="row g-0">
                <div className="col-md-2">
                    <Sidebar />
                </div>
                <div className="col-md-10">
                    <Navbar />
                    <Fragment>
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="row d-flex justify-content-around">
                                <div className="col-12 col-lg-7 order-details">
                                    <h2 className="my-5">
                                        Order # {order._id}
                                    </h2>

                                    <h4 className="mb-4">Shipping Info</h4>
                                    <p>
                                        <b>Name:</b> {user && user.name}
                                    </p>
                                    <p>
                                        <b>Phone:</b>{" "}
                                        {shippingInfo && shippingInfo.phoneNo}
                                    </p>
                                    <p className="mb-4">
                                        <b>Address:</b>
                                        {shippingDetails}
                                    </p>
                                    <p>
                                        <b>Amount:</b> ${totalPrice}
                                    </p>

                                    <hr />

                                    <h4 className="my-4">Payment</h4>
                                    <p
                                        className={
                                            isPaid ? "greenColor" : "redColor"
                                        }
                                    >
                                        <b>{isPaid ? "PAID" : "NOT PAID"}</b>
                                    </p>

                                    <h4 className="my-4">Stripe ID</h4>
                                    <p>
                                        <b>{paymentInfo && paymentInfo.id}</b>
                                    </p>

                                    <h4 className="my-4">Order Status:</h4>
                                    <p
                                        className={
                                            order.orderStatus &&
                                                String(order.orderStatus).includes(
                                                    "Delivered"
                                                )
                                                ? "greenColor"
                                                : "redColor"
                                        }
                                    >
                                        <b>{orderStatus}</b>
                                    </p>

                                    <h4 className="my-4">Order Items:</h4>

                                    <hr />
                                    <div className="cart-item my-1">
                                        {orderItems &&
                                            orderItems.map((item) => (
                                                <div
                                                    key={item.product}
                                                    className="row my-5"
                                                >
                                                    <div className="col-4 col-lg-2">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            height="45"
                                                            width="65"
                                                        />
                                                    </div>

                                                    <div className="col-5 col-lg-5">
                                                        <Link
                                                            to={`/product/${item.product}`}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </div>

                                                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                        <p>${item.price}</p>
                                                    </div>

                                                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                        <p>
                                                            {item.quantity}{" "}
                                                            Piece(s)
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    <hr />
                                </div>

                                <div className="col-12 col-lg-3 mt-5">
                                    <h4 className="my-4">Status</h4>

                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name="status"
                                            value={status}
                                            onChange={(e) =>
                                                setStatus(e.target.value)
                                            }
                                        >
                                            <option value="Processing">
                                                Processing
                                            </option>
                                            <option value="On The Way">
                                                On The Way
                                            </option>
                                            <option value="Shipped">
                                                Shipped
                                            </option>
                                            <option value="Delivered">
                                                Delivered
                                            </option>
                                        </select>
                                    </div>

                                    <button
                                        className="btn btn-primary btn-block mt-3"
                                        onClick={() =>
                                            updateOrderHandler(order._id)
                                        }
                                    >
                                        Update Status
                                    </button>
                                </div>
                            </div>
                        )}
                    </Fragment>
                </div>
            </div>
        </div>
    );
};

export default ProcessOrder;
