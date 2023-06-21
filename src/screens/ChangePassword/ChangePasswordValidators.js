import * as yup from 'yup';
import { strings } from '../../utilities/localization/localization';

const passwordRegex = /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;
const ChangePasswordValidators = yup.object().shape({
  currentPassword: yup
    .string()
    .trim()
    .matches(passwordRegex, strings('SignupValidators.passwordValid'))
    .min(8, ({ min }) => `${(strings('SignupValidators.createPasswordRightText'))} ${min} ${strings('SignupValidators.createPasswordLeftText')}`)
    .required(strings('createNewPassword.currentPasswordRequired')),
  password: yup
    .string()
    .trim()
    .matches(passwordRegex, strings('SignupValidators.passwordValid'))
    .min(8, ({ min }) => `${(strings('SignupValidators.createPasswordRightText'))} ${min} ${strings('SignupValidators.createPasswordLeftText')}`)
    .required(strings('createNewPassword.passwordRequired')),
  confirmPassword: yup
    .string()
    .trim()
    .matches(passwordRegex, strings('SignupValidators.passwordValid'))
    .required(strings('createNewPassword.confirmPassword'))
    .when('password', {
      is: val => (!!(val && val.length > 0)),
      then: yup.string().oneOf(
        [yup.ref('password')],
        strings('createNewPassword.bothPassword'),
      ),
    }),
});
export default ChangePasswordValidators;
