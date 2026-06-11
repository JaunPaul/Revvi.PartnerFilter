import './style.css'

const DEFAULT_PAGE_SIZE = 12
const filtersForm = document.querySelector('form[fs-list-element="filters"], .product-filtering-wrap')
const searchInput = filtersForm?.querySelector('input[type="text"]')
const API_BASE_URL = window.__REVVI_PARTNER_FILTER_API_BASE__?.replace(/\/$/, '') ?? window.location.origin

function parsePage(search) {
  const params = new URLSearchParams(search)
  const value = Number.parseInt(params.get('page') ?? '1', 10)
  return Number.isFinite(value) && value > 0 ? value : 1
}

function normalizeFilterValue(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^revvi-/, '')
}

function buildSearchParams(search = window.location.search) {
  return new URLSearchParams(search)
}

function buildRequestUrl(page, searchParams = buildSearchParams()) {
  const params = new URLSearchParams(searchParams)
  params.set('page', String(page))
  params.set('pageSize', String(DEFAULT_PAGE_SIZE))
  return `${API_BASE_URL}/partners?${params.toString()}`
}

function buildPageUrl(page, searchParams = buildSearchParams()) {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(searchParams)
  params.set('page', String(page))
  url.search = params.toString()
  return `${url.pathname}${url.search}${url.hash}`
}

function facetKeyForLabel(label) {
  const collection = label?.dataset?.collection

  if (collection === 'tiers') {
    return 'tier'
  }

  if (collection === 'locations') {
    return 'location'
  }

  if (collection === 'tags') {
    return 'tag'
  }

  if (collection === 'type') {
    return 'type'
  }

  return null
}

function facetValueForLabel(label) {
  return normalizeFilterValue(label?.textContent ?? '')
}

function syncFilterStateFromUrl(form, searchParams) {
  if (!form) {
    return
  }

  const selected = {
    tier: new Set(searchParams.getAll('tier').flatMap((value) => value.split(',')).map(normalizeFilterValue).filter(Boolean)),
    type: new Set(searchParams.getAll('type').flatMap((value) => value.split(',')).map(normalizeFilterValue).filter(Boolean)),
    location: new Set(searchParams.getAll('location').flatMap((value) => value.split(',')).map(normalizeFilterValue).filter(Boolean)),
    tag: new Set(searchParams.getAll('tag').flatMap((value) => value.split(',')).map(normalizeFilterValue).filter(Boolean)),
  }

  const labels = form.querySelectorAll('span[data-collection]')

  for (const label of labels) {
    const facet = facetKeyForLabel(label)

    if (!facet) {
      continue
    }

    const input = label.closest('label')?.querySelector('input[type="checkbox"]')

    if (!input) {
      continue
    }

    input.checked = selected[facet].has(facetValueForLabel(label))
  }

  if (searchInput) {
    searchInput.value = searchParams.get('name') ?? ''
  }
}

function buildFilterSearchParams(form, baseSearchParams = buildSearchParams()) {
  const params = new URLSearchParams(baseSearchParams)
  params.delete('page')
  params.delete('pageSize')
  params.delete('name')

  for (const key of ['tier', 'type', 'location', 'tag']) {
    params.delete(key)
  }

  const valuesByFacet = {
    tier: [],
    type: [],
    location: [],
    tag: [],
  }

  for (const label of form.querySelectorAll('span[data-collection]')) {
    const facet = facetKeyForLabel(label)

    if (!facet) {
      continue
    }

    const input = label.closest('label')?.querySelector('input[type="checkbox"]')

    if (input?.checked) {
      valuesByFacet[facet].push(facetValueForLabel(label))
    }
  }

  for (const key of Object.keys(valuesByFacet)) {
    for (const value of valuesByFacet[key]) {
      params.append(key, value)
    }
  }

  const name = searchInput?.value.trim() ?? ''
  if (name) {
    params.set('name', name)
  }

  return params
}

function pageUrl(page, searchParams = buildSearchParams()) {
  return buildPageUrl(page, searchParams)
}

