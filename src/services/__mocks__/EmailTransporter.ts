interface SendMailArgs {
    from: string;
    to: string;
    subject: string;
    html: string;
}

export const transporter = {
    sendMail: jest.fn().mockImplementation(
        (args: SendMailArgs) => {
        
       }
    )
}
