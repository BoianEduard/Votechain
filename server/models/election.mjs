export default (sequelize, DataTypes) => {
  return sequelize.define('election', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'draft',
      validate: {
        isIn: [['draft', 'active', 'closed']],
      },
    },
    eligibilityType: {
      type: DataTypes.ENUM('all', 'id', 'whitelist','domain'),
      allowNull: false,
    },
    realTimeResults: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    electionFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    publicKey: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    privateKey: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contractAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/,
      },
    },
    deploymentBlock: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });
};