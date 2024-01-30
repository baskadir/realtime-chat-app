const { formSchema } = require("@chat-app/common");

const validateForm = (req, res) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .then((valid) => {
      if (valid) console.log("Form is OK.");
      res.status(200).send();
    })
    .catch((err) => {
      console.log(err.errors);
      res.status(422).send();
    });
};

module.exports = validateForm;
