import { google } from "googleapis";
import fs from "fs";
import readline from "readline";
import { readFile } from "fs/promises";

const TOKEN_PATH = "token.json";

export default async function uploadFileToGoogleDrive(file) {
  let readClientToken = async () => {
    fs.readFile("./config/client-secret.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      authorize(JSON.parse(content), (oAuth2Client) => {
        upload(file, oAuth2Client);
      });
    });
  };

  readClientToken();

  const upload = async (file, oAuth2Client) => {
    const [filePath, fileName] = file;
    const drive = google.drive({
      version: "v3",
      auth: oAuth2Client,
    });

    const fileToUpload = await readFile(
      new URL("../" + filePath, import.meta.url)
    );
    if (!fileToUpload) {
      return "Não foi possível fazer a leitura do arquivo";
    }

    drive.files
      .create({
        requestBody: {
          name: fileName,
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        media: {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          body: fs.createReadStream(filePath),
        },
      })
      .then((res) => {
        console.log("Arquivo enviado para o Google Drive com sucesso!");
      })
      .catch((err) => {
        console.log(
          "Aconteceu um erro ao fazer o upload do arquivo para o Google Drive."
        );
      });
  };
}

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
  ];
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
