// utils/sendEmail.ts
export interface SendEmailOptions {
  to?: string[];
  bcc?: string[];
  subject?: string;
  body?: string;
}

const sendEmail = ({ to = [], bcc = [], subject = '', body = '' }: SendEmailOptions): void => {
  const params = new URLSearchParams();

  if (to.length) params.set('to', to.join(','));
  if (bcc.length) params.set('bcc', bcc.join(','));
  if (subject) params.set('su', subject);
  if (body) params.set('body', body);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&${params.toString()}`;
  window.open(gmailUrl, '_blank');
};

export default sendEmail;
