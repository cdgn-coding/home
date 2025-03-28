import fs from 'fs'
import path from 'path'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import { matter } from 'vfile-matter'
import { remark } from 'remark';

type Metadata = {
  title: string
  slug: string
  date: string
  description: string
  tags: string[]
  originalUri?: string
}

export type BlogPost = {
  locale: string
  metadata: Metadata
  content: string
  folder: string
}

async function parseFrontmatter(fileContent: string) {
  const file = await remark()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(() => (tree, file) => {
      matter(file)
    })
    .process(fileContent)

  const metadata = file.data.matter as Metadata
  const content = String(file)

  return { metadata, content }
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  const posts = fs.readdirSync(dir)
  
  const mdxFiles = posts.flatMap((post) => {
    return fs.readdirSync(path.join(dir, post)).map((file) => {
      return path.join(post, file)
    })
  })

  return mdxFiles
    .filter((file) => file.includes('.mdx'))
    .map(async (file: string) => {
    const { metadata, content } = await readMDXFile(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))
    const locale = file.split('.')[0].split('/')[1]
    const folder = file.split('.')[0].split('/')[0]
    return {
      locale,
      metadata: metadata as Metadata,
      slug,
      content,
      folder,
    }
  })
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsPath = path.join(process.cwd(), 'src', 'content', 'blog')
  return await Promise.all(getMDXData(postsPath))
}
