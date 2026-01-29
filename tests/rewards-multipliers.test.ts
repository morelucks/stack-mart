import { PointsCalculator, ActivityType, UserTier } from '../frontend/src/utils/PointsCalculator';

describe('Rewards System Logic Tests', () => {
    describe('PointsCalculator', () => {
        test('calculates base points correctly for contract calls', () => {
            const points = PointsCalculator.calculatePoints(ActivityType.CONTRACT_CALL, UserTier.BRONZE);
            expect(points).toBe(50);
        });

        test('applies tier multipliers (Gold = 1.5x)', () => {
            const points = PointsCalculator.calculatePoints(ActivityType.CONTRACT_DEPLOY, UserTier.GOLD);
            // 500 * 1.5 = 750
            expect(points).toBe(750);
        });

        test('applies streak bonuses (10 days = 50% bonus)', () => {
            const points = PointsCalculator.calculatePoints(ActivityType.LIBRARY_USE, UserTier.BRONZE, 10);
            // 100 * 1.0 (Bronze) + 50% = 150
            expect(points).toBe(150);
        });

        test('caps streak bonus at 50%', () => {
            const points = PointsCalculator.calculatePoints(ActivityType.LIBRARY_USE, UserTier.BRONZE, 20);
            // 100 * 1.0 + 50% = 150 (not 100% bonus)
            expect(points).toBe(150);
        });

        test('calculates GitHub contribution points', () => {
            const points = PointsCalculator.calculatePoints(ActivityType.GITHUB_CONTRIBUTION, UserTier.SILVER);
            // 75 * 1.2 = 90
            expect(points).toBe(90);
        });

        test('correctly determines tier progress', () => {
            const progress = PointsCalculator.getTierProgress(1500);
            expect(progress.current).toBe(UserTier.SILVER);
            expect(progress.next).toBe(UserTier.GOLD);
            // (1500 - 1000) / 4000 * 100 = 12.5%
            expect(progress.progress).toBe(12.5);
        });
    });
});

// Mocking global objects for ReferralManager tests if needed
// However, since it relies on localStorage and window, unit testing 
// might require a browser-like environment (JSDOM).
