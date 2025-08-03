import * as yup from 'yup';
import {strings} from '../../utilities/localization/localization';

const passwordRegex = /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;

const SignupValidators = (value, isPage1 = false) => {
  const baseSchema = {
    userName: yup
      .string()
      .max(
        25,
        ({max}) =>
          `${strings('SignupValidators.userNameLength')} ${max} ${strings(
            'SignupValidators.characters',
          )}`,
      )
      .required(strings('SignupValidators.userNameRequired')),
    email: yup
      .string()
      .email(strings('SignupValidators.validEmail'))
      .required(strings('SignupValidators.emailRequired')),
    password: yup
      .string()
      .trim()
      .matches(passwordRegex, strings('SignupValidators.passwordValid'))
      .min(
        8,
        ({min}) =>
          `${strings(
            'SignupValidators.createPasswordRightText',
          )} ${min} ${strings('SignupValidators.createPasswordLeftText')}`,
      )
      .required(strings('SignupValidators.passwordRequired')),
    confirmPassword: yup
      .string()
      .trim()
      .oneOf(
        [yup.ref('password'), null],
        strings('SignupValidators.confirmPasswordValid'),
      )
      .required(strings('SignupValidators.confirmPasswordRequired')),
    artistCheck: yup.boolean(),
    bandName: yup.string().when('artistCheck', {
      is: true,
      then: yup
        .string()
        .required('Band/Artist name is required when registering as artist')
        .max(50, ({max}) => `Band name must be ${max} characters or less`),
      otherwise: yup.string().notRequired(),
    }),
    acceptTerms: yup
      .boolean()
      .oneOf([true], 'You must accept the Terms and Conditions'),
  };

  return yup.object().shape(baseSchema);
};

export default SignupValidators;
