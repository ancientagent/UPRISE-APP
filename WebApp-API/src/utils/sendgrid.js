const sgMail = require('@sendgrid/mail');
const config = require('../config/index');

const verificationTempleteId = 'd-46130e5621414321af988e78b2f04c3b';
const resetPasswordTempleteId = 'd-07d6002739254ac7bb7a46a38fb5a1cc';
const bandInvitationTempleteId = 'd-04dc75311144461f8b931963de38f637';
const songReportTempleteId = 'd-159482c510484d37b229c230d4e32dee';

sgMail.setApiKey(config.mailer.API_KEY);

const sendUserVerificationEmail = async (user) => {
    try {
        const msg = {
            from: config.mailer.SENDER_MAIL,
            to: user.email,
            subject: 'user verification email',
            templateId: verificationTempleteId,
            dynamic_template_data: {
                USER_NAME: user.firstName,
                USER_EMAIL: user.email,
                ROLE:user.roleName,
                URL: `${config.web.WEB_URL}/register-success?token=${user.emailVerificationToken}`,
            },
        };
        await sgMail.send(msg);
        console.log('email sent successfully');
    } catch (error) {
        console.log(JSON.stringify(error.message));
    }
};

const sendResetPasswordEmail = async (user) => {
    try {
        const msg = {
            to: user.email,
            from: config.mailer.SENDER_MAIL,
            templateId: resetPasswordTempleteId,
            dynamic_template_data: {
                USER_NAME: user.firstName,
                BTN_URL: `${config.web.WEB_URL}/change-password?resetToken=${user.passwordResetToken}`,
            },
        };
        await sgMail.send(msg);
        console.log('email sent successfully');
        
    } catch (error) {
        console.log(JSON.stringify(error.message));
    }
};

const sendBandInvitationEmail = async (user) => {
    try{
        const msg = {
            to: user.email,
            from: config.mailer.SENDER_MAIL,
            templateId: bandInvitationTempleteId,
            dynamic_template_data: {
                URL: `${config.web.WEB_URL}/bandinvite?token=${user.invitationToken}`,
                BAND_NAME: user.title,
            },
        };
        await sgMail.send(msg);
        console.log('email sent successfully');
    }
    catch(error){
        console.log(JSON.stringify(error.message));
    }

};

const sendMailToAdmin = async (user) => {
    try {
        const msg = {
            to: config.mailer.ADMIN_MAIL,
            from: config.mailer.SENDER_MAIL,
            templateId:songReportTempleteId,
            dynamic_template_data: {
                USER_NAME:user.userName,
                SONG_NAME: user.songName,
                BAND_NAME:user.userName ,
                COMMENT: user.comment   
            },
                
        };
        await sgMail.send(msg);
        console.log('email sent successfully');
    } catch (error) {
        console.log(JSON.stringify(error.message));
    }
};

const sendMailToArtist = async (user) => {
    try {
        const msg = {
            to: user.email,
            from: config.mailer.SENDER_MAIL,
            templateId:songReportTempleteId,
            dynamic_template_data: {
                USER_NAME:user.userName,
                SONG_NAME: user.songName,
                BAND_NAME:user.userName ,
                COMMENT: user.comment   
            },
                
        };
        await sgMail.send(msg);
        console.log('email sent successfully');
    } catch (error) {
        console.log(JSON.stringify(error.message));
    }
};

const sendMail = async ({
    to,
    from,
    subject,
    text,
    html,
    templateId,
    dynamic_template_data,
}) => {
    try {
        const msg = {
            from: from || config.mailer.SENDER_MAIL,
            to,
            subject,
            text,
            html,
            templateId,
            dynamic_template_data,
        };
        await sgMail.send(msg);
        console.log('email sent successfully');
    } catch (error) {
        console.log(JSON.stringify(error));
    }
};

module.exports = {
    sendMail,
    sendUserVerificationEmail,
    sendResetPasswordEmail,
    sendBandInvitationEmail,
    sendMailToAdmin,
    sendMailToArtist
};