function ensurePaginationLink(host, selector, className, label, dataAttribute) {
  let link = host.querySelector(selector)

  if (link) {
    link.setAttribute(dataAttribute, '')
    return link
  }

  link = document.createElement('a')
  link.className = className
  link.textContent = label
  link.setAttribute('aria-label', label)
  link.setAttribute('data-page', '')
  link.setAttribute(dataAttribute, '')
  host.append(link)
  return link
}

function updateBrowserUrl(page, searchParams, replace = false) {
  const url = buildPageUrl(page, searchParams)

  if (replace) {
    history.replaceState({ page }, '', url)
    return
  }

  history.pushState({ page }, '', url)
}

function renderTierList(container, tiers) {
  if (!container) {
    return
  }

  container.innerHTML = ''

  if (!tiers.length) {
    container.hidden = true
    return
  }

  container.hidden = false

  for (const tier of tiers) {
    const link = document.createElement('a')
    link.className = 'tier-tag'
    link.href = tier.href
    link.textContent = tier.name
    link.setAttribute('aria-label', tier.name)

    if (tier.color) {
      link.style.backgroundColor = tier.color
    }

    container.append(link)
  }
}

function renderRelationList(container, relations) {
  if (!container) {
    return
  }

  container.innerHTML = ''

  if (!relations.length) {
    container.hidden = true
    return
  }

  container.hidden = false

  for (const relation of relations) {
    const link = document.createElement('a')
    link.className = 'text-14px'
    link.href = relation.href
    link.textContent = relation.name
    link.setAttribute('aria-label', relation.name)

    container.append(link)
  }
}

function renderPartnerCard(templateItem, partner) {
  const cardItem = templateItem.cloneNode(true)
  cardItem.hidden = false
  cardItem.removeAttribute('data-partner-template')
  const card = cardItem.querySelector('[data-partner-card]')
  const imageWrap = cardItem.querySelector('[data-partner-image-wrap]')
  const image = cardItem.querySelector('[data-partner-image]')
  const typeLabel = cardItem.querySelector('[data-partner-type]')
  const nameLabel = cardItem.querySelector('[data-partner-name]')
  const tiersContainer = cardItem.querySelector('[data-partner-tiers]')
  const locationsContainer = cardItem.querySelector('[data-partner-locations]')

  card.href = partner.href
  card.setAttribute('aria-label', `Open ${partner.name} partner page`)
  typeLabel.textContent = partner.type?.name ?? ''
  nameLabel.textContent = partner.name

  if (partner.image) {
    image.src = partner.image.url
    image.alt = partner.image.alt ?? partner.name
    imageWrap.hidden = false
  } else {
    imageWrap.hidden = true
  }

  renderTierList(tiersContainer, partner.tiers)
  renderRelationList(locationsContainer, partner.locations)

  return cardItem
}

function renderPagination(host, pagination, onPageChange, searchParams = buildSearchParams()) {
  host.classList.add('w-pagination-wrapper')

  const prev = ensurePaginationLink(
    host,
    '[data-partner-pagination-prev], .w-pagination-previous',
    'w-pagination-previous',
    'Previous Page',
    'data-partner-pagination-prev',
  )
  const next = ensurePaginationLink(
    host,
    '[data-partner-pagination-next], .w-pagination-next',
    'w-pagination-next',
    'Next Page',
    'data-partner-pagination-next',
  )

  host.style.display = pagination.hasPreviousPage || pagination.hasNextPage ? '' : 'none'

  if (pagination.hasPreviousPage && pagination.previousPage) {
    prev.href = pageUrl(pagination.previousPage, searchParams)
    prev.dataset.page = String(pagination.previousPage)
    prev.style.display = ''
    prev.removeAttribute('aria-hidden')
  } else {
    prev.style.display = 'none'
    prev.removeAttribute('href')
    prev.removeAttribute('data-page')
    prev.setAttribute('aria-hidden', 'true')
  }

  if (pagination.hasNextPage && pagination.nextPage) {
    next.href = pageUrl(pagination.nextPage, searchParams)
    next.dataset.page = String(pagination.nextPage)
    next.style.display = ''
    next.removeAttribute('aria-hidden')
  } else {
    next.style.display = 'none'
    next.removeAttribute('href')
    next.removeAttribute('data-page')
    next.setAttribute('aria-hidden', 'true')
  }

  host.onclick = (event) => {
    const target = event.target instanceof Element ? event.target.closest('a[data-page]') : null

    if (!target) {
      return
    }

    event.preventDefault()
    const page = Number.parseInt(target.dataset.page ?? '1', 10)
    onPageChange(page)
  }
}

