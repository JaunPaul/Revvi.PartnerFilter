const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
  accept: 'application/json',
})

export async function webflowGetJson<T>(token: string, url: string): Promise<T> {
  const response = await fetch(url, { headers: headers(token) })

  if (!response.ok) {
    throw new Error(`Webflow request failed for ${url}: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
