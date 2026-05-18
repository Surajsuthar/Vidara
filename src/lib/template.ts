export const signupTemplate = (name: string) => {
  return `
    <div style="background:#0b0b0f;padding:40px 20px;font-family:Inter,Arial,sans-serif;color:#f5f5f5;">
      <div style="max-width:560px;margin:0 auto;background:#111218;border:1px solid #232532;border-radius:20px;overflow:hidden;">
        <div style="padding:32px 32px 20px;border-bottom:1px solid #232532;background:linear-gradient(135deg,#171923 0%,#111218 100%);">
          <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af;">
            Welcome to Vidara
          </p>
          <h1 style="margin:0;font-size:28px;line-height:1.2;color:#ffffff;font-weight:700;">
            Hey ${name}, your creative studio is ready
          </h1>
        </div>

        <div style="padding:32px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#d1d5db;">
            Thanks for signing up for <strong style="color:#ffffff;">Vidara</strong>.
            You’re all set to start exploring AI image generation with your favorite models.
          </p>

          <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#d1d5db;">
            Jump in, try a prompt, explore different styles, and bring your ideas to life faster.
          </p>

          <div style="margin:24px 0;padding:20px;border:1px solid #232532;border-radius:16px;background:#0f1117;">
            <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#ffffff;">What you can do next</p>
            <ul style="margin:0;padding-left:18px;color:#cbd5e1;font-size:14px;line-height:1.8;">
              <li>Choose from multiple AI image models</li>
              <li>Fine-tune quality, size, and aspect ratio</li>
              <li>Generate visuals asynchronously and get notified when they’re ready</li>
            </ul>
          </div>

          <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:#9ca3af;">
            We’re excited to have you here.<br />
            — The Vidara team
          </p>
        </div>
      </div>
    </div>
  `;
};
