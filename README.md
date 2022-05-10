# Node.js API using Google APIs
Node.js API using Express.js, JWT, EJS, Google APIs and more.

### What is the application for?
This application get "match game results" from `.log` files, then we filter the data, put all informations on a simple front-end with two button to Download an Excel with all informations and Download and Upload direct to your Google Drive using `Google APIs` library for Node.js.

### Main packages

| Package | Link |
| ------ | ------ |
| Express | https://www.npmjs.com/package/express |
| Google APIs | https://www.npmjs.com/package/googleapis |
| JWT | https://www.npmjs.com/package/jsonwebtoken |
| Exceljs | https://www.npmjs.com/package/exceljs |
| Nodemon | https://www.npmjs.com/package/nodemon |
| EJS | https://www.npmjs.com/package/ejs |

### How to set up the application
This application was built using Express.js, JWT, EJS, Excel.js, Google APIs, and other packages.

After download the project, you need to run:

```sh
cd project/
npm install
```

After install all dependencies, you need to create and download Google API Credentials (Google Drive and Spreadsheet), you can create it accessing Google Cloud Platform (Console) > Sidebar Menu > APIs & Services > Credentials. You need to create an OAuth2.0 Client ID and Service Accounts.

When you create your Google Credentials, you need to store it on `config/client-secret.json` and `config/credentials.json` on main folder.

The file `config/client-secret.json` should have this structure or something similar:
```json
{"installed":
    {
        "client_id":"",
        "project_id":"",
        "auth_uri":"",
        "token_uri":"",
        "auth_provider_x509_cert_url":"",
        "client_secret":"",
        "redirect_uris":["http://localhost"]
    }
}
```

The file `config/credentials.json` should have this structure or something similar:
```json
{
    "type": "",
    "project_id": "",
    "private_key_id": "",
    "private_key": "",
    "client_email": "",
    "client_id": "",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": ""
}
```

If you have any doubts, this [link](https://developers.google.com/workspace/guides/create-credentials) may help you.

### How to run

You can use the following command to run the application
```sh
nodemon app.js
``` 
_The default port is `8080`, so you can access the application using `http://localhost:8080`._

Any doubts, you can reach me at hello@haroldo.dev
