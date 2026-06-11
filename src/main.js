import './style.css'
import partnerShellMarkup from './webflow-template/template.html?raw'
import paginationMarkup from './webflow-template/paginate-template.html?raw'

const DEFAULT_PAGE_SIZE = 12
const app = document.querySelector('#app')
const filtersForm = document.querySelector('form[fs-list-element="filters"], .product-filtering-wrap')
const searchInput = filtersForm?.querySelector('input[type="text"]')
const API_BASE_URL = window.__REVVI_PARTNER_FILTER_API_BASE__?.replace(/\/$/, '') ?? window.location.origin

if (!app) {
  throw new Error('App root was not found')
}

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

function createElementFromMarkup(markup) {
  const template = document.createElement('template')
  template.innerHTML = markup.trim()
  return template.content.firstElementChild
}

function pageUrl(page, searchParams = buildSearchParams()) {
  return buildPageUrl(page, searchParams)
}

function makePageLink(page, label, className, active = false, searchParams = buildSearchParams()) {
  const link = document.createElement('a')
  link.className = className
  link.href = pageUrl(page, searchParams)
  link.dataset.page = String(page)
  link.textContent = label

  if (active) {
    link.setAttribute('aria-current', 'page')
  }

  return link
}

function renderTierList(container, tiers) {
  const list = container?.querySelector('.w-dyn-items')
  if (!list) {
    return
  }

  list.innerHTML = ''

  if (!tiers.length) {
    container.closest('.w-dyn-list')?.classList.add('is-hidden')
    return
  }

  container.closest('.w-dyn-list')?.classList.remove('is-hidden')

  for (const tier of tiers) {
    const item = document.createElement('div')
    item.className = 'w-dyn-item'

    const link = document.createElement('a')
    link.className = 'tier-tag'
    link.href = tier.href
    link.textContent = tier.name

    if (tier.color) {
      link.style.backgroundColor = tier.color
    }

    item.append(link)
    list.append(item)
  }
}

function renderRelationList(container, relations) {
  const list = container?.querySelector('.w-dyn-items')
  if (!list) {
    return
  }

  list.innerHTML = ''

  if (!relations.length) {
    container.closest('.w-dyn-list')?.classList.add('is-hidden')
    return
  }

  container.closest('.w-dyn-list')?.classList.remove('is-hidden')

  for (const relation of relations) {
    const item = document.createElement('div')
    item.className = 'w-dyn-item'

    const link = document.createElement('a')
    link.className = 'text-14px'
    link.href = relation.href
    link.textContent = relation.name
    link.setAttribute('aria-label', relation.name)

    item.append(link)
    list.append(item)
  }
}

function renderPartnerCard(templateItem, partner) {
  const cardItem = templateItem.cloneNode(true)
  const card = cardItem.querySelector('.partners-card')
  const imageWrap = cardItem.querySelector('.partners-card-img')
  const image = cardItem.querySelector('img')
  const typeLabel = cardItem.querySelector('[fs-list-field="type"]')
  const nameLabel = cardItem.querySelector('[fs-list-field="name"]')
  const tiersContainer = cardItem.querySelector('[fs-cmsnest-collection="tiers"]')
  const locationsContainer = cardItem.querySelector('[fs-cmsnest-collection="locations"]')

  card.href = partner.href
  card.setAttribute('aria-label', `Open ${partner.name} partner page`)
  typeLabel.textContent = partner.type?.name ?? ''
  nameLabel.textContent = partner.name

  if (partner.image) {
    image.src = partner.image.url
    image.alt = partner.image.alt ?? partner.name
  } else {
    imageWrap?.classList.add('is-hidden')
  }

  renderTierList(tiersContainer, partner.tiers)
  renderRelationList(locationsContainer, partner.locations)

  return cardItem
}

