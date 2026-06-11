import {
  webflowSchema,
  type LocationItem,
  type PartnerItem,
  type TagItem,
  type TierItem,
  type TypeItem,
} from '../shared/webflow'
import type { PartnerCard, PartnerImage, PartnerPagination, PartnerRelation, PartnerTier } from '../shared/partner-api'
import { webflowGetJson } from './webflow-client'

type WebflowCollectionsResponse<T> = {
  items: T[]
  pagination?: { total?: number }
}

export type PartnerIndex = {
  generatedAt: string
  siteId: string
  partners: PartnerCard[]
}

export type PartnerFacetFilters = {
  tiers: string[]
  types: string[]
  locations: string[]
  tags: string[]
  name: string
}

const collectionBySlug = new Map(webflowSchema.collections.map((collection) => [collection.slug, collection]))

const partnerCollection = collectionBySlug.get('partners')
const typeCollection = collectionBySlug.get('partner-type')
const tierCollection = collectionBySlug.get('tier')
const locationCollection = collectionBySlug.get('location')
const tagCollection = collectionBySlug.get('tags')

if (!partnerCollection || !typeCollection || !tierCollection || !locationCollection || !tagCollection) {
  throw new Error('Required Webflow collection schema was not found in generated Webflow schema')
}

function fieldValue(item: PartnerItem, key: keyof PartnerItem['fieldData']) {
  return item.fieldData[key]
}

function imageValue(value: PartnerItem['fieldData']['thumbnail-image']): PartnerImage | null {
  if (!value) {
    return null
  }

  return { url: value.url, alt: value.alt }
}

function relationHref(collectionSlug: string, slug: string) {
  const singular = collectionSlug.endsWith('s') ? collectionSlug.slice(0, -1) : collectionSlug
  return `/${singular}/${slug}`
}

function toRelation<T extends { id: string; fieldData: { name: string | null; slug: string | null } }>(
  collectionSlug: string,
  item: T,
): PartnerRelation {
  return {
    id: item.id,
    name: item.fieldData.name ?? '',
    slug: item.fieldData.slug ?? '',
    href: relationHref(collectionSlug, item.fieldData.slug ?? item.id),
  }
}

function toTier(item: TierItem): PartnerTier {
  return {
    ...toRelation(tierCollection.slug, item),
    color: item.fieldData.color,
  }
}

async function fetchAllCollectionItems<T>(token: string, collectionId: string) {
  const items: T[] = []
  const limit = 100
  let offset = 0
  let total = Number.POSITIVE_INFINITY

  while (offset < total) {
    const response = await webflowGetJson<WebflowCollectionsResponse<T>>(
      token,
      `https://api.webflow.com/v2/collections/${collectionId}/items?limit=${limit}&offset=${offset}`,
    )

    items.push(...(response.items ?? []))
    total = response.pagination?.total ?? items.length
    offset += limit
  }

  return items
}

function sortPartnerCards(a: PartnerCard, b: PartnerCard) {
  if (a.featured !== b.featured) {
    return Number(b.featured) - Number(a.featured)
  }

  return a.name.localeCompare(b.name)
}

function normalizeFilterValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^revvi-/, '')
}

function relationFilterValues(relation: PartnerRelation | null) {
  if (!relation) {
    return []
  }

  return [relation.slug, relation.name].map(normalizeFilterValue).filter(Boolean)
}

function matchesFacetSelection(values: string[], selected: Set<string>) {
  if (selected.size === 0) {
    return true
  }

  return values.some((value) => selected.has(value))
}

