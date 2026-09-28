# personal-site

Source code of [marcolagala.com](https://marcolagala.com), the personal site of Marco La Gala, Mobile Engineer based in Turin, Italy.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components)
- [Tailwind CSS v4](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com)
- [next-intl](https://next-intl.dev) for English and Italian
- MDX blog posts read from a separate GitHub repository
- Deployed on [Vercel](https://vercel.com)

## Running locally

```bash
npm install
cp .env.local.example .env.local
npm run dev     # http://localhost:3000
npm run check   # typecheck, lint and format check
```

The site runs without any environment variable. The blog is off by default (`NEXT_PUBLIC_BLOG_ENABLED`):
to enable it, point `LOCAL_CONTENT_DIR` to a folder with `posts/*.mdx`, or set `GITHUB_TOKEN` and `PRIVATE_CONTENT_REPO`.
See `.env.local.example` for every option.

## Structure

```
app/[locale]/     Pages: home, about, projects, blog
content/          Site settings and localized content (bio, experience, projects)
messages/         UI strings in English and Italian
lib/              Posts, SEO, structured data
components/       UI, layout and MDX components
```

## License

Feel free to take inspiration from the code or reuse parts of it.

The content is personal and not covered by this: texts, photo, CV and blog posts belong to me, so please don't republish them.
The app icons in `public/apps` are trademarks of their respective owners and are shown only to reference the apps I worked on.