function renderPagination(host, pagination, onPageChange, searchParams = buildSearchParams()) {
  host.innerHTML = ''

  const nav = createElementFromMarkup(paginationMarkup)
  if (!nav) {
    return
  }

  const prev = nav.querySelector('.w-pagination-previous')
  const next = nav.querySelector('.w-pagination-next')

  if (pagination.hasPreviousPage && pagination.previousPage) {
    prev.href = pageUrl(pagination.previousPage, searchParams)
    prev.dataset.page = String(pagination.previousPage)
    prev.style.display = ''
    prev.removeAttribute('aria-hidden')
    prev.tabIndex = 0
  } else {
    prev.style.display = 'none'
    prev.setAttribute('aria-hidden', 'true')
    prev.tabIndex = -1
    prev.removeAttribute('href')
  }

  if (pagination.hasNextPage && pagination.nextPage) {
    next.href = pageUrl(pagination.nextPage, searchParams)
    next.dataset.page = String(pagination.nextPage)
    next.style.display = ''
    next.removeAttribute('aria-hidden')
    next.tabIndex = 0
  } else {
    next.style.display = 'none'
    next.setAttribute('aria-hidden', 'true')
    next.tabIndex = -1
    next.removeAttribute('href')
  }

  const pageNumbers = document.createElement('div')
  pageNumbers.className = 'w-pagination-pages'

  for (const page of pagination.pages) {
    pageNumbers.append(
      makePageLink(page, String(page), 'w-pagination-page', page === pagination.page, searchParams),
    )
  }

  nav.insertBefore(pageNumbers, next)
  nav.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('a[data-page]') : null

    if (!target) {
      return
    }

    event.preventDefault()
    const page = Number.parseInt(target.dataset.page ?? '1', 10)
    onPageChange(page)
  })

  host.append(nav)
}

const shell = createElementFromMarkup(partnerShellMarkup)
const listContainer = shell.querySelector('.partners-cards-grid.w-dyn-items')
const templateItem = listContainer.firstElementChild
const emptyState = shell.querySelector('#filter-empty')
const emptyStateMarkup = emptyState.innerHTML

listContainer.innerHTML = ''

app.innerHTML = `
  <div class="partner-page">
    <div class="partner-page__status" data-status aria-live="polite"></div>
    <div data-results></div>
    <div class="partner-pagination" data-pagination></div>
  </div>
`

const resultsHost = app.querySelector('[data-results]')
const paginationHost = app.querySelector('[data-pagination]')
const statusHost = app.querySelector('[data-status]')

resultsHost.append(shell)

async function loadPage(page, { pushState = true, searchParams = buildSearchParams() } = {}) {
  statusHost.textContent = 'Loading partners...'

  try {
    const response = await fetch(buildRequestUrl(page, searchParams))

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`)
    }

    const payload = await response.json()
    const { items, pagination } = payload

    listContainer.innerHTML = ''

    if (items.length === 0) {
      listContainer.closest('.w-dyn-list')?.classList.add('is-hidden')
      emptyState.innerHTML = emptyStateMarkup
      emptyState.style.display = 'block'
      paginationHost.innerHTML = ''
      if (pushState) {
        history.pushState({ page: pagination.page }, '', buildPageUrl(pagination.page, searchParams))
      } else {
        history.replaceState({ page: pagination.page }, '', buildPageUrl(pagination.page, searchParams))
      }
      statusHost.textContent = 'No partners matched.'
      return
    }

    listContainer.closest('.w-dyn-list')?.classList.remove('is-hidden')
    emptyState.style.display = 'none'

    const itemTemplate = templateItem.cloneNode(true)
    for (const partner of items) {
      listContainer.append(renderPartnerCard(itemTemplate, partner))
    }

    renderPagination(
      paginationHost,
      pagination,
      (nextPage) => {
        loadPage(nextPage, { pushState: true, searchParams })
      },
      searchParams,
    )

    if (pushState) {
      history.pushState({ page: pagination.page }, '', buildPageUrl(pagination.page, searchParams))
    } else {
      history.replaceState({ page: pagination.page }, '', buildPageUrl(pagination.page, searchParams))
    }

    statusHost.textContent = `Showing page ${pagination.page} of ${pagination.totalPages}.`
  } catch (error) {
    console.error(error)
    listContainer.innerHTML = ''
    listContainer.closest('.w-dyn-list')?.classList.add('is-hidden')
    emptyState.style.display = 'block'
    emptyState.innerHTML = '<div class="body-1 u-medium">Unable to load partners right now.</div>'
    paginationHost.innerHTML = ''
    statusHost.innerHTML = '<div class="partner-page__error">Unable to load partners right now.</div>'
  }
}

if (filtersForm) {
  syncFilterStateFromUrl(filtersForm, buildSearchParams())

  let searchDebounceId = null

  const applyFilters = () => {
    const nextSearchParams = buildFilterSearchParams(filtersForm, buildSearchParams())
    const page = 1
    syncFilterStateFromUrl(filtersForm, nextSearchParams)
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
