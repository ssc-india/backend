const getEmailTemplate = (name: string) => {
    return `
        <html>
            <head>
                <style>
                </style>
            </head>
            <body>
                <h1>Verify your Email Address</h1>
                Hi, ${name}<br>
                <p>
                    We recently received a registration request from you for signing up on ssc-india.github.io. Please click the link below to verify your email<br>
                    <a href="https://ssc-india.github.io/verify/1234">Verify Email</a>
                    <br>
                    <br>
                    If you face trouble verifying your email address, please contact our support team at <a href="https://ssc-india.github.io/support">https://ssc-india.github.io/support</a>
                </p>
            <body>
        </html>
    `
}

export { getEmailTemplate }
