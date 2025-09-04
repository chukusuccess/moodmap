import {
  databases,
  generateID,
  query,
  dbID,
  moodsCollection,
} from "./appwrite";

export class MoodService {
  // ✅ Create a new mood entry
  static async createMood({
    emoji,
    text,
    lat,
    lng,
    city,
    country,
    userAgent,
    userId = null,
  }) {
    try {
      const res = await databases.createDocument(
        dbID,
        moodsCollection,
        generateID(),
        {
          emoji,
          text,
          lat,
          lng,
          city,
          country,
          userAgent,
          userId, // null if anonymous
        }
      );
      return res;
    } catch (err) {
      console.error("Error creating mood:", err);
      throw err;
    }
  }

  // ✅ Get today's moods (filtered by date)
  static async getTodayMoods() {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      return await databases.listDocuments(dbID, moodsCollection, [
        query.greaterThan("$createdAt", startOfDay.toISOString()),
        query.orderDesc("$createdAt"),
      ]);
    } catch (err) {
      console.error("Error fetching today's moods:", err);
      throw err;
    }
  }

  // ✅ Subscribe to real-time mood updates
  static subscribeToMoods(callback) {
    const channel = `databases.${dbID}.collections.${moodsCollection}.documents`;
    const unsubscribe = databases.client.subscribe(channel, (res) => {
      if (res.events.includes("databases.*.collections.*.documents.*.create")) {
        callback(res.payload);
      }
    });
    return unsubscribe;
  }

  // ✅ Aggregate mood of the day (most frequent)
  static async getMoodOfTheDay() {
    const { documents } = await this.getTodayMoods();
    if (!documents.length) return null;

    const counts = documents.reduce((acc, mood) => {
      acc[mood.emoji] = (acc[mood.emoji] || 0) + 1;
      return acc;
    }, {});

    const topEmoji = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    return { emoji: topEmoji, count: counts[topEmoji] };
  }

  // ✅ Distribution for pie/donut chart
  static async getMoodDistribution() {
    const { documents } = await this.getTodayMoods();

    const counts = documents.reduce((acc, mood) => {
      acc[mood.emoji] = (acc[mood.emoji] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([emoji, count]) => ({
      emoji,
      count,
    }));
  }

  // ✅ Get moods by a specific user (for /home/history)
  static async getUserMoods(userId) {
    try {
      return await databases.listDocuments(dbID, moodsCollection, [
        query.equal("userId", [userId]),
        query.orderDesc("$createdAt"),
      ]);
    } catch (err) {
      console.error("Error fetching user moods:", err);
      throw err;
    }
  }
}
