/**  
 * Defines the 'user' entity in the database.  
 *  
 * @param {object} sequelize - The Sequelize instance used to define the model.  
 * @param {object} DataTypes - A collection of data types supported by Sequelize.  
 * @returns {object} A Sequelize model representing the 'user' entity.  
 *  
 * @property {string} email - The email address of the user. This field is required.  
 * @property {string} passwordHash - The hashed password of the user. This field is required.  
 * @property {string} token - The authentication token for the user. This field is optional.
 */ 
export default (sequelize, DataTypes) => {
    return sequelize.define('user', {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey:true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      publicKey: {
        type:DataTypes.STRING,
        allowNull:false
      },
      token: {
        type: DataTypes.STRING
      },
    })
  }