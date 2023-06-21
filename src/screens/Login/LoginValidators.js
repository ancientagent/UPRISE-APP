import * as yup from 'yup';
import { strings } from '../../utilities/localization/localization';

const loginValidationSchema = yup.object().shape({
  emailorUserName: yup
    .string()
    .required(strings('loginValidation.emailorUserName')),
  password: yup
    .string()
    .min(8, ({ min }) => `${(strings('SignupValidators.createPasswordRightText'))} ${min} ${strings('SignupValidators.createPasswordLeftText')}`)
    .required(strings('loginValidation.passwordRequired')),
});
export default loginValidationSchema;
