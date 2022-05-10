import fs from "fs";

const fileLog = [
  "./matches_log/MatchResult_1507418793234669568_2022-03-25-15-22-27.log",
  "./matches_log/MatchResult_1507425621855182848_2022-03-25-15-49-10.log",
  "./matches_log/MatchResult_1507431516160925696_2022-03-25-16-11-01.log",
  "./matches_log/MatchResult_1507436614593290240_2022-03-25-16-33-41.log",
  "./matches_log/MatchResult_1507442503396106240_2022-03-25-16-56-02.log",
];

export async function getMatchResultFromLogs(file) {
  try {
    let matches = fs.readFileSync(file, "utf8");
    matches = matches.toString();
    return matches;
  } catch (e) {
    console.log(
      "Erro na leitura do arquivo para obter o resultado da partida."
    );
    return false;
  }
}

export async function getSplittedDataFromMatch(fileLogNumber = 0) {
  if (!checkMatchExists(fileLogNumber).err) {
    let matchResults = await getMatchResultFromLogs(
      fileLog[fileLogNumber],
      fileLogNumber
    );

    if (!matchResults) {
      return;
    }

    let split = matchResults.split(/\s{3,}|\t/);

    let teamsScore = [];
    let lastTeamName;
    split.forEach((value) => {
      let splitData = value.split(": ");
      if (value.includes("TeamName:")) {
        lastTeamName = splitData[1].toString();
        teamsScore[lastTeamName] = [];
      }

      teamsScore[lastTeamName] = [...teamsScore[lastTeamName], splitData];
    });

    // Removendo último resultado em branco
    teamsScore[lastTeamName].splice([teamsScore[lastTeamName].length - 1]);

    return teamsScore;
  } else {
    return { err: true, message: "Não foi possível localizar o arquivo" };
  }
}

export function checkMatchExists(fileLogNumber = 0) {
  if (!fileLog[fileLogNumber]) {
    return { err: true, message: "O arquivo do jogo não foi encontrado." };
  }

  return { err: false };
}

//console.log(await getSplittedDataFromMatch(7));
