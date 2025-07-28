import { marked } from "marked";

export function renderMarkdown(markdown: string): string {
  // Configure marked with GUARDIANCHAIN branding
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Add GUARDIANCHAIN styling to the rendered HTML
  const html = marked.parse(markdown);

  // Wrap in GUARDIANCHAIN email template
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #4c1d95 50%, #1e293b 100%); color: #f1f5f9; padding: 20px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #10b981); padding: 12px; border-radius: 8px; display: inline-block; margin-bottom: 10px;">
          <span style="color: white; font-size: 20px; font-weight: bold;">🛡️ GUARDIANCHAIN</span>
        </div>
      </div>
      <div style="background: rgba(15, 23, 42, 0.7); padding: 20px; border-radius: 8px; border: 1px solid #475569;">
        ${html}
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #94a3b8;">
        <p>© 2025 GUARDIANCHAIN. Digital Sovereignty Secured.</p>
        <p>
          <a href="https://guardianchain.app/profile" style="color: #8b5cf6;">Manage Preferences</a> | 
          <a href="https://guardianchain.app/legal/privacy" style="color: #10b981;">Privacy Policy</a>
        </p>
      </div>
    </div>
  `;
}
