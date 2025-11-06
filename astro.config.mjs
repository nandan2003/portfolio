import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
    output: 'server',    // must not be "hybrid" or "static"
    adapter: vercel(),
 // <-- Replace with your actual domain

    // Single page, no prefetch needed
    prefetch: false,

    integrations: [tailwind(), sitemap(), compress({
        CSS: true,
        SVG: false,
        Image: false,
        HTML: {
            "html-minifier-terser": {
                collapseWhitespace: true,
                // collapseInlineTagWhitespace: true, // It breaks display-inline / flex-inline text
                minifyCSS: true,
                minifyJS: true,
                removeComments: true,
                removeEmptyAttributes: true,
                // removeEmptyElements: true, // It removes sometimes SVGs
                removeRedundantAttributes: true
            },
        },
        JavaScript: {
            'terser': {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                }
            }
        }
    }), react()]
});