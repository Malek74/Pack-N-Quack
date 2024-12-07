/* eslint-disable react/prop-types */
import React from "react";

const QuantityInput = ({ quantity, setQuantity }) => {
    const handleIncrease = () => setQuantity(quantity + 1);
    const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    return (
        <div style={styles.container}>
            <button style={styles.button} onClick={handleDecrease}>
                -
            </button>
            <input
                // type="number"
                value={quantity}
                onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value))) // Ensure no value below 1
                }
                style={styles.input}
                min="1"
            />
            <button style={styles.button} onClick={handleIncrease}>
                +
            </button>
        </div>
    );
};
const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "60px",
        height: "35px",
        //    border: "1px solid #ccc",
        borderRadius: "5px",
        overflow: "hidden",
    },
    button: {
        width: "20px",
        height: "35px",
        //    background: "#f0f0f0",
        border: "none",
        cursor: "pointer",
        fontSize: "20px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        width: "20px",
        textAlign: "center",
        border: "none",
        outline: "none",
        fontSize: "16px",
    },
};

export default QuantityInput;
