export const normalizeJobBoard = raw => {
  try {
    const obj = JSON.parse(raw)
    const list = obj.jobs.map(job => ({
      id: job.id,
      location: job.location,
      title: job.title,
      updated_at: job.updated_at,
    }))
    list.sort((a, b) => (a.id < b.id ? -1 : 1))
    return list
  } catch (e) {
    return e
  }
}

const newDiffItem = (op, job, timestamp) => ({
  _op: op,
  _at: timestamp || new Date(job.updated_at).toISOString(),
  id: job.id,
  location: job.location,
  title: job.title,
})

export const diffJobBoards = (before, after, timestamp) => {
  const nb = before.length,
    na = after.length
  let ib = 0,
    ia = 0
  const ret = []
  let item
  while (ib < nb || ia < na) {
    if (ib >= nb) {
      item = newDiffItem('+', after[ia++])
    } else if (ia >= na) {
      item = newDiffItem('-', before[ib++], timestamp)
    } else {
      const bi = before[ib],
        ai = after[ia]
      if (bi.id < ai.id) {
        item = newDiffItem('-', bi, timestamp)
        ib++
      } else if (bi.id > ai.id) {
        item = newDiffItem('+', ai)
        ia++
      } else {
        // bi.id === ai.id
        ib++
        ia++
        continue
      }
    }
    ret.push(item)
  }
  return ret
}

export const sortDiffItemByTimestamp = (a, b) => {
  if (a._at < b._at) {
    return 1
  }
  if (b._at < a._at) {
    return -1
  }
  return a.id < b.id ? 1 : -1
}

export const boardId = 'cloudflare'
