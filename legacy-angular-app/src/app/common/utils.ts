import * as _ from "lodash";

//required error validations
export const inputValidations = (form: any, type: any):boolean => {
  return (
    (form.get(type).touched || form.get(type).dirty) &&
    form.get(type).errors !== null &&
    form.get(type).errors.required
  );
};

//pattern validation
export const patterntValidations = (form: any, type: any) => {
  return (
    (form.get(type)?.touched || form.get(type)?.dirty) &&
    form.get(type).errors !== null &&
    form.get(type).errors.pattern
  );
};
// genre validation
export const checkgenres = (form: any, genre: any, genresList: any) => {
  if (
    (form.get(genre).touched || form.get(genre).dirty) &&
    genresList.length > 3
  ) {
    return true;
  } else {
    return false;
  }
};

// location validation
export const checklocation = (
  form: any,
  cityName: any,
  formattedaddress: any,
  typedaddress: any
) => {
  if (
    (form.get(cityName).touched || form.get(cityName).dirty) &&
    formattedaddress !== typedaddress
  ) {
    return true;
  }
};

// admin check band
export const checkband = (
  form: any,
  band: any,
  selectedmail: any,
  enteredEmail: any
) => {
  if (
    (form.get(band).touched || form.get(band).dirty) &&
    selectedmail !== enteredEmail
  ) {
    return true;
  }
};

// event time form validations
export const checkDateValidation = (eventsForm, startTime, endTime) => {
  if (
    (eventsForm.get(endTime).touched ||
      eventsForm.get(endTime).dirty ||
      eventsForm.get(startTime).touched ||
      eventsForm.get(startTime).dirty) &&
    eventsForm.get(startTime).value > eventsForm.get(endTime).value
  ) {
    return true;
  }
  var timeDiff =
    eventsForm.get(endTime).value - eventsForm.get(startTime).value;
  if (
    (eventsForm.get(endTime).touched ||
      eventsForm.get(endTime).dirty ||
      eventsForm.get(startTime).touched ||
      eventsForm.get(startTime).dirty) &&
    timeDiff <= 45*60*1000
  ) {
    return true;
  }
};

// password error validations
export const checkPassword = (form, password, confirmpassword) => {
  return (
    (form.get(password).touched || form.get(password).dirty) &&
    form.get(password).value !== form.get(confirmpassword).value
  );
};

// change password error validation
export const changePassword = (
  changepasswordForm,
  password,
  confirmpassword
) => {
  return (
    (changepasswordForm.get(password).touched ||
      changepasswordForm.get(password).dirty) &&
    changepasswordForm.get(password).value !==
      changepasswordForm.get(confirmpassword).value
  );
};

// change password error validation
export const changeOldPassword = (
  changepasswordForm,
  oldpassword,
  newpassword
) => {
  return (
    (changepasswordForm.get(newpassword).touched ||
      changepasswordForm.get(newpassword).dirty) &&
    changepasswordForm.get(newpassword).value ==
      changepasswordForm.get(oldpassword).value
  );
};

// password error validations
export const checkPasswordadmin = (
  usermanagementForm,
  password,
  confirmpassword
) => {
  return (
    (usermanagementForm.get(password).touched ||
      usermanagementForm.get(password).dirty) &&
    usermanagementForm.get(password).value !==
      usermanagementForm.get(confirmpassword).value
  );
};