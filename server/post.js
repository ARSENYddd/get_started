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
function sendEmailNotification() {
    const mailOptions = {
        from: 't.data@internet.ru',
        to: 'arcen.dreyman@bk.ru',
        subject: 'Notification: Last Element Changed Drastically',
        text: 'The last element in the array has changed significantly.'
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
function checkForChanges(previousArray, currentArray) {
    const previousLastElement = _.last(previousArray);
    const currentLastElement = _.last(currentArray);

    // Проверка на значительное изменение (в данном случае, изменение на 10 или более)
    if (Math.abs(currentLastElement - previousLastElement) >= 10) {
        sendEmailNotification();
    }
}

// Пример массива данных
let previousData = [1, 2, 3, 4, 5];

// Пример данных с изменением в последнем элементе
let currentData = [1, 2, 3, 4, 15];

// Проверка изменений
checkForChanges(previousData, currentData);
