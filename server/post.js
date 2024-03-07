const nodemailer = require('nodemailer');
const _ = require('lodash');

// Настройки для отправки электронной почты
const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
        user: 't.data@internet.ru',
        pass: 'tiEnkFnTrJafwPAgmU08'
    }
});

// Отправка уведомления на почту
function sendEmailNotification(recipients,res ) {
    console.log(recipients , 'да я тута получил в постах ебучих')
    const mailOptions = {
        from: 't.data@internet.ru',
        to:  recipients.join(','),
        //to: 'arcen.dreyman@bk.ru',
        subject: 'Notification: Last Element Changed Drastically',
        text: 'The last element in the array has changed significantly.' + res
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error('Error sending email notification:', error);
        } else {
            console.log('Email notification sent:', info.response);
        }
    });
}

// Проверка изменений в массиве
 function checkForChanges(previousLastElement, currentLastElement,recipients) {
    console.log(currentLastElement - previousLastElement)
    console.log(recipients)
    // Проверка на значительное изменение (в данном случае, изменение на 10 или более)
    if (Math.abs(currentLastElement - previousLastElement) >= 100) {
        sendEmailNotification(recipients,currentLastElement - previousLastElement);
    }
}
module.exports = checkForChanges;
