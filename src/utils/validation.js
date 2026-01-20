const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "aboutMe",
    "photoUrl",
    "skills",
    "location",
    "role",
    "dateOfBirth",
  ];

  const isAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isAllowed;
};

module.exports = {validateProfileEditData};