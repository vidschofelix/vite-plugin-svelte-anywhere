import type { Config } from 'tailwindcss';
import {isolateInsideOfContainer, scopedPreflightStyles} from "tailwindcss-scoped-preflight";

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
    }
  },

  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer('.twp', {
        except: '.no-twp', // optional, to exclude some elements under .twp from being preflighted, like external markup
      }),
    }),
  ]
} satisfies Config;
