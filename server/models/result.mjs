export default (sequelize, DataTypes) => {
    return sequelize.define('result', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      electionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'elections',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      voterTurnout: {
        type: DataTypes.FLOAT, // % de votanți care au participat
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      electionWinner: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  };