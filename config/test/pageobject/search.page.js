class SearchPage {
    // Locators
    get searchContainer() {
        return $('id=org.wikipedia.alpha:id/search_container');
        
    }

    get searchInput() {
        return $('id=org.wikipedia.alpha:id/search_src_text');
    }

    get firstSearchResult() {
        return $('id=org.wikipedia.alpha:id/page_list_item_title');
    }

    // Actions
    async openSearch() {
        await this.searchContainer.waitForDisplayed({ timeout: 5000 });
        await this.searchContainer.click();
    }

    async searchFor(searchTerm) {
        await this.searchInput.waitForDisplayed({ timeout: 5000 });
        await this.searchInput.setValue(searchTerm);
    }

    async getFirstSearchResult() {
        await this.firstSearchResult.waitForDisplayed();
        return await this.firstSearchResult.getText();
    }

    async selectFirstResult() {
        await this.firstSearchResult.click();
    }
}

module.exports = new SearchPage();