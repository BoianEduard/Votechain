export default (sequelize, DataTypes, UUIDV4) => {
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
      firstName: {
        type:DataTypes.STRING,
        allowNull:false,
      },
      lastName: {
        type:DataTypes.STRING,
        allowNull:false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      publicKey: {
        type:DataTypes.TEXT,
        allowNull:false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: /^0x[a-fA-F0-9]{40}$/
        }
      }
    })
  }