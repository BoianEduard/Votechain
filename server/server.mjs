import sequelize from "./config/database.mjs";
import app from "./app.mjs";
import { ethers } from "ethers";

const PORT = process.env.PORT || 5000;

sequelize
    .sync({ force: true })
    .then(() => {
        console.log("Database connected and synchronized");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });