import { eventEmitter } from "./eventEmitter"
import { sendEmail } from "./sendEmail"
import template_Email from "./templeteEmail"

console.log("🔄 Email event listener is registered..."); // ✅ Add this log to check if file is loaded



eventEmitter.on("confirmEmail", async ({ email, vCode }) => {
    const subject = "Confirm Email";
    const link = `${process.env.ONLINE_BASE_URL}/auth/confirmEmail/${vCode}`;
    const html = template_Email(link);

    const info = await sendEmail({ to: email, subject, html });

    if (!info) {
        console.error(`❌ Email delivery failed for ${email}`);
    } else {
        console.log(`✅ Email sent to ${email}`);
    }

})