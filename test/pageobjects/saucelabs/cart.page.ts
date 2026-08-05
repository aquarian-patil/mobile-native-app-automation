class SauceCartPage {
  get checkoutButton() {
    return $('~Proceed To Checkout button');
  }

  get fullNameInput() {
    return $('~Full Name* input field');
  }

  get addressLine1Input() {
    return $('~Address Line 1* input field');
  }

  get cityInput() {
    return $('~City* input field');
  }

  get zipInput() {
    return $('~Zip Code* input field');
  }

  get countryInput() {
    return $('~Country* input field');
  }

  get toPaymentButton() {
    return $('~To Payment button');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async enterShippingDetails(
    name: string,
    address: string,
    city: string,
    zip: string,
    country: string,
  ) {
    await this.fullNameInput.setValue(name);
    await this.addressLine1Input.setValue(address);
    await this.cityInput.setValue(city);
    await this.zipInput.setValue(zip);
    await this.countryInput.setValue(country);
    await driver.pause(1000);
    await this.toPaymentButton.click();
  }
}

export default new SauceCartPage();
