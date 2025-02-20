import { BaseUrl } from "../initApp/initApp";
import { eventEmitter } from "./eventEmitter"
import { sendEmail } from "./sendEmail"
import template_Email from "./templeteEmail"

console.log("🔄 Email event listener is registered..."); // ✅ Add this log to check if file is loaded



eventEmitter.on("confirmEmail", async ({ email, vCode }) => {
    const subject = "Confirm Email";
    console.log(BaseUrl);
    const link = `${process.env.MOOD == "production" ?
        "https://clothingapp-production-681d.up.railway.app"
        : "http://localhost:3050"
        }/api/v1/auth/confirmEmail/${vCode}`;
    console.log({ link });
    const html = template_Email(link);

    const info = await sendEmail({ to: email, subject, html });

    if (!info) {
        console.error(`❌ Email delivery failed for ${email}`);
    } else {
        console.log({ link });
        console.log(`✅ Email sent to ${email}`);

    }

})