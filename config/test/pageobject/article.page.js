class ArticlePage {
    // Locators
    get articleTitle() {
        return $('//android.view.View[@text="JavaScript"]');
    }

    get closeButton() {
        return $('id=org.wikipedia.alpha:id/closeButton');
    }

    // Actions
    async getArticleTitle() {
        await this.articleTitle.waitForDisplayed({ timeout: 5000 });
        return await this.articleTitle.getText();
    }

    async closeAlert() {
        await this.closeButton.waitForDisplayed({ timeout: 5000 });
        await this.closeButton.click();
    }
}

module.exports = new ArticlePage();