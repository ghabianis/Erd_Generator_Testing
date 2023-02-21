// sendinblue email sender SDK
var SibApiV3Sdk = require('@sendinblue/client');

export const sendEmail_SendinBlue = async (sendSmtpEmail: any) => {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
    apiInstance.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, process.env.SENDINBLEU_API_KEY)
    const transport = await apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        return data;
    }, function (error: any) {
        console.log('API called unsuccessfully. Returned error: ' + JSON.stringify(error));
        return error;
    });
    console.log(transport, 'transport');
}
