function runTestUtilitySheet() {
  const headerRowData = dataVals[0]
  const headerIdxLocations = getHeaderIdxLocationsAsDictForIndexName(
    "COMP",
    headerRowData
  )
  console.log(headerIdxLocations)
}

function getDataColNum(fieldName) {
  return headers(fieldName) + 1
}

function getCBColNum(fieldName) {
  if (!cbHeaders || cbHeaders.length === 0)
    throw new Error("No Data Headers Found")
  const headers = cbHeaders[0]
  //Logger.log(headers)
  return headers.indexOf(fieldName) + 1
}

function getDataIDX(fieldName) {
  if (!dataHeaders || dataHeaders.length === 0)
    throw new Error("No Data Headers Found")
  const headers = dataHeaders[0]
  //Logger.log(headers)
  return headers.indexOf(fieldName)
}

function getHeaderIdxLocationsAsDictForIndexName(indexName, headerData) {
  const regExp = new RegExp(`^${indexName}(_+)?`)
  return headerData
    .map((d, i) => (d.match(regExp) ? [d, i] : undefined))
    .filter((d) => d)
    .reduce((acc, arr) => {
      const [headerName, i] = arr
      acc[headerName] = i
      return acc
    }, {})
}

function removeDateData(arr) {
  return arr.map((d) => {
    const [date, ...other] = d
    return other
  })
}