export function filterPartnerCards(partners: PartnerCard[], filters: PartnerFacetFilters) {
  const selectedTierValues = new Set(filters.tiers.map(normalizeFilterValue).filter(Boolean))
  const selectedTypeValues = new Set(filters.types.map(normalizeFilterValue).filter(Boolean))
  const selectedLocationValues = new Set(filters.locations.map(normalizeFilterValue).filter(Boolean))
  const selectedTagValues = new Set(filters.tags.map(normalizeFilterValue).filter(Boolean))
  const searchTerm = filters.name.trim().toLowerCase()

  if (
    selectedTierValues.size === 0 &&
    selectedTypeValues.size === 0 &&
    selectedLocationValues.size === 0 &&
    selectedTagValues.size === 0 &&
    searchTerm.length === 0
  ) {
    return partners
  }

  return partners.filter((partner) => {
    const tierValues = partner.tiers.flatMap((tier) => relationFilterValues(tier))
    const typeValues = relationFilterValues(partner.type)
    const locationValues = partner.locations.flatMap((location) => relationFilterValues(location))
    const tagValues = partner.tags.flatMap((tag) => relationFilterValues(tag))
    const matchesName = searchTerm.length === 0 || partner.name.toLowerCase().includes(searchTerm)

    return (
      matchesName &&
      matchesFacetSelection(tierValues, selectedTierValues) &&
      matchesFacetSelection(typeValues, selectedTypeValues) &&
      matchesFacetSelection(locationValues, selectedLocationValues) &&
      matchesFacetSelection(tagValues, selectedTagValues)
    )
  })
}

function normalizePartner(item: PartnerItem): PartnerCard {
  const slug = fieldValue(item, 'slug') ?? item.id

  return {
    id: item.id,
    href: `/partners/${slug}`,
    name: fieldValue(item, 'name') ?? '',
    slug,
    featured: fieldValue(item, 'featured') ?? false,
    image: imageValue(fieldValue(item, 'thumbnail-image')),
    type: null,
    tiers: [],
    locations: [],
    tags: [],
    summary: fieldValue(item, 'description'),
    websiteLink: fieldValue(item, 'website-link'),
  }
}

function buildPagination(totalItems: number, page: number, pageSize: number): PartnerPagination {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)

  return {
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
    hasPreviousPage: safePage > 1,
    hasNextPage: safePage < totalPages,
    previousPage: safePage > 1 ? safePage - 1 : null,
    nextPage: safePage < totalPages ? safePage + 1 : null,
    pages: Array.from({ length: totalPages }, (_, index) => index + 1),
  }
}

export async function rebuildPartnerIndex(token: string): Promise<PartnerIndex> {
  const siteId = webflowSchema.site.id

  const [partnerItems, typeItems, tierItems, locationItems, tagItems] = await Promise.all([
    fetchAllCollectionItems<PartnerItem>(token, partnerCollection.id),
    fetchAllCollectionItems<TypeItem>(token, typeCollection.id),
    fetchAllCollectionItems<TierItem>(token, tierCollection.id),
    fetchAllCollectionItems<LocationItem>(token, locationCollection.id),
    fetchAllCollectionItems<TagItem>(token, tagCollection.id),
  ])

  const typeMap = new Map(typeItems.filter((item) => item.fieldData.slug).map((item) => [item.id, toRelation(typeCollection.slug, item)]))
  const tierMap = new Map(tierItems.filter((item) => item.fieldData.slug).map((item) => [item.id, toTier(item)]))
  const locationMap = new Map(locationItems.filter((item) => item.fieldData.slug).map((item) => [item.id, toRelation(locationCollection.slug, item)]))
  const tagMap = new Map(tagItems.filter((item) => item.fieldData.slug).map((item) => [item.id, toRelation(tagCollection.slug, item)]))

  const partners = partnerItems
    .filter((item) => !item.isArchived && !item.isDraft)
    .map((item) => {
      const partner = normalizePartner(item)
      partner.type = typeMap.get(fieldValue(item, 'type') ?? '') ?? null
      partner.tiers = (fieldValue(item, 'available-on') ?? []).map((id) => tierMap.get(id)).filter(Boolean) as PartnerTier[]
      partner.locations = (fieldValue(item, 'location-2') ?? []).map((id) => locationMap.get(id)).filter(Boolean) as PartnerRelation[]
      partner.tags = (fieldValue(item, 'tags') ?? []).map((id) => tagMap.get(id)).filter(Boolean) as PartnerRelation[]
      return partner
    })
    .sort(sortPartnerCards)

  return {
    generatedAt: new Date().toISOString(),
    siteId,
    partners,
  }
}

export function slicePartnerIndex(partners: PartnerCard[], page: number, pageSize: number) {
  const pagination = buildPagination(partners.length, page, pageSize)
  const start = (pagination.page - 1) * pageSize

  return {
    items: partners.slice(start, start + pageSize),
    pagination,
  }
}
