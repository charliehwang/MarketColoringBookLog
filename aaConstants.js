const dataSheet = SpreadsheetApp.getActive().getSheetByName("Data")
const cbSheet = SpreadsheetApp.getActive().getSheetByName("Coloring Book")

const dataLastCol = dataSheet.getLastColumn()
const dataLastRow = dataSheet.getLastRow()
const dataHeaderRange = dataSheet.getRange(1, 1, 1, dataLastCol)
const dataHeaderVals = dataHeaderRange.getValues()
const DATA_HEADERS = dataHeaderVals ? dataHeaderVals[0] : undefined
if (DATA_HEADERS === undefined)
  throw new Error("There are no headers in the Data sheet")

const dataRange = dataSheet.getRange(1, 1, dataLastRow, dataLastCol)
const dataVals = dataRange.getValues()

const cbLastCol = cbSheet.getLastColumn()
const cbHeaders =
  cbLastCol && cbSheet.getRange(1, 1, 1, cbLastCol).getValues()[0]
const cbSubHeaders =
  cbLastCol && cbSheet.getRange(2, 1, 1, cbLastCol).getValues()[0]

const COLOR_HEX = {
  WHITE: "#FFF",
  WHITE70: "#B2B2B2",
  WHITE50: "#7F7F7F",

  RED: "#FF0000",
  RED70: "#B20000",
  RED50: "#7F0000",
  RED30: "#4C0000",
  RED20: "#330000",

  LIGHT_RED50: "#FF7F7F",
  LIGHT_RED30: "#FFB5B5",

  BRIGHT_RED: "#BE0000",
  MED_RED: "#580000",
  DARK_RED: "#410000",

  LIGHT_PINK: "#FFB7B7",
  ORANGE: "#8D5E00",
  DARK_ORANGE_RED: "#582C00",

  GREEN: "#00FF00",
  GREEN70: "#00B200",
  GREEN50: "#007F00",
  GREEN30: "#004C00",
  GREEN25: "#003F00",
  GREEN20: "#003300",

  LIGHT_GREEN50: "#7FFF7F",
  LIGHT_GREEN30: "#B5FFB5",

  MED_GREEN: "#004A06",
  BRIGHT_GREEN: "#00810D",
  MED_REAL_GREEN: "#00C600",
  REAL_GREEN: "#00FF00",
  DARK_GREEN: "#003905",

  YELLOW: "#AAB000",
  DARK_YELLOW_GREEN: "#2f3000",

  CYAN: "#0FF",
  PURPLE: "#45008A",

  GREY: "#6C6C6C",
  DARK_GREY: "#1E1E1E",
  BLACK: "#000",
}

const COLOR = {
  LIGHT_WHITE: [230, 230, 230],
  BRIGHT_GREEN: [0, 129, 13],
  GREEN: [0, 84, 8],
  YELLOW: [170, 176, 0],
  ORANGE: [141, 94, 0],
  RED: [100, 0, 0],
  BRIGHT_RED: [190, 0, 0],
  CYAN: [0, 255, 255],
  PURPLE: [69, 0, 138],
  GREY: [108, 108, 108],
  DARK_GREY: [43, 43, 43],
}

const TREND = {
  VERY_BULLISH: COLOR_HEX.GREEN30,
  BULLISH: COLOR_HEX.GREEN20,
  SLIGHTLY_BULLISH: COLOR_HEX.DARK_YELLOW_GREEN,
  SLIGHTLY_BEARISH: COLOR_HEX.DARK_ORANGE_RED,
  BEARISH: COLOR_HEX.RED20,
  VERY_BEARISH: COLOR_HEX.RED30,
}

const INDICES = ["COMP", "SPX", "IWM"]

const BREADTH_FIELDS = [
  "NAA50R",
  "NAA150R",
  "NAA200R",
  "SPXA50R",
  "SPXA150R",
  "NASI",
  "NYMO",
]

const INDICES_MERGE_FROM_TO = ["AD", "TrendCnt"]
const INDICES_MERGE_LENGTH = 5 // # of Cells from AD to TrendCnt
const MERGE_CELLS_FROM_TO = [
  [""],
  INDICES_MERGE_FROM_TO,
  INDICES_MERGE_FROM_TO,
  INDICES_MERGE_FROM_TO,
  ["NAA50R", "NYMO"],
  ["CPC", "BEAR_AAII"],
  ["Leaders"],
  ["Notes"],
]

const COLORING_BOOK_HEADERS = [
  "Date",
  "COMP",
  "SPX",
  "IWM",
  "Breadth",
  "Sentiment",
  "Notes",
  "",
]

const COLORING_BOOK_SUB_HEADERS = [
  "",
  "AD",
  "Per",
  "L8",
  "L25",
  "TrendCnt",
  "AD",
  "Per",
  "L8",
  "L25",
  "TrendCnt",
  "AD",
  "Per",
  "L8",
  "L25",
  "TrendCnt",
  "NAA50R",
  "SPXA50R",
  "NAA150R",
  "SPXA150R",
  "NAA200R",
  "SPXA200R",
  "NASI",
  "NYMO",
  "CPC",
  "VIX",
  "NAAIM",
  "AAII",
  "BULL_AAII",
  "BEAR_AAII",
  "Leaders",
  "Notes",
]
const HEADERS_ROW_NUM = 1
const SUB_HEADERS_ROW_NUM = 2
const DATA_START_ROW = SUB_HEADERS_ROW_NUM + 1
const DATE_COL = 1

const LARGE_DISTRIBUTION_DAY_LETTER = "D"
const SMALL_DISTRIBUTION_DAY_LETTER = "d"
const LARGE_ACCUMULATION_DAY_LETTER = "A"
const SMALL_ACCUMULATION_DAY_LETTER = "a"

const TEXT_STYLE_NORMAL = SpreadsheetApp.newTextStyle()
  .setBold(false)
  .setForegroundColor(COLOR_HEX.WHITE70)
  .build()
const TEXT_STYLE_MED_DARK = SpreadsheetApp.newTextStyle()
  .setBold(false)
  .setForegroundColor(COLOR_HEX.WHITE50)
  .build()

const TEXT_STYLE_SMALL_ACCUMULATION_DAY = SpreadsheetApp.newTextStyle()
  .setBold(true)
  .setForegroundColor(COLOR_HEX.LIGHT_GREEN30)
  .build()
const TEXT_STYLE_LARGE_ACCUMULATION_DAY = SpreadsheetApp.newTextStyle()
  .setBold(true)
  .setForegroundColor(COLOR_HEX.GREEN)
  .build()

const TEXT_STYLE_SMALL_DISTRIBUTION_DAY = SpreadsheetApp.newTextStyle()
  .setBold(true)
  .setForegroundColor(COLOR_HEX.LIGHT_RED30)
  .build()
const TEXT_STYLE_LARGE_DISTRIBUTION_DAY = SpreadsheetApp.newTextStyle()
  .setBold(true)
  .setForegroundColor(COLOR_HEX.RED)
  .build()

const TEXT_STYLE_PERC_UP = SpreadsheetApp.newTextStyle()
  .setBold(true)
  .setForegroundColor(COLOR_HEX.GREEN)
  .build()
const TEXT_STYLE_PERC_DN = SpreadsheetApp.newTextStyle()
  .setBold(true)
  .setForegroundColor(COLOR_HEX.RED)
  .build()

const BREADTH_PERC_ABOVE_MIDLINE = 50
