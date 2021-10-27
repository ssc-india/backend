const getEmailTemplate = (name: string) => {
    return ` 
        <html>
            <head>
                <style>
                    * {
                        font-family: 'Open sans', sans-serif;
                    }

                    #container {
                        width: 25%;
                        margin: auto;
                        border: 5px solid #777777;
                        border-radius: 15px;
                        padding: 0 10px 10px 10px;
                    }

                    #container h1 {
                        text-align: center;
                    }

                    #link {
                        text-decoration: none;
                        padding: 12px 25px;
                        margin: 10px auto;
                        background-color: blue;
                        color: white;
                        border: 1px solid blue;
                        border-radius: 50px;
                    }

                    #link-container {
                        display: flex;  
                    }
                </style>
            </head>
            <body>
                <div id="container">
                    <h1>Verify your Email Address</h1>
                    Hi, ${name}<br>
                    <p>
                        We recently received a registration request from you for signing up on ssc-india.github.io. Please click the link below to verify your email
                        <div id="link-container">
                            <a id="link" href="https://ssc-india.github.io/verify/1234">Verify Email</a>
                        </div>
                        <p>
                            If you face trouble verifying your email address, please contact our support team at <a href="https://ssc-india.github.io/support">https://ssc-india.github.io/support</a>
                        </p>
                    </p>
                </div>
            <body>
        </html>
    `
}

export { getEmailTemplate }
