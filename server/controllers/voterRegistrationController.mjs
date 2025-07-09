import models from "../models/index.mjs";
import { Op } from "sequelize";

const addDomainWhitelist = async (req, res, next) => {
  try {
    const { electionId, domains } = req.body;

    if (!electionId) {
      return res.status(400).json({ message: "Election Id not provided" });
    }

    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return res.status(400).json({ message: "Valid domain list is required" });
    }

    console.log(domains)

    const election = await models.Election.findByPk(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const domainPatterns = domains.map(domain => `%${domain}`);

    const users = await models.User.findAll({
      where: {
        email: {
          [Op.or]: domainPatterns.map(pattern => ({
            [Op.like]: pattern
          }))
        }
      },
    });

    if (users.length === 0) {
      return res.status(400).json({
        message: "No registered users found with the specified domain(s)",
        domains: domains,
      });
    }

    const whitelistEntries = await Promise.all(
        users.map(user =>
            models.VoterRegistration.create({
              electionId: electionId,
              userId: user.id,
            })
        )
    );

    return res.status(201).json({
      message: "Domain whitelist added successfully",
      voterCount: whitelistEntries.length,
      domains: domains,
      matchedUsers: users.length,
      whitelist: whitelistEntries.map(entry => entry.toJSON()),
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Some users are already registered for this election",
      });
    }
    next(error);
  }
};

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
      voterCount: whitelistEntries.length,
      whitelist: whitelistEntries.map(entry => entry.toJSON()),
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Some email addresses are already in the whitelist",
      });
    }
    console.error("Error adding whitelist:", error);
    return res.status(500).json({
      message: "Internal server error while adding whitelist",
    });
  }
};

const addAll = async (req, res, next) => {
  try {
    const {electionId} = req.body;
    console.log(electionId);
    if (!electionId) {
      return res.status(400).json({message: "Election ID is required"});
    }

    const election = await models.Election.findByPk(electionId);

    if (!election) {
      return res.status(400).json({message: "Election not found!"});
    }

    const users = await models.User.findAll();

    const existingRegistrations = await models.VoterRegistration.findAll({
      where: { electionId }
    });
    console.log(`Found ${existingRegistrations.length} existing registrations for election ${electionId}`);

    const whitelistEntries = await Promise.all(
        users.map(user => models.VoterRegistration.create({
              electionId:electionId,
              userId: user.id
            })
        )
    );

    return res.status(201).json({
      message: "All voters added successfully",
      voterCount: whitelistEntries.length,
      whitelist: whitelistEntries.map(entry => entry.toJSON()),
    });
  } catch(error) {
    console.error("Full error:", JSON.stringify(error, null, 2));
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.errors) {
      console.error("Constraint errors:", error.errors.map(e => ({
        message: e.message,
        path: e.path,
        value: e.value,
        type: e.type
      })));
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Some users are already registered for this election",
      });
    }
    console.error("Error adding all voters:", error);
    return res.status(500).json({
      message: "Internal server error while adding all voters",
    });
  }
}

const checkWhitelistCount = async (req, res, next) => {
  try {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        message: "Valid email list is required",
        voterCount: 0
      });
    }

    const users = await models.User.findAll({
      where: {
        email: emails,
      },
    });

    const matchedEmails = users.map(user => user.email);
    const missingEmails = emails.filter(email => !matchedEmails.includes(email));

    return res.status(200).json({
      voterCount: users.length,
      matchedEmails: matchedEmails,
      missingEmails: missingEmails,
      totalRequested: emails.length
    });
  } catch (error) {
    console.error("Error checking whitelist count:", error);
    return res.status(500).json({
      message: "Internal server error while checking whitelist count",
      voterCount: 0
    });
  }
};

const checkDomainWhitelistCount = async (req, res, next) => {
  try {
    const { domains } = req.body;

    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return res.status(400).json({
        message: "Valid domain list is required",
        voterCount: 0
      });
    }

    console.log("Checking domains:", domains);

    const domainPatterns = domains.map(domain => `%${domain}`);

    const users = await models.User.findAll({
      where: {
        email: {
          [Op.or]: domainPatterns.map(pattern => ({
            [Op.like]: pattern
          }))
        }
      },
    });

    return res.status(200).json({
      voterCount: users.length,
      domains: domains,
      matchedUsers: users.map(user => ({
        id: user.id,
        email: user.email
      }))
    });
  } catch (error) {
    console.error("Error checking domain whitelist count:", error);
    return res.status(500).json({
      message: "Internal server error while checking domain whitelist count",
      voterCount: 0
    });
  }
};

const checkAllUsersCount = async (req, res, next) => {
  try {
    const userCount = await models.User.count();

    return res.status(200).json({
      voterCount: userCount,
      message: "All registered users count retrieved successfully"
    });
  } catch (error) {
    console.error("Error checking all users count:", error);
    return res.status(500).json({
      message: "Internal server error while checking all users count",
      voterCount: 0
    });
  }
};

export default {
  addWhitelist,
  addDomainWhitelist,
  addAll,
  checkWhitelistCount,
  checkDomainWhitelistCount,
  checkAllUsersCount
};