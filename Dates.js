function runMeTest() {
  console.log(getDatesData())
}

function getDatesData() {
  return dataSheet.getRange(1, 1, dataLastRow, 1).getValues() // first column is always for date
  // return dataSheet.getDataRange().getValues()
}
