export default (sequelize, DataTypes) => {
    return sequelize.define('voterRegistration', {
      status: {
        type: DataTypes.STRING,
        defaultValue: 'registered',
        validate: {
          isIn: [['registered', 'voted']]
        }
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      electionId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'elections',
          key: 'id'
        }
      }
    }, {
      indexes: [
        {
          unique: true,
          fields: ['userId', 'electionId']
        }
      ]
    });
  };