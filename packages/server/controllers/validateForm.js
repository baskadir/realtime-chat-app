const { formSchema } = require("@chat-app/common");

const validateForm = (req, res) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .then((valid) => {
      if (valid) console.log("Form is OK.");
    })
    .catch((err) => {
      console.log(err.errors);
      res.status(422).send();
    });
};

module.exports = validateForm;
