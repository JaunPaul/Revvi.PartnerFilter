export interface PartnerRelation {
  id: string
  name: string
  slug: string
  href: string
}

export interface PartnerTier extends PartnerRelation {
  color: string | null
}

export interface PartnerImage {
  url: string
  alt: string | null
}

export interface PartnerCard {
  id: string
  slug: string
  href: string
  name: string
  featured: boolean
  image: PartnerImage | null
  type: PartnerRelation | null
  tiers: PartnerTier[]
  locations: PartnerRelation[]
  tags: PartnerRelation[]
  summary: string | null
  websiteLink: string | null
}

export interface PartnerPagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  previousPage: number | null
  nextPage: number | null
  pages: number[]
}

export interface PartnerListResponse {
  ok: true
  generatedAt: string
  siteId: string
  items: PartnerCard[]
  pagination: PartnerPagination
}
