const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

class GamificationService {
  // Process daily rewards for experts
  static async processDailyRewards() {
    try {
      const experts = await Expert.find({ isActive: true });
      
      for (const expert of experts) {
        await this.calculateDailyRewards(expert);
      }
      
      console.log('✅ Daily rewards processed for all experts');
    } catch (error) {
      console.error('❌ Daily rewards processing error:', error);
    }
  }

  // Calculate daily rewards for an expert
  static async calculateDailyRewards(expert) {
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      // Get yesterday's completed bookings
      const yesterdayBookings = await Booking.find({
        expert: expert._id,
        status: 'completed',
        'scheduling.actualEndTime': {
          $gte: yesterday,
          $lt: today
        }
      });

      let experienceGained = 0;
      let newBadges = [];

      // Calculate experience based on performance
      for (const booking of yesterdayBookings) {
        const bookingExperience = this.calculateBookingExperience(booking);
        experienceGained += bookingExperience;
      }

      // Update expert's experience and level
      expert.gamification.experience += experienceGained;
      const newLevel = this.calculateLevel(expert.gamification.experience);
      
      if (newLevel > expert.gamification.level) {
        expert.gamification.level = newLevel;
        newBadges.push({
          name: `Level ${newLevel}`,
          description: `Reached level ${newLevel}`,
          icon: 'level-up',
          earnedAt: new Date()
        });
      }

      // Check for streak rewards
      const streakReward = await this.checkStreakReward(expert);
      if (streakReward) {
        newBadges.push(streakReward);
        experienceGained += streakReward.points || 0;
      }

      // Check for performance badges
      const performanceBadges = await this.checkPerformanceBadges(expert, yesterdayBookings);
      newBadges.push(...performanceBadges);

      // Add new badges
      newBadges.forEach(badge => {
        expert.gamification.badges.push(badge);
      });

      // Update achievements
      await this.updateAchievements(expert);

      await expert.save();

      return {
        experienceGained,
        newLevel,
        newBadges,
        totalExperience: expert.gamification.experience
      };
    } catch (error) {
      console.error('Calculate daily rewards error:', error);
      return null;
    }
  }

  // Calculate experience points for a booking
  static calculateBookingExperience(booking) {
    let experience = 10; // Base experience

    // Rating bonus
    if (booking.rating.userRating) {
      const rating = booking.rating.userRating.rating;
      experience += rating * 5; // 5-25 bonus points based on rating
    }

    // Quick completion bonus
    if (booking.scheduling.actualStartTime && booking.scheduling.actualEndTime) {
      const estimatedDuration = booking.service.estimatedDuration || 2;
      const actualDuration = (booking.scheduling.actualEndTime - booking.scheduling.actualStartTime) / (1000 * 60 * 60);
      
      if (actualDuration < estimatedDuration) {
        experience += 15; // Quick completion bonus
      }
    }

    // Emergency service bonus
    if (booking.emergency.isEmergency) {
      experience += 25; // Emergency service bonus
    }

    // Community service bonus
    if (booking.community.isCommunityService) {
      experience += 20; // Community service bonus
    }

    return experience;
  }

  // Calculate level based on experience
  static calculateLevel(experience) {
    if (experience < 100) return 1;
    if (experience < 300) return 2;
    if (experience < 600) return 3;
    if (experience < 1000) return 4;
    if (experience < 1500) return 5;
    if (experience < 2100) return 6;
    if (experience < 2800) return 7;
    if (experience < 3600) return 8;
    if (experience < 4500) return 9;
    return 10;
  }

  // Check for streak rewards
  static async checkStreakReward(expert) {
    try {
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Check if expert has completed jobs for 7 consecutive days
      const consecutiveDays = await this.getConsecutiveWorkingDays(expert._id, sevenDaysAgo);
      
      if (consecutiveDays >= 7 && expert.gamification.streaks.current < consecutiveDays) {
        expert.gamification.streaks.current = consecutiveDays;
        expert.gamification.streaks.longest = Math.max(expert.gamification.streaks.longest, consecutiveDays);
        
        return {
          name: `${consecutiveDays} Day Streak`,
          description: `Completed jobs for ${consecutiveDays} consecutive days`,
          icon: 'streak',
          earnedAt: new Date(),
          points: consecutiveDays * 10
        };
      }

      return null;
    } catch (error) {
      console.error('Check streak reward error:', error);
      return null;
    }
  }

  // Get consecutive working days
  static async getConsecutiveWorkingDays(expertId, fromDate) {
    try {
      const bookings = await Booking.find({
        expert: expertId,
        status: 'completed',
        'scheduling.actualEndTime': { $gte: fromDate }
      }).sort({ 'scheduling.actualEndTime': -1 });

      let consecutiveDays = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < 7; i++) {
        const dayStart = new Date(currentDate);
        const dayEnd = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

        const hasJobOnDay = bookings.some(booking => {
          const jobDate = new Date(booking.scheduling.actualEndTime);
          return jobDate >= dayStart && jobDate < dayEnd;
        });

        if (hasJobOnDay) {
          consecutiveDays++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      return consecutiveDays;
    } catch (error) {
      console.error('Get consecutive working days error:', error);
      return 0;
    }
  }

  // Check for performance badges
  static async checkPerformanceBadges(expert, recentBookings) {
    const badges = [];

    // 5-star streak badge
    const fiveStarStreak = await this.checkFiveStarStreak(expert._id);
    if (fiveStarStreak >= 10) {
      badges.push({
        name: '5-Star Master',
        description: `Received 5-star ratings for ${fiveStarStreak} consecutive jobs`,
        icon: 'star-master',
        earnedAt: new Date(),
        points: 50
      });
    }

    // Quick response badge
    if (expert.responseTime.average > 0 && expert.responseTime.average < 5) {
      badges.push({
        name: 'Lightning Fast',
        description: 'Average response time under 5 minutes',
        icon: 'lightning',
        earnedAt: new Date(),
        points: 30
      });
    }

    // High completion rate badge
    const completionRate = (expert.completedJobs / expert.totalJobs) * 100;
    if (completionRate >= 95 && expert.totalJobs >= 20) {
      badges.push({
        name: 'Reliability Master',
        description: '95%+ completion rate with 20+ jobs',
        icon: 'reliability',
        earnedAt: new Date(),
        points: 40
      });
    }

    // Community service badge
    if (expert.communityService.usedHours >= 10) {
      badges.push({
        name: 'Community Hero',
        description: 'Completed 10+ hours of community service',
        icon: 'community-hero',
        earnedAt: new Date(),
        points: 100
      });
    }

    return badges;
  }

  // Check 5-star streak
  static async checkFiveStarStreak(expertId) {
    try {
      const bookings = await Booking.find({
        expert: expertId,
        status: 'completed',
        'rating.userRating.rating': 5
      }).sort({ 'scheduling.actualEndTime': -1 });

      let streak = 0;
      for (const booking of bookings) {
        if (booking.rating.userRating && booking.rating.userRating.rating === 5) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Check 5-star streak error:', error);
      return 0;
    }
  }

  // Update achievements
  static async updateAchievements(expert) {
    const achievements = [];

    // Total jobs achievement
    if (expert.completedJobs >= 100) {
      achievements.push({
        title: 'Century Club',
        description: 'Completed 100+ jobs',
        earnedAt: new Date(),
        points: 200
      });
    }

    // Rating achievement
    if (expert.rating.average >= 4.8 && expert.rating.count >= 50) {
      achievements.push({
        title: 'Excellence Award',
        description: 'Maintained 4.8+ rating with 50+ reviews',
        earnedAt: new Date(),
        points: 150
      });
    }

    // Add new achievements
    achievements.forEach(achievement => {
      const exists = expert.gamification.achievements.some(
        a => a.title === achievement.title
      );
      if (!exists) {
        expert.gamification.achievements.push(achievement);
      }
    });
  }

  // Get leaderboard
  static async getLeaderboard(limit = 10) {
    try {
      const experts = await Expert.find({ isActive: true })
        .populate('user', 'name avatar')
        .sort({ 'gamification.experience': -1 })
        .limit(limit);

      return experts.map((expert, index) => ({
        rank: index + 1,
        expertId: expert._id,
        name: expert.user.name,
        avatar: expert.user.avatar,
        level: expert.gamification.level,
        experience: expert.gamification.experience,
        rating: expert.rating.average,
        badges: expert.gamification.badges.length,
        completedJobs: expert.completedJobs
      }));
    } catch (error) {
      console.error('Get leaderboard error:', error);
      return [];
    }
  }

  // Get expert's gamification profile
  static async getExpertProfile(expertId) {
    try {
      const expert = await Expert.findById(expertId)
        .populate('user', 'name avatar');

      if (!expert) {
        throw new Error('Expert not found');
      }

      const nextLevelExp = this.getNextLevelExperience(expert.gamification.level);
      const progressToNextLevel = ((expert.gamification.experience % 100) / 100) * 100;

      return {
        level: expert.gamification.level,
        experience: expert.gamification.experience,
        nextLevelExp,
        progressToNextLevel,
        badges: expert.gamification.badges,
        achievements: expert.gamification.achievements,
        streaks: expert.gamification.streaks,
        totalJobs: expert.completedJobs,
        rating: expert.rating.average
      };
    } catch (error) {
      console.error('Get expert profile error:', error);
      throw error;
    }
  }

  // Get experience needed for next level
  static getNextLevelExperience(currentLevel) {
    const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];
    return levelThresholds[currentLevel] || levelThresholds[levelThresholds.length - 1];
  }
}

module.exports = GamificationService;