const listContainer = document.querySelector('[data-partner-grid]')
const templateItem = listContainer?.querySelector('[data-partner-template]')
const emptyState = document.querySelector('[data-partner-empty]')
const paginationHost = document.querySelector('[data-partner-pagination]')
const statusHost = document.querySelector('[data-partner-status]')
let activeLoadId = 0

if (!listContainer || !templateItem || !emptyState || !paginationHost) {
  throw new Error('Required partner filter markup was not found on the page')
}

templateItem.hidden = true

async function loadPage(page, { pushState = true, searchParams = buildSearchParams() } = {}) {
  const loadId = ++activeLoadId

  if (statusHost) {
    statusHost.textContent = 'Loading partners...'
  }

  try {
    const response = await fetch(buildRequestUrl(page, searchParams))

    if (loadId !== activeLoadId) {
      return
    }

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`)
    }

    const payload = await response.json()
    if (loadId !== activeLoadId) {
      return
    }

    const { items, pagination } = payload

    for (const child of Array.from(listContainer.children)) {
      if (child !== templateItem) {
        child.remove()
      }
    }

    if (items.length === 0) {
      emptyState.style.display = 'block'
      paginationHost.style.display = 'none'
      if (statusHost) {
        statusHost.textContent = 'No partners matched.'
      }
      return
    }

    emptyState.style.display = 'none'

    const itemTemplate = templateItem.cloneNode(true)
    for (const partner of items) {
      listContainer.append(renderPartnerCard(itemTemplate, partner))
    }

    renderPagination(
      paginationHost,
      pagination,
      (nextPage) => {
        updateBrowserUrl(nextPage, searchParams, false)
        loadPage(nextPage, { pushState: true, searchParams })
      },
      searchParams,
    )

    if (statusHost) {
      statusHost.textContent = `Showing page ${pagination.page} of ${pagination.totalPages}.`
    }
    } catch (error) {
    if (loadId !== activeLoadId) {
      return
    }

    console.error(error)
    for (const child of Array.from(listContainer.children)) {
      if (child !== templateItem) {
        child.remove()
      }
    }
    emptyState.style.display = 'block'
    paginationHost.style.display = 'none'
    if (statusHost) {
      statusHost.innerHTML = '<div class="partner-page__error">Unable to load partners right now.</div>'
    }
  }
}

if (filtersForm) {
  syncFilterStateFromUrl(filtersForm, buildSearchParams())

  let searchDebounceId = null

  const applyFilters = () => {
    const nextSearchParams = buildFilterSearchParams(filtersForm, buildSearchParams())
    const page = 1
    updateBrowserUrl(page, nextSearchParams, false)
    loadPage(page, { pushState: true, searchParams: nextSearchParams })
  }

  filtersForm.addEventListener('change', (event) => {
    if (event.target === searchInput) {
      return
    }

    applyFilters()
  })

  searchInput?.addEventListener('input', () => {
    window.clearTimeout(searchDebounceId)
    searchDebounceId = window.setTimeout(applyFilters, 250)
  })
}

window.addEventListener('popstate', () => {
  const searchParams = buildSearchParams()
  syncFilterStateFromUrl(filtersForm, searchParams)
  loadPage(parsePage(window.location.search), { pushState: false, searchParams })
})

loadPage(parsePage(window.location.search), { pushState: false, searchParams: buildSearchParams() })
