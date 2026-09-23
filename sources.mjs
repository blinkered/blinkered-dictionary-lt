/**
 * The collections that attest Lithuanian, and where each comes from.
 *
 * Lithuanian has a 202,690-word candidate list, the inflected forms of a language with seven
 * cases and a rich participle system, against a 240MB Wikipedia, Leipzig news, a Tatoeba larger
 * than most in this batch, and a whole Bible. Project Gutenberg has no Lithuanian text.
 *
 * Every URL here was probed before it was written down. A collection that 404s does not fail
 * loudly; the build skips it with a warning and reports a healthy number over fewer families.
 */
import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import { createInterface } from 'node:readline'
import {
  fileDocuments,
  fineweb2Documents,
  harvestDocuments,
  leipzigLocators,
  leipzigSentences,
  tatoebaDocuments,
  verseDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

export const LANGUAGE = 'lt'

const CACHE = new URL('.cache/raw/', import.meta.url).pathname

/** A Leipzig package, with its sentence-to-URL index resolved up front. */
function leipzig(pkg) {
  const base = `${CACHE}${pkg}/${pkg}`
  // A few crawled URLs contain a literal space, and the evidence format spends spaces as
  // separators, so the build refuses them. Percent-encoded they name the same page.
  const locators = leipzigLocators(
    readFileSync(`${base}-inv_so.txt`, 'utf8'),
    readFileSync(`${base}-sources.txt`, 'utf8').replaceAll(' ', '%20'),
  )
  const lines = createInterface({
    input: createReadStream(`${base}-sentences.txt`),
    crlfDelay: Infinity,
  })
  return leipzigSentences(lines, locators)
}

// News only. The Leipzig Wikipedia packages are deliberately absent: they are Wikipedia text
// wearing a Leipzig label, so including one would corroborate `wiki:lt` while looking like
// another family. 2020 news is the newest 1M Lithuanian package; the 2016 news crawl is the second.
const LEIPZIG = ['lit_news_2020_1M', 'lit_newscrawl_2016_1M']

// The ISO code only. The most downloaded items the Archive files under the English name
// "Lithuanian" include Spanish, Indonesian and Berber uploads, so `lit` is chosen on purpose.
const ARCHIVE_QUERY = 'language:lit AND mediatype:texts'

const ALL = [
  {
    id: 'wiki:lt',
    what: 'Lithuanian Wikipedia; modern encyclopedic prose',
    needs: `${CACHE}ltwiki.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}ltwiki.xml.bz2`),
  },
  {
    id: 'wikisource:lt',
    what: 'Lithuanian Wikisource; same Wikimedia family, so it corroborates rather than counts',
    needs: `${CACHE}ltwikisource.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}ltwikisource.xml.bz2`),
  },
  ...LEIPZIG.map((pkg) => ({
    id: `lz:${pkg}`,
    from: `https://downloads.wortschatz-leipzig.de/corpora/${pkg}.tar.gz`,
    what: `Leipzig ${pkg}; modern news, cited by the page each sentence came from`,
    needs: `${CACHE}${pkg}`,
    documents: () => leipzig(pkg),
  })),
  {
    id: 'tat',
    from: 'https://downloads.tatoeba.org/exports/per_language/lit/lit_sentences.tsv.bz2',
    what: 'Tatoeba Lithuanian; contemporary and conversational',
    needs: `${CACHE}lit_sentences.tsv`,
    documents: () => tatoebaDocuments(`${CACHE}lit_sentences.tsv`),
  },
  {
    id: 'fw2',
    from: 'https://huggingface.co/datasets/HuggingFaceFW/fineweb-2/resolve/main/data/lit_Latn/train/000_00000.parquet',
    what: 'FineWeb-2 Lithuanian; a web crawl nobody here made',
    needs: `${CACHE}fineweb2-lit.parquet`,
    documents: () => fineweb2Documents(`${CACHE}fineweb2-lit.parquet`),
  },
  {
    id: 'ebible:lit',
    from: 'https://ebible.org/Scriptures/lit_vpl.zip',
    what: 'Tikinčiųjų paveldo vertimas, a Lithuanian Bible; a family nothing else here belongs to',
    needs: `${CACHE}ebible-lit/lit_vpl.txt`,
    documents: () => verseDocuments(`${CACHE}ebible-lit/lit_vpl.txt`),
  },
  {
    id: 'ia',
    // Scanned books are OCR, and OCR fails in a way that looks like text. Clean Gutenberg scores
    // a median 52% known words and never below 36%; below this floor a book is not legible
    // enough to attest anything.
    legible: 0.35,
    what: 'Internet Archive Lithuanian books; literature, and the register a newspaper never reaches',
    needs: `${CACHE}archive-lt`,
    from: `https://archive.org/search?query=${encodeURIComponent(ARCHIVE_QUERY)}`,
    documents: () => {
      const dir = `${CACHE}archive-lt`
      // A locator names the text, not the item: the catalogue page holds no word of the book.
      const named = new Map(
        readFileSync(`${dir}/files.tsv`, 'utf8')
          .split('\n')
          .filter(Boolean)
          .map((line) => line.split('\t')),
      )
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => file.replace('.txt', ''))
        .filter((id) => named.has(id))
        // Percent-encoded: two thirds of Archive filenames contain spaces, and the evidence
        // format spends spaces as separators.
        .map((id) => ({
          locator: `${id}/${encodeURIComponent(named.get(id))}`,
          path: `${dir}/${id}.txt`,
        }))
      return fileDocuments(books, async (path) => readFileSync(path, 'utf8'))
    },
  },
]

export const SOURCES = ALL.filter((source) => {
  if (source.needs === undefined || existsSync(source.needs)) return true
  process.stderr.write(`  (skipping ${source.id}: ${source.needs} is not in .cache/raw)\n`)
  return false
})

/**
 * Lithuanian publishers, for the harvest.
 *
 * Chosen because they publish in Lithuanian rather than because they are large. A harvester reads
 * whatever it fetches and has no idea what language it is in, so a domain that publishes mostly
 * in another language would attest that language's words against these candidates.
 */
export const DOMAINS = [
  'lrt.lt', '15min.lt', 'delfi.lt', 'lrytas.lt', 'vz.lt',
  'bernardinai.lt', 'alfa.lt', 'kauno.diena.lt', 'respublika.lt', 'literaturairmenas.lt',
]

export const HARVEST = existsSync(new URL('searched.tsv', import.meta.url).pathname)
  ? () => harvestDocuments(new URL('searched.tsv', import.meta.url).pathname)
  : undefined

/** Carried over from Blinkered's calibration; must be re-measured before anything ships. */
export const COMMON_CUT = 17000
