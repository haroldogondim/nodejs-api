import jwt from "jsonwebtoken";

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.cookies.token;

  if (!token) {
    return res
      .status(403)
      .send(
        `<div class="row"><div class="col-md-12"><h3>Você precisa de um token de autorização pra acessar a aplicação. <a href="/auth">Clique aqui para logar-se com um token de acesso.</a></h3></div></div>`
      );
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Token Inválido");
  }
  return next();
};

export default verifyToken;
