class SauceProductsPage {
  get menuButton() {
    return $('~open menu');
  }

  get loginMenuOption() {
    return $('~menu item log in');
  }

  get firstProduct() {
    return $(
      '(//android.view.ViewGroup[@content-desc="store item"])[1] | (//XCUIElementTypeOther[@name="store item"])[1]',
    );
  }

  get addToCartButton() {
    return $('~Add To Cart button');
  }

  get cartBadge() {
    return $('~cart badge');
  }

  get sortButton() {
    return $('~sort button');
  }

  get sortPriceLowToHigh() {
    return $('~priceAsc');
  }

  async navigateToLogin() {
    await this.menuButton.click();
    await driver.pause(1000);
    await this.loginMenuOption.click();
  }

  async sortByPriceLowToHigh() {
    await this.sortButton.click();
    await driver.pause(1000);
    await this.sortPriceLowToHigh.click();
  }
}

export default new SauceProductsPage();
