import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const source = path.resolve('public/images/hero-reef.png')
const outDir = path.resolve('public/images')
const widths = [640, 960, 1280, 1920]

await mkdir(outDir, { recursive: true })

for (const width of widths) {
  const avifPath = path.join(outDir, `hero-reef-${width}.avif`)
  const webpPath = path.join(outDir, `hero-reef-${width}.webp`)

  await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .avif({ quality: 48, effort: 9 })
    .toFile(avifPath)

  await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 62, effort: 6 })
    .toFile(webpPath)

  console.log(`wrote ${path.basename(avifPath)} and ${path.basename(webpPath)}`)
}
