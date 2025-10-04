// YAGNI Principle Examples - You Aren't Gonna Need It

// ❌ YAGNI violation: Over-engineering for future needs
public class UserService {
    // Complex caching system "for future scale"
    private final CacheManager<String, User> userCache;
    private final CacheManager<String, List<User>> queryCache;
    private final CacheManager<String, UserStats> statsCache;

    // Flexible notification system "for future channels"
    private final NotificationService<EmailChannel> emailNotifier;
    private final NotificationService<SmsChannel> smsNotifier;
    private final NotificationService<PushChannel> pushNotifier;
    private final NotificationService<SlackChannel> slackNotifier;

    public User getUser(String id) {
        // 50 lines of caching logic for simple database lookup
        return complexCachingLogic(id);
    }
}

// ✅ YAGNI compliance: Build what you need now
public class UserService {
    private final UserRepository userRepository;

    public User getUser(String id) {
        return userRepository.findById(id);
    }

    // Add caching when performance becomes an actual problem
    // Add notification channels when requirements specify them
}

/**
 * YAGNI Decision Framework:
 * 1. Is this feature required by current specifications?
 * 2. Do we have evidence this optimization is needed?
 * 3. Will this complexity pay for itself within the current development cycle?
 * 4. Can we measure the actual need for this feature?
 *
 * When YAGNI Doesn't Apply:
 * - Security considerations (better safe than compromised)
 * - Data integrity constraints (corruption is expensive)
 * - Basic error handling (exceptions will happen)
 * - Essential logging (debugging requires visibility)
 */