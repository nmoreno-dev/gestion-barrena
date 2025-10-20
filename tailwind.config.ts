// tailwind.config.ts
import { type Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('daisyui')],
};

export default config;
