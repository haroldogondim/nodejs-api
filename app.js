import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ejs from "ejs";
import * as Matches from "./services/matches.js";
import * as ExcelService from "./services/generateExcel.js";
import verifyLoginToken from "./middlewares/auth.js";
import fs from "fs";
const app = express();
const port = 8080;
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("views", "./views");
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.get("/", verifyLoginToken, async (req, res) => {
  let teamsScore = await Matches.getSplittedDataFromMatch();
  res.render("index.html", {
    teamsScore: teamsScore,
    matchId: 0,
  });
});

app.get("/match/:id", verifyLoginToken, async (req, res) => {
  const getId = parseInt(req.params.id);
  if (!Matches.checkMatchExists(getId).err) {
    const teamsScore = await Matches.getSplittedDataFromMatch(getId);
    return res.status(200).render("index.html", {
      teamsScore: teamsScore,
      matchId: getId,
    });
  } else {
    return res.status(401).send("Não há dados disponíveis para esta partida.");
  }
});

app.get("/match/download/:id", verifyLoginToken, async (req, res, next) => {
  const getId = parseInt(req.params.id);
  const sendToDrive = req.query.drive == "true";
  if (!Matches.checkMatchExists(getId).err || !getId) {
    const excelFileName = await ExcelService.generateExcelByMatch(
      getId,
      sendToDrive
    );
    const PATH_FILE = process.env.UPLOAD_PATH_EXCEL;
    const FULL_PATH_FILE = PATH_FILE + excelFileName;
    await fs.readFile(FULL_PATH_FILE, () => {
      res.download(FULL_PATH_FILE);
    });
  } else {
    return res
      .status(401)
      .send("Não há dados disponíveis para download desta partida.");
  }
});

app.get("/auth", (req, res, next) => {
  res.status(200).render("auth.html", { error: false, message: "" });
});

app.post("/auth", (req, res) => {
  let response = {};
  let { reqToken } = req.body;
  let privateToken = process.env.TOKEN_LOGIN;
  if (reqToken == privateToken) {
    const token = jwt.sign({ token: reqToken }, process.env.TOKEN_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { maxAge: 900000, httpOnly: true });
    response.error = false;
    res.redirect("/");
    return;
  } else {
    response.error = true;
    response.message = `<div class="alert alert-danger">O token é inválido.</div>`;
  }

  res.status(200).render("auth.html", response);
});

app.get("/getGoogleToken", verifyLoginToken, (req, res) => {
  const code = req.query.code;
  res
    .status(200)
    .send(
      `<div class="container"><div class="m-5">Adicione o token ao console para liberar o acesso ao Google Drive desejado: <strong>${code}</strong></div></div>`
    );
});

app.listen(port, () => {
  console.log("A aplicação está rodando na porta " + port);
});
