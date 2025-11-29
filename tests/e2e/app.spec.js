import { test, expect } from '@playwright/test';

test.describe('Dictionary App', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load the homepage', async ({ page }) => {
        await expect(page).toHaveTitle(/LexiFlow/);
        await expect(page.locator('h1')).toContainText('LexiFlow');
    });

    test('should search for a word', async ({ page }) => {
        const input = page.locator('#search-input');
        const button = page.locator('#search-btn');

        // Search for "hello"
        await input.fill('hello');
        await button.click();

        // Check results
        const resultContainer = page.locator('#result-container');
        await expect(resultContainer).toBeVisible();
        await expect(resultContainer.locator('h2')).toHaveText('hello');
        // Part of speech might vary or text matching might be tricky, checking something more generic or exact
        await expect(page.locator('text=noun').first()).toBeVisible();
    });

    test('should search as you type', async ({ page }) => {
        const input = page.locator('#search-input');

        // Type "world"
        await input.fill('world');

        // Wait for debounce and result (debounce is 500ms)
        const resultContainer = page.locator('#result-container');
        await expect(resultContainer).toBeVisible({ timeout: 5000 });
        await expect(resultContainer.locator('h2')).toHaveText('world');
    });

    test('should handle "no definitions found"', async ({ page }) => {
        const input = page.locator('#search-input');
        await input.fill('asdfghjklqwertyuiop'); // Nonsense word
        await page.locator('#search-btn').click();

        const errorContainer = page.locator('#error');
        await expect(errorContainer).toBeVisible();
        await expect(page.locator('#error-msg')).toContainText('definitions');
    });

    test('should toggle theme', async ({ page }) => {
        const toggle = page.locator('#theme-toggle');
        const html = page.locator('html');

        // Check initial state (should be light or based on system, but let's assume default is light in our clean env)
        // If system preference is dark, this might fail, so let's check the toggle behavior
        const initialClass = await html.getAttribute('class');

        await toggle.click();

        // Wait for class change
        await expect(html).not.toHaveClass(initialClass || '');

        if (initialClass?.includes('dark')) {
            await expect(html).not.toHaveClass(/dark/);
        } else {
             await expect(html).toHaveClass(/dark/);
        }
    });

    test('should manage history', async ({ page }) => {
        // Search for a word
        await page.locator('#search-input').fill('code');
        await page.locator('#search-btn').click();
        await expect(page.locator('#result-container')).toBeVisible();

        // Open history
        await page.locator('#history-toggle').click();
        const historyModal = page.locator('#history-modal');
        await expect(historyModal).toBeVisible();

        // Check if word is in history
        await expect(page.locator('.history-item')).toContainText('code');

        // Close history
        await page.locator('#close-history').click();
        await expect(historyModal).toBeHidden();
    });
});
