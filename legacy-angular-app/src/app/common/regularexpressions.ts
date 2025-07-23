export const regularExpressions = {
    emailExp:"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$",
    oldemailExp:"^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
    passwordExp:/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/,
    titleExp:/^(?=.*[a-zA-Z]).+$/
              // '^(?=.*[a-zA-z]).+$'
  };