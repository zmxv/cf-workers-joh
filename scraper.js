import {
  normalizeJobBoard,
  diffJobBoards,
  boardId,
  sortDiffItemByTimestamp,
} from './jobboard'

export const scrapeHandler = async () => {
  const now = new Date().toISOString()
  const currentKey = boardId + ':' + now
  const raw = await fetchJobBoard(boardId)
  const after = normalizeJobBoard(raw)
  const stateKey = boardId + ':~'
  let state = await KV.get(stateKey)
  if (state === null) {
    state = {}
  } else {
    state = JSON.parse(state)
  }
  const snapshotKey = state.snapshot
  let before
  if (snapshotKey) {
    const snapshot = await KV.get(snapshotKey)
    before = normalizeJobBoard(snapshot)
  } else {
    before = []
  }
  const diff = diffJobBoards(before, after, now)
  if (diff.length) {
    state.history = state.history ? state.history.concat(diff) : [] // ignore first diff
    state.history.sort(sortDiffItemByTimestamp)
    state.snapshot = currentKey
    await KV.put(currentKey, raw)
  }
  state.last = now
  await KV.put(stateKey, JSON.stringify(state))

  return new Response(JSON.stringify(diff), {
    headers: { 'content-type': 'text/plain' },
  })
}

async function fetchJobBoard(boardId) {
  const res = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${boardId}/jobs`,
    {
      headers: { 'content-type': 'application/json' },
    },
  )
  return await res.text()
}
