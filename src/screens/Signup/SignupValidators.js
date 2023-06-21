import * as yup from 'yup';
import { strings } from '../../utilities/localization/localization';

const passwordRegex = /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;
const SignupValidators = value => yup.object().shape({
  privacyCheck: yup
    .boolean().oneOf([true]),
  userName: yup
    .string()
    .max(25, ({ max }) => `${(strings('SignupValidators.userNameLength'))} ${max} ${(strings('SignupValidators.characters'))}`)
    .required(strings('SignupValidators.userNameRequired')),
  email: yup
    .string()
    .email(strings('SignupValidators.validEmail'))
    .required(strings('SignupValidators.emailRequired')),
  bandName: value ? yup.string().required('band name required').max(25, ({ max }) => `The max length of bandname is ${max} ${(strings('SignupValidators.characters'))}`) : yup.string().ensure(),
  password: yup
    .string()
    .trim()
    .matches(passwordRegex, strings('SignupValidators.passwordValid'))
    .min(8, ({ min }) => `${(strings('SignupValidators.createPasswordRightText'))} ${min} ${strings('SignupValidators.createPasswordLeftText')}`)
    .required(strings('SignupValidators.passwordRequired')),
  confirmPassword: yup
    .string()
    .trim()
    .required(strings('SignupValidators.confirmPassword'))
    .when('password', {
      is: val => (!!(val && val.length > 0)),
      then: yup.string().oneOf(
        [yup.ref('password')],
        strings('SignupValidators.bothPassword'),
      ),
    }),
});
export default SignupValidators;
