import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const token = process.env.WEBFLOW_TOKEN
const siteId = process.env.WEBFLOW_SITE_ID

if (!token) {
  throw new Error('WEBFLOW_TOKEN is required')
}

const headers = {
  Authorization: `Bearer ${token}`,
  accept: 'application/json',
}

async function getJson(url) {
  const response = await fetch(url, { headers })

  if (!response.ok) {
    throw new Error(`Webflow request failed for ${url}: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

function pascalCase(value) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join('')
}

function quoteKey(key) {
  return /^[$A-Z_a-z][$\w]*$/.test(key) ? key : JSON.stringify(key)
}

function normalizeCollectionName(collection) {
  return pascalCase(collection.singularName || collection.displayName || collection.slug)
}

function fieldTypeToTs(field) {
  switch (field.type) {
    case 'Switch':
      return 'boolean | null'
    case 'Image':
      return 'WebflowImageValue | null'
    case 'Reference':
      return 'string | null'
    case 'MultiReference':
      return 'string[]'
    case 'PlainText':
    case 'Text':
    case 'RichText':
    case 'Link':
    case 'Email':
    case 'Phone':
    case 'Date':
    case 'DateTime':
    case 'Color':
    case 'Option':
    case 'URL':
    case 'Video':
      return 'string | null'
    case 'Number':
      return 'number | null'
    default:
      return 'unknown'
  }
}

function renderCollectionInterface(collection) {
  const interfaceName = `${normalizeCollectionName(collection)}Item`
  const fields = collection.fields ?? []
  const lines = fields.map((field) => `    ${quoteKey(field.slug)}: ${fieldTypeToTs(field)}`)

  return `export interface ${interfaceName} {
  id: string
  cmsLocaleId: string
  lastPublished: string | null
  lastUpdated: string | null
  createdOn: string
  isArchived: boolean
  isDraft: boolean
  fieldData: {
${lines.join('\n')}
  }
}
`
}

function renderSchemaFile(site, collections) {
  const collectionBlocks = collections.map(renderCollectionInterface).join('\n')

  return `/* eslint-disable */
// Generated from Webflow CMS schema. Do not edit by hand.

export interface WebflowImageValue {
  fileId: string
  url: string
  alt: string | null
}

export interface WebflowCollectionFieldSchema {
  id: string
  isEditable: boolean
  isRequired: boolean
  type: string
  slug: string
  displayName: string
  helpText: string | null
  validations: Record<string, unknown> | null
}

export interface WebflowCollectionSchema {
  id: string
  displayName: string
  singularName: string
  slug: string
  createdOn: string
  lastUpdated: string
  fields: WebflowCollectionFieldSchema[]
}

export interface WebflowSiteSchema {
  id: string
  displayName: string
  shortName: string
  workspaceId: string
  previewUrl: string | null
  timeZone: string
  createdOn: string
  lastUpdated: string
  lastPublished: string | null
  fullSiteCompiledAt: string | null
}

export interface WebflowSchemaBundle {
  site: WebflowSiteSchema
  collections: WebflowCollectionSchema[]
}

${collectionBlocks}
export const webflowSchema = ${JSON.stringify({ site, collections }, null, 2)} as const
`
}

const sitesResponse = await getJson('https://api.webflow.com/v2/sites')
const selectedSite = siteId
  ? sitesResponse.sites?.find((site) => site.id === siteId)
  : sitesResponse.sites?.length === 1
    ? sitesResponse.sites[0]
    : null

if (!selectedSite) {
  const available = (sitesResponse.sites ?? []).map((site) => `${site.displayName} (${site.id})`).join(', ')
  throw new Error(
    siteId
      ? `WEBFLOW_SITE_ID did not match any site. Available sites: ${available}`
      : `Set WEBFLOW_SITE_ID because the token can access multiple sites. Available sites: ${available}`,
  )
}

const collectionsResponse = await getJson(`https://api.webflow.com/v2/sites/${selectedSite.id}/collections`)
const collections = []

for (const collection of collectionsResponse.collections ?? []) {
  const detail = await getJson(`https://api.webflow.com/v2/collections/${collection.id}`)
  collections.push(detail)
}

const outputPath = path.resolve('shared/webflow.ts')
await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, renderSchemaFile(selectedSite, collections))

console.log(`Wrote ${outputPath}`)
