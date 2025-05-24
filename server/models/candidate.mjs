export default (sequelize, DataTypes, UUIDV4) => {
  return sequelize.define('candidate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
    },
    votes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    electionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'elections',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  });
};

  