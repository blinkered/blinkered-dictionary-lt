# Blinkered dictionary: Lithuanian

The Lithuanian word list, and the evidence for every word in it.

Built by [`blinkered-attestation`](https://github.com/blinkered/blinkered-attestation). The rule,
the evidence format and the reasoning live there; what lives here is Lithuanian.

**90,749 of 202,690 candidates proved: 44.8%**, across 13 independent
families, 12 of which a stranger could check by fetching.

## What is in this repository

```
sources.mjs        which collections attest Lithuanian, and why those
attestations/      the evidence: every candidate, what saw it, and where
words.txt          what survived, in Blinkered's own format
dropped.tsv        what did not, and how close it came
SATURATION.md      what each family was worth, measured from the evidence
COLLECTIONS.md     every collection read, and where to get it again
status.json        the numbers, whether this ships, and what the list is under
```

The evidence is a **directory** rather than one file because this language's runs past the fifty
megabytes GitHub warns at. Each shard is a complete, independently valid evidence file with its
own header and digest; `readEvidence` puts them back together and refuses a repository that
somehow holds both layouts. Nothing reads them by globbing.

`.cache/` holds the downloaded collections and is not tracked. Everything here is regenerable
with `pnpm build`.

## Where the words come from

Candidates come from Blinkered's Lithuanian list, which lives in
[`blinkered-attestation/candidates/lt`](https://github.com/blinkered/blinkered-attestation/tree/main/candidates/lt).
The dictionaries that built it are demoted to **proposing words worth looking up**. What earns a
word its place here is evidence that it occurs in the world: three independent collections, each
recorded with a locator somebody else can fetch.

`SATURATION.md` says what each family was worth. `COLLECTIONS.md` names every collection read and
where to get it again, which is what makes the downloads disposable.

## What is particular to Lithuanian

**The Archive is the family that decides Lithuanian.** Wikipedia (119,202 of the candidates) and
Leipzig (104,640, most of it a 2016 news crawl) see a great deal, and the third family is where
words stop. The Archive shelf alone rescues 76,273 words at that step, because its books reach
the literary register and the participles a newspaper rarely prints. A harvest of eight Lithuanian
publishers added about 7,600 more, led by the literary weekly *Literatūra ir menas*; each
publisher is a family of its own, and `searched.tsv` records counts per page, never text.
`bernardinai.lt` and `alfa.lt` returned nothing. Project Gutenberg has no Lithuanian text.

**The Archive shelf is queried by ISO code.** The most downloaded items the Archive files under the
English name "Lithuanian" include Spanish, Indonesian and Berber uploads, so `language:lit` is used
instead. The shelf was also weeded by function words, and a dictionary is removed by name, which
here meant the German-Lithuanian dictionaries of Kurschat and Nesselmann; a dictionary prints the
candidate list back as headwords, which is not usage.

**Two words rank far above where Lithuanian would put them, and both are real.** TOMAS is seen
12,304 times in Tatoeba, whose sentences are full of a character called Tom. NAME, the locative of
*namas* (a house), is seen 160,899 times in the Wikipedia, where most of those are the `name=` of
citation tags that the shared reader does not strip. Both are attested by a dozen collections, so
both belong in the list; only their tier is inflated.

**Every one of the 32 tiles spells something**, the ogoneks and the dotted Ė included. 0.6% of
the shipped list is also in Blinkered's English candidates, all homographs (KAS, PER, MAN).

**No FineWeb-2.** Its 4.8GB Lithuanian shard was not fetched because the disk was nearly full. It
is declared in `sources.mjs` and skipped when absent.

Of the 111,941 dropped candidates, 30,853 were seen by two families and are one short;
30,871 were seen by one, and 50,217 by none at all.

## Rebuilding

```
pnpm install
pnpm build        # reads whatever collections are in .cache/raw, reuses the record for the rest
pnpm conform      # the list says only what the evidence supports
pnpm saturation   # recomputes the curve and status.json
```

A collection that is not on disk is skipped with a warning and its recorded testimony is reused,
so a rebuild after more books arrive is short rather than a re-read of everything.

## Before this ships

Nobody has played this list yet. `status.json` says `"ships": "pending"`, and it stays that way
until somebody has checked the boards it deals against Blinkered's usability floor and decided.
`COMMON_CUT` in `sources.mjs` is carried over from Blinkered's old calibration against a
differently sized list, and has to be re-measured before this list reaches the game.

## Licensing

Three kinds of thing live here and they do not share terms. The distinction is the project: a
licence that claimed more than we can support would undo the argument the evidence is here to
make. [NOTICE](NOTICE) is the authority; this is the summary.

| | terms | what |
| --- | --- | --- |
| **Code and docs** | [Apache-2.0](LICENSE) | `build.mjs`, `sources.mjs`, `harvest.mjs`, `conform.mjs`, `saturation.mjs`, and the Markdown |
| **The list and its evidence** | [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `words.txt`, the evidence, `status.json`, `SATURATION.md`, `COLLECTIONS.md`, `searched.tsv` |
| **The words we could not prove** | `BSD-3-Clause` | `dropped.tsv`; **not ours to license** |

**Why the list is CC0.** A word ships because three independent collections of text were found to
contain it. The record of which collections, and where in them, is a statement of fact about those
texts rather than a copy of them, and nothing a licence governs was taken from the dictionary that
proposed the candidates.

**Why `dropped.tsv` is not.** It is the candidates that failed, and a candidate that failed is a
word we have nothing to say about except that somebody's dictionary proposed it. That makes the
file a subset of that dictionary and it carries that dictionary's terms: here `BSD-3-Clause`.
