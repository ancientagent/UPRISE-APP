/* this file will include reusable functions/methods  */


const isValidEmail = (email) => {
    const isEmail =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return isEmail.test(email);
};

const isValidMobile = (mobile) => {
    const mobleRegex = /^([0|+[0-9]{1,5})?([7-9][0-9]{9})$/;
    return mobleRegex.test(mobile);
};
const isvalidPassword = (password) => {
    const passwordRegex =
    // eslint-disable-next-line no-useless-escape
    /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;
    return passwordRegex.test(password);
};
const isValidFirstName = (firstName) => {
    // eslint-disable-next-line no-useless-escape
    const firstNameRegex = /^[a-zA-Z\-]+$/;
    return firstNameRegex.test(firstName);
};
const isValidLastName = (lastName) => {
    // eslint-disable-next-line no-useless-escape
    const lastNameRegex = /^[a-zA-Z\-]+$/;
    return lastNameRegex.test(lastName);
};
const isValidUserName = (userName) => {
    // eslint-disable-next-line no-useless-escape
    const userNameRegex = /^[_A-z0-9]{1,}$/;
    return userNameRegex.test(userName);
};

module.exports = {
    isValidEmail,
    isValidMobile,
    isvalidPassword,
    isValidFirstName,
    isValidLastName,
    isValidUserName
};
