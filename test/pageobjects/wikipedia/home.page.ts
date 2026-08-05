class WikipediaHomePage {
  // Wikipedia Android/iOS generic selectors
  get searchBox() {
    return $('~Search Wikipedia');
  }

  get searchInput() {
    return $(
      '//android.widget.AutoCompleteTextView[@resource-id="org.wikipedia.alpha:id/search_src_text"] | //XCUIElementTypeSearchField',
    );
  }

  get searchResults() {
    return $$(
      '//android.widget.TextView[@resource-id="org.wikipedia.alpha:id/page_list_item_title"] | //XCUIElementTypeCell',
    );
  }

  get settingsTab() {
    return $('~Settings');
  }

  async searchFor(query: string) {
    await this.searchBox.click();
    await this.searchInput.setValue(query);
  }
}

export default new WikipediaHomePage();
