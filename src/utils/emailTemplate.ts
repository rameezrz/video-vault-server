import mailGen from "mailgen";

export const emailTemplate = (firstName: string, password: string): string => {
  const mailGenerator = new mailGen({
    theme: "default",
    product: {
      name: "Video Vault",
      link: "https://video-vault-client.vercel.app",
    },
  });

  const email = {
    body: {
      name: firstName,
      intro: "Welcome to Your Application! Here is your password:",
      action: {
        instructions: `Your temporary password is: <b>${password}</b>`,
        button: {
          color: "#22BC66",
          text: "Log In Here",
          link: "https://video-vault-client.vercel.app",
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const emailBody = mailGenerator.generate(email);

  return emailBody;
};
