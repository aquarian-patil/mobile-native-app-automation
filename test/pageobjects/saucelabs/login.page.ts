class SauceLoginPage {
  get usernameInput() {
    return $('~Username input field');
  }

  get passwordInput() {
    return $('~Password input field');
  }

  get loginButton() {
    return $('~Login button');
  }

  get errorMessage() {
    return $('~Provided credentials do not match any user in this service.');
  }

  async login(username: string, password: string) {
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }
}

export default new SauceLoginPage();
