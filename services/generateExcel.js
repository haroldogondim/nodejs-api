import Excel from "exceljs";
import * as Matches from "../services/matches.js";
import uploadFileToGoogleDrive from "./googleSheetsUpload.js";
import dotenv from "dotenv";
dotenv.config();

export async function generateExcelByMatch(matchId, sendToGoogleDrive = false) {
  matchId = parseInt(matchId);
  if (!Matches.checkMatchExists(matchId).err) {
    let dataMatches = Object.values(
      await Matches.getSplittedDataFromMatch(matchId)
    );

    //process.exit();

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Match Details - " + matchId);

    worksheet.columns = [
      { header: "Team Name", key: "TeamName", width: 15 },
      { header: "Rank", key: "Rank" },
      { header: "Kill Score", key: "KillScore", width: 13 },
      { header: "Rank Score", key: "RankScore", width: 13 },
      { header: "Total Score", key: "TotalScore", width: 13 },
      { header: "Player 1", key: "NAME1", width: 20 },
      { header: "ID Player 1", key: "NAME1ID", width: 12 },
      { header: "Kills Player 1", key: "NAME1KILL", width: 13 },
      { header: "Player 2", key: "NAME2", width: 20 },
      { header: "ID Player 2", key: "NAME2ID", width: 13 },
      { header: "Kills Player 2", key: "NAME2KILL" },
      { header: "Player 3", key: "NAME3", width: 20 },
      { header: "ID Player 3", key: "NAME3ID", width: 13 },
      { header: "Kills Player 3", key: "NAME3KILL", width: 13 },
      { header: "Player 4", key: "NAME4", width: 20 },
      { header: "ID Player 4", key: "NAME4ID", width: 13 },
      { header: "Kills Player 4", key: "NAME4KILL", width: 13 },
    ];

    dataMatches.forEach((row) => {
      worksheet.addRow([
        row[0][1],
        row[1][1],
        row[2][1],
        row[3][1],
        row[4][1],
        row[5][1],
        row[6][1],
        row[7][1],
        row[8][1],
        row[9][1],
        row[10][1],
        row[11][1],
        row[12][1],
        row[13][1],
        row[14][1],
        row[15][1],
        row[16][1],
      ]);
    });
    const PATH_FILE = process.env.UPLOAD_PATH_EXCEL;
    const excelFileName = `match-spreadsheet-${new Date().getTime()}.xlsx`;
    const excelFilePath = `${PATH_FILE}${excelFileName}`;
    const writeFile = await workbook.xlsx.writeFile(excelFilePath);
    console.log(`Parabéns, você gerou a planilha com sucesso!`);
    if (sendToGoogleDrive) {
      await uploadFileToGoogleDrive([excelFilePath, excelFileName]);
    }

    return excelFileName;
  }
}

//await generateExcelByMatch(1);
