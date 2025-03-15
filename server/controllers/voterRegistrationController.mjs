import models from "../models/index.mjs";

const addWhitelist = async (req, res, next) => {
  try {
    const { electionId, emails } = req.body;

    if (!electionId) {
      return res.status(400).json({ message: "Election ID is required" });
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: "Valid email list is required" });
    }

    const election = await models.Election.findByPk(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const users = await models.User.findAll({
      where: {
        email: emails, 
      },
    });

    const emailToUserIdMap = users.reduce((map, user) => {
      map[user.email] = user.id;
      return map;
    }, {});

    const missingEmails = emails.filter(email => !emailToUserIdMap[email]);
    if (missingEmails.length > 0) {
      return res.status(400).json({
        message: "Some emails do not correspond to registered users",
        missingEmails,
      });
    }

    const whitelistEntries = await Promise.all(
      emails.map(email =>
        models.VoterRegistration.create({
          electionId: electionId,
          userId: emailToUserIdMap[email], 
        })
      )
    );

    return res.status(201).json({
      message: "Voter whitelist added successfully",
      count: whitelistEntries.length,
      whitelist: whitelistEntries.map(entry => entry.toJSON()),
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Some email addresses are already in the whitelist",
      });
    }
    console.log(error)
  }
};

const addAll = async (req, res, next) => {
  try {
    const {electionId} = req.body;

    if (!electionId) {
      return res.status(400).json({message: "Election ID is required"});
    }

    const election = await models.Election.findByPk(electionId);

    if (!election) {
      return res.status(400).json({message: "Election not found!"});
    }

    const users = await models.User.findAll();

    await Promise.all(
      users.map(user => models.VoterRegistration.create({
        electionId:electionId,
        userId: user.id
        })
      ) 
    );
    return res.status(201).json({
      message:"All voters added successfully"
    })
  } catch(error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Some email addresses are already in the whitelist",
      });
    }
    console.log(error)
}
}

export default {
  addWhitelist,
  addAll
};
