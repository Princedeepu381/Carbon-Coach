// tests/e2e/logActivity.spec.ts
import { test, expect } from "@playwright/test";

test.describe("CarbonCoach Activity Logging E2E Flow", () => {
  test("successful login and activity log with AI nudge switch", async ({ page }) => {
    // 1. Visit Login Page
    await page.goto("/login");
    await expect(page).toHaveTitle(/CarbonCoach/);

    // 2. Perform Demo Login
    await page.click('text="Log In as Priya (Demo User)"');
    await page.waitForURL("/dashboard");
    
    // Ensure dashboard loads and greets the user
    await expect(page.locator("text=Hey Priya Sharma")).toBeVisible();
    await expect(page.getByText("Your Living World", { exact: true })).toBeVisible();

    // 3. Open Activity Logger Modal
    await page.click('text="+ Log Commute"');
    
    // Ensure Logger dialog is visible
    await expect(page.getByRole("heading", { name: /Log Activity/ })).toBeVisible();

    // 4. Fill in quantity (e.g. 20 km)
    await page.fill('input[type="number"]', "20");

    // 5. Wait for the debounced AI Coach suggestion card to pop up
    const nudgeCard = page.locator("text=AI Coach Suggestion");
    await expect(nudgeCard).toBeVisible({ timeout: 8000 });

    // Ensure the nudge card shows comparison stats
    await expect(page.locator("text=Current Choice")).toBeVisible();
    await expect(page.locator("text=Green Alternative")).toBeVisible();

    // 6. Accept the AI alternative recommendation (switch to metro)
    await page.getByRole("button", { name: /Switch to Green/i }).click();

    // Nudge card should dismiss and show green switch confirmation
    await expect(nudgeCard).not.toBeVisible();
    await expect(page.locator("text=Success! Switched to a greener alternative")).toBeVisible();

    // 7. Submit the activity log
    await page.click('button[type="submit"]:has-text("Log Activity")');

    // Modal should close and activities list should be populated
    await expect(page.getByRole("heading", { name: /Log Activity/ })).not.toBeVisible();
    
    // Check that Metro is listed in recent logs
    await expect(page.getByText("metro").first()).toBeVisible();
  });
});
