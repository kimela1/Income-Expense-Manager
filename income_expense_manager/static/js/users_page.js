window.addEventListener("load", function(e) {
      var form = document.getElementById("users-form");
      form.addEventListener("submit", function(e){ 
        var password = document.getElementById("password-input").value,
            repassword = document.getElementById("password-reinput").value;
        if (!password || !repassword || password !== repassword) {
            e.preventDefault();
            alert("The passwords do not match or are blank");
        }
      });
});