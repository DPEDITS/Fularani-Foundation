const sendEmail = async (options) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined in environment variables");
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "Fularani Foundation <noreply@kb.fularanifoundation.org>";

  let response;
  try {
    // Call Resend's HTTP REST API to bypass Render's SMTP firewall
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: options.email,
        subject: options.subject,
        html: options.html,
      }),
    });
  } catch (error) {
    console.error("Fetch/Network Error while sending email via Resend:", error);
    throw new Error(`Failed to reach Resend API: ${error.message}`);
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (parseError) {
      const text = await response.text().catch(() => "No response body");
      console.error("Resend API returned non-JSON error:", text);
      throw new Error(`Resend API error (${response.status}): ${text}`);
    }
    console.error("Resend API Error:", errorData);
    throw new Error(errorData.message || `Resend Error (${response.status}): ${JSON.stringify(errorData)}`);
  }

  try {
    const data = await response.json();
    return data;
  } catch (err) {
    return { success: true }; // Probably sent but returned weirdly (empty body)
  }
};

export default sendEmail;
