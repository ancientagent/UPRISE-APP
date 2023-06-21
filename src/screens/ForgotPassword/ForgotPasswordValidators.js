import * as yup from 'yup';
import { strings } from '../../utilities/localization/localization';

const ForgotPasswordValidators = yup.object().shape({
  email: yup
    .string()
    .email(strings('loginValidation.validEmail'))
    .required(strings('loginValidation.emailRequired')),
});
export default ForgotPasswordValidators;
