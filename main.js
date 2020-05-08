const { app, BrowserWindow, ipcMain, shell } = require("electron");
require("dotenv").config();

function createWindow() {
  window = new BrowserWindow({
    width: 300,
    height: 600,
    icon: __dirname + "assets/img/icons8-calendar-64.png",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  window.loadFile("index.html");

  window.webContents.on("new-window", function (e, url) {
    e.preventDefault();
    console.log(url);
    shell.openExternal(url);
  });
  //window.webContents.openDevTools();
}

function readCalendar(event) {
  const got = require("got");

  (async () => {
    try {
      const response = await got(process.env.CALENDAR_URL, {
        responseType: "json",
      });

      event.reply("receive-data", response.body);
      //=> '<!doctype html> ...'
    } catch (error) {
      console.log(error.response.body);
      //=> 'Internal server error ...'
    }
  })();
}

app.allowRendererProcessReuse = true;

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("async-request-data", (event, arg) => {
  readCalendar(event);
});
