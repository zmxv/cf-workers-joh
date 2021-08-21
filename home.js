import { boardId, sortDiffItemByTimestamp } from './jobboard'

const esc = text =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const renderLocation = loc => `<span class="location">${esc(loc)}</span>`

const splitLocations = loc =>
  loc.split(' or ').map(name => name.replace(/,[^,]+$/, ''))

const renderDiffItem = it => {
  let title = esc(it.title.trim())
  const plus = it._op === '+'
  if (plus) {
    title = `<a href="https://boards.greenhouse.io/cloudflare/jobs/${it.id}" target="_blank">${title}</a>`
  }
  return `<div class="${
    plus ? 'plus' : 'minus'
  }"><span class="title">${title}</span>
${splitLocations(it.location.name)
  .map(renderLocation)
  .join('\n')}</div>`
}

const renderDiffGroup = ({ date, items }) =>
  `<div class="date">${date}</div><div class="group">${items
    .map(renderDiffItem)
    .join('\n')}</div>`

const renderPage = items =>
  `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Cloudflare Job Openings History</title>
<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 12px;
  line-height: 16px;
  max-width: 640px;
  margin: 16px auto;
}
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px 12px;
  border-bottom: 1px solid #ddd;
}
.header h1 {
  flex-grow: 1;
  margin-left: 8px;
}
h1 {
  font-size: 16px;
  font-weight: normal;
  margin: 0;
  color: #444;
}
.group {
  margin-bottom: 16px;
}
.date {
  color: #444;
}
.date, .plus, .minus {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px 4px 28px;
  position: relative;
}
.plus::before, .minus::before {
  position: absolute;
  font-size: 20px;
  font-weight: bold;
  left: 8px;
  top: 6px;
}
.plus::before {
  content: "+";
  color: #1fafa3;
}
.minus::before {
  content: "−";
  color: #c26767;
}
.plus {
  background-color: #d5f6f4;
}
.plus a {
  color: #1fafa3;
}
.minus {
  background-color: #f9dede;
}
.minus .title {
  color: #c26767;
}
.title {
  margin-right: 8px;
}
.location {
  padding: 2px 4px;
  margin: 2px 4px 2px 0;
}
.plus .location {
  color: #d5f6f4;
  background-color: #1fafa3;
}
.minus .location {
  color: #f9dede;
  background-color: #eb8080;
}
</style>
</head>
<body>
<div class="header">
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="24" viewBox="0 0 400 200">
    <g transform="translate(-50,-60)">
      <path fill="#F38020" d="M313,224c2.1-7.2,1.3-13.8-2.2-18.7c-3.2-4.5-8.6-7.1-15.1-7.4l-123.1-1.6c-0.8,0-1.5-0.4-1.9-1c-0.4-0.6-0.5-1.4-0.3-2.2c0.4-1.2,1.6-2.1,2.9-2.2l124.2-1.6c14.7-0.7,30.7-12.6,36.3-27.2l7.1-18.5c0.3-0.8,0.4-1.6,0.2-2.4c-8-36.2-40.3-63.2-78.9-63.2c-35.6,0-65.8,23-76.6,54.9c-7-5.2-15.9-8-25.5-7.1c-17.1,1.7-30.8,15.4-32.5,32.5c-0.4,4.4-0.1,8.7,0.9,12.7c-27.9,0.8-50.2,23.6-50.2,51.7c0,2.5,0.2,5,0.5,7.5c0.2,1.2,1.2,2.1,2.4,2.1l227.2,0c1.3,0,2.5-0.9,2.9-2.2L313,224z"/>
      <path fill="#FAAE40" d="M352.2,144.9c-1.1,0-2.3,0-3.4,0.1c-0.8,0-1.5,0.6-1.8,1.4l-4.8,16.7c-2.1,7.2-1.3,13.8,2.2,18.7c3.2,4.5,8.6,7.1,15.1,7.4l26.2,1.6c0.8,0,1.5,0.4,1.9,1c0.4,0.6,0.5,1.5,0.3,2.2c-0.4,1.2-1.6,2.1-2.9,2.2l-27.3,1.6c-14.8,0.7-30.7,12.6-36.3,27.2l-2,5.1c-0.4,1,0.3,2,1.4,2h93.8c1.1,0,2.1-0.7,2.4-1.8c1.6-5.8,2.5-11.9,2.5-18.2C419.5,175,389.4,144.9,352.2,144.9"/>
    </g>
  </svg>
  <h1>Cloudflare Job Openings History</h1>
  <a href="https://github.com/zmxv/cf-workers-joh" target="_blank">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 256 256">
      <path d="M128.00106,0 C57.3172926,0 0,57.3066942 0,128.00106 C0,184.555281 36.6761997,232.535542 87.534937,249.460899 C93.9320223,250.645779 96.280588,246.684165 96.280588,243.303333 C96.280588,240.251045 96.1618878,230.167899 96.106777,219.472176 C60.4967585,227.215235 52.9826207,204.369712 52.9826207,204.369712 C47.1599584,189.574598 38.770408,185.640538 38.770408,185.640538 C27.1568785,177.696113 39.6458206,177.859325 39.6458206,177.859325 C52.4993419,178.762293 59.267365,191.04987 59.267365,191.04987 C70.6837675,210.618423 89.2115753,204.961093 96.5158685,201.690482 C97.6647155,193.417512 100.981959,187.77078 104.642583,184.574357 C76.211799,181.33766 46.324819,170.362144 46.324819,121.315702 C46.324819,107.340889 51.3250588,95.9223682 59.5132437,86.9583937 C58.1842268,83.7344152 53.8029229,70.715562 60.7532354,53.0843636 C60.7532354,53.0843636 71.5019501,49.6441813 95.9626412,66.2049595 C106.172967,63.368876 117.123047,61.9465949 128.00106,61.8978432 C138.879073,61.9465949 149.837632,63.368876 160.067033,66.2049595 C184.49805,49.6441813 195.231926,53.0843636 195.231926,53.0843636 C202.199197,70.715562 197.815773,83.7344152 196.486756,86.9583937 C204.694018,95.9223682 209.660343,107.340889 209.660343,121.315702 C209.660343,170.478725 179.716133,181.303747 151.213281,184.472614 C155.80443,188.444828 159.895342,196.234518 159.895342,208.176593 C159.895342,225.303317 159.746968,239.087361 159.746968,243.303333 C159.746968,246.709601 162.05102,250.70089 168.53925,249.443941 C219.370432,232.499507 256,184.536204 256,128.00106 C256,57.3066942 198.691187,0 128.00106,0 Z" fill="#161614"/>
    </svg>
  </a>
</div>
<div>${items.join('\n')}</div>
</body>
</html>
`

const groupDiffByDate = list => {
  const ret = []
  let lastDate
  list.forEach(it => {
    const date = it._at.substr(0, 10)
    if (date !== lastDate) {
      lastDate = date
      ret.push({ date, items: [] })
    }
    ret[ret.length - 1].items.push(it)
  })
  return ret
}

export const homeHandler = async request => {
  const stateKey = boardId + ':~'
  let state = await KV.get(stateKey)
  if (state === null) {
    state = {}
  } else {
    state = JSON.parse(state)
  }

  const hist = state.history || []
  hist.sort(sortDiffItemByTimestamp) // TODO: truncate
  const diffGroups = groupDiffByDate(hist)
  const html = renderPage(diffGroups.map(renderDiffGroup))
  return new Response(html, { headers: { 'content-type': 'text/html' } })
}
