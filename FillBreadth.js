function runFillBreadthTest() {
  getBreadthPerAbove(dataVals)
}

function getBreadthPerAbove(dataVals) {
  const FIELDS_BREADTH_PER_ABOVE = [
    "NAA50R",
    "SPXA50R",
    "NAA150R",
    "SPXA150R",
    "NAA200R",
    "SPXA200R",
  ]

  const firstField = FIELDS_BREADTH_PER_ABOVE[0]
  const lastField =
    FIELDS_BREADTH_PER_ABOVE[FIELDS_BREADTH_PER_ABOVE.length - 1]
  const startIdx = DATA_HEADERS.indexOf(firstField)
  const startCol = startIdx + 1
  const endIdx = DATA_HEADERS.indexOf(lastField)

  const breadthFieldIdxs = DATA_HEADERS.reduce((acc, headerName, i) => {
    if (FIELDS_BREADTH_PER_ABOVE.indexOf(headerName) >= 0) acc.push(i)
    return acc
  }, [])

  const filteredData = filterDataWithFromIndexes(breadthFieldIdxs, dataVals)
  console.log(filteredData)
}

function filterDataWithFromIndexes(wantedFieldIdxs, data) {
  return data.map((d) => {
    const filtered = d.filter((value, i) => {
      if (wantedFieldIdxs.indexOf(i) !== -1) {
        return true
      }
      return false
    })
    return filtered
  })
}
