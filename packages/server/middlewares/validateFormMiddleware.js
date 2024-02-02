const { authFormSchema } = require("@chat-app/common");

const validateForm = (req, res, next) => {
  const formData = req.body;
  authFormSchema
    .validate(formData)
    .then((valid) => {
      if (valid) {
        console.log("Form is OK.");
        next();
      } else {
        res.status(422).send();
      }
    })
    .catch((err) => {
      res.status(422).send();
    });
};

module.exports = { validateForm };
