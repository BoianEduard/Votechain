import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port:process.env.DB_PORT,
        dialect:'postgres',
        logging:false,
        dialectOptions: {
            SSL:process.env.DB_SSL === 'true' ? {
                require:true,
                rejectUnauthorized: false
            }   : false
        }
    }
);

export default sequelize