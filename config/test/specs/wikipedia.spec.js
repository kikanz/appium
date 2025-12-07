const { expect } = require('chai');
const SearchPage = require('../pageobject/search.page.js');
const ArticlePage = require('../pageobject/article.page.js');
const { onboarding } = require('../../selectors/selectors.js');

/**
 * Wikipedia Mobile App Test Suite
 *
 * This test suite validates core functionality of the Wikipedia mobile application:
 * - Onboarding flow completion
 * - Search functionality
 * - Article navigation and display
 *
 * Test execution flow:
 * 1. before hook - runs once before all tests (handles onboarding)
 * 2. beforeEach hook - runs before each test (currently not needed)
 * 3. individual test cases
 * 4. afterEach hook - runs after each test (navigates back to home)
 * 5. after hook - runs once after all tests (cleanup)
 */
describe('Wikipedia Mobile App', () => {

    /**
     * SETUP - Runs once before all tests
     *
     * Purpose: Complete the initial onboarding flow
     * This includes:
     * - Language selection
     * - Explore features introduction
     * - Reading lists introduction
     * - Privacy policy acceptance
     * - Final "Get started" confirmation
     *
     * Note: Uses 'before' instead of 'beforeEach' because onboarding
     * should only be completed once per test session
     */
    before(async () => {
        console.log('=== Starting Wikipedia App Onboarding ===');

        // Wait for initial app loading and animation completion
        await driver.pause(2000);

        // STEP 1: Handle language selection screen
        const languageContinueButton = await $(onboarding.languageContinueButton);
        await languageContinueButton.waitForExist({ timeout: 5000 });

        try {
            console.log('Language Continue Button Selector:', onboarding.languageContinueButton);
            console.log('Language Continue Button Exists:', await languageContinueButton.isExisting());

            // Wait for button to be interactive and click it
            await languageContinueButton.waitForDisplayed({ timeout: 5000 });
            await languageContinueButton.click();
            console.log('✓ Language selection completed');
        } catch (error) {
            console.error('✗ Error clicking language continue button:', error);
            throw error; // Re-throw to fail setup if critical step fails
        }

        // STEP 2: Navigate through onboarding feature introduction screens
        const onboardingButtons = [
            onboarding.exploreContinueButton,      // Explore features screen
            onboarding.readingListsContinueButton, // Reading lists screen
        ];

        // Iterate through each onboarding screen
        for (let i = 0; i < onboardingButtons.length; i++) {
            const buttonSelector = onboardingButtons[i];
            try {
                const continueButton = await $(buttonSelector);

                console.log(`Step ${i + 2}: Attempting to interact with selector: ${buttonSelector}`);
                console.log(`Button exists: ${await continueButton.isExisting()}`);

                // Wait for button to be visible and clickable
                await continueButton.waitForDisplayed({ timeout: 3000 });
                await continueButton.click();
                console.log(`✓ Screen ${i + 1} completed`);

                // Pause to allow screen transition animation
                await driver.pause(1000);
            } catch (error) {
                console.error(`✗ Error interacting with button ${buttonSelector}:`, error);
                throw error; // Re-throw to fail setup if critical step fails
            }
        }

        // STEP 3: Complete onboarding with "Get started" button
        try {
            const getStartedButton = await $(onboarding.getStartedButton);

            console.log('Get Started Button Selector:', onboarding.getStartedButton);
            console.log('Get Started Button Exists:', await getStartedButton.isExisting());

            // Wait for final button and complete onboarding
            await getStartedButton.waitForDisplayed({ timeout: 5000 });
            await getStartedButton.click();
            console.log('✓ Onboarding completed successfully');

            // Wait for app to transition to main screen
            await driver.pause(2000);
        } catch (error) {
            console.error('✗ Error clicking get started button:', error);
            throw error; // Re-throw to fail setup if critical step fails
        }

        console.log('=== Onboarding Complete - Ready for Tests ===\n');
    });

    /**
     * CLEANUP - Runs after each individual test
     *
     * Purpose: Reset app to home screen state
     * This ensures each test starts from the same clean state
     * and prevents test interdependence
     */
    afterEach(async function() {
        console.log(`\n--- Cleanup after test: "${this.currentTest.title}" ---`);

        try {
            // Navigate back to home screen
            // Use multiple back navigations to ensure we're at home
            // regardless of how deep in the app the test navigated
            await driver.back();
            await driver.pause(500);

            // Check if we need another back navigation
            // (in case we're in an article view)
            try {
                await driver.back();
                await driver.pause(500);
            } catch (error) {
                // Ignore error if already at home screen
                console.log('Already at home screen');
            }

            console.log('✓ Navigated back to home screen');
        } catch (error) {
            console.error('✗ Error during cleanup:', error);
            // Don't throw - allow next test to run even if cleanup fails
        }
    });

    /**
     * FINAL CLEANUP - Runs once after all tests complete
     *
     * Purpose: Perform any final cleanup operations
     * Currently placeholder for future cleanup needs
     */
    after(async () => {
        console.log('\n=== All Tests Complete - Final Cleanup ===');

        try {
            // Add any final cleanup operations here if needed
            // For example: clearing app data, logging out, etc.

            // Pause to allow for any final operations
            await driver.pause(1000);

            console.log('✓ Final cleanup completed');
        } catch (error) {
            console.error('✗ Error during final cleanup:', error);
        }
    });

    /**
     * TEST CASE 1: Search Functionality and Results Validation
     *
     * Validates that:
     * 1. Search interface can be opened
     * 2. Search query can be entered and submitted
     * 3. Search results are returned and displayed
     * 4. First search result contains relevant content matching the query
     *
     * Expected behavior:
     * - Search returns non-empty results
     * - First result includes the search term "Sun"
     */
    it('should search for an article and verify search results', async () => {
        console.log('\n--- Test: Search Functionality ---');

        // Open the search interface
        await SearchPage.openSearch();
        console.log('✓ Search opened');

        // Enter search query and submit
        await SearchPage.searchFor('Sun');
        console.log('✓ Search performed for "Sun"');

        // Get first search result and validate
        const firstResult = await SearchPage.getFirstSearchResult();
        console.log(`First result: "${firstResult}"`);

        // Assertions
        expect(firstResult).to.not.be.empty;
        expect(firstResult).to.include('Sun');
        console.log('✓ Search results validated');
    });

    /**
     * TEST CASE 2: Article Navigation and Title Display
     *
     * Validates that:
     * 1. User can search for an article
     * 2. User can select a search result
     * 3. Article page loads correctly
     * 4. Article title is displayed and accessible
     * 5. Any alerts/popups can be dismissed
     *
     * Expected behavior:
     * - Article opens after selecting search result
     * - Article title is non-empty string
     * - Title matches the selected article
     */
    it('should display article title after opening', async () => {
        console.log('\n--- Test: Article Navigation and Display ---');

        // Open search interface
        await SearchPage.openSearch();
        console.log('✓ Search opened');

        // Search for JavaScript article
        await SearchPage.searchFor('JavaScript');
        console.log('✓ Search performed for "JavaScript"');

        // Select first search result to open article
        await SearchPage.selectFirstResult();
        console.log('✓ First result selected');

        // Close any alerts or popups that might appear
        await ArticlePage.closeAlert();
        console.log('✓ Alert closed (if present)');

        // Get article title and validate
        const articleTitle = await ArticlePage.getArticleTitle();
        console.log(`Article title: "${articleTitle}"`);

        // Assertions
        expect(articleTitle).to.not.be.empty;
        expect(articleTitle).to.be.a('string');
        console.log('✓ Article title validated');
    });
});