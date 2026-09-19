import Dictionary from '../../models/Dictionary.model.js';
import User from '../../models/User.model.js';
import LearnSign from '../../models/LearnSign.model.js';

export const getPublicDashboardStats = async () => {
  const [
    totalDictionarySigns,
    userContributionsApproved,
    orgSigns,
    totalLearningSigns,
    totalUsers,
    totalLearningModules
  ] = await Promise.all([
    // Total published dictionary entries
    Dictionary.estimatedDocumentCount(),

    // Signs sourced from the community
    Dictionary.countDocuments({ sourceType: 'user' }),

    // Signs sourced from certified organizations
    Dictionary.countDocuments({ sourceType: 'organization' }),

    // Total signs in the learning modules
    LearnSign.estimatedDocumentCount(),

    // Non-blocked registered users
    User.countDocuments({ isBlocked: false }),

    // Distinct learning module count
    LearnSign.distinct('moduleNumber').then((modules) => modules.length)
  ]);

  return {
    dictionary: {
      total: totalDictionarySigns,
      communityContributed: userContributionsApproved,
      organizationVerified: orgSigns
    },
    learning: {
      totalSigns: totalLearningSigns,
      modulesCount: totalLearningModules
    },
    community: {
      registeredUsers: totalUsers
    }
  };
};