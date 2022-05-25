const fs = require('fs');
const path = require('path');

const assets = path.join(__dirname, 'assets');
const styles = path.join(__dirname, 'styles');
const html = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');
const result = path.join(__dirname, 'project-dist');

removeStart();

function removeStart() {
  fs.rm(
    result,
    {
      recursive: true,
    },
    () => {
      startCreation();
    },
  );
}

function startCreation() {
  fs.mkdir(result, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }

    copyAssetDir();
    readStyles();
    readHtml();
  });
}

function readComponentFile(path) {
  return new Promise((res) => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) {
        throw error;
      }
      res(data);
    });
  });
}

function readHtml() {
  const writableStream = fs.createWriteStream(path.join(result, 'index.html'));
  const templateRegex = /{{.+?}}/g;
  let htmlData;

  fs.readFile(html, 'utf8', async (error, data) => {
    if (error) {
      throw error;
    }

    htmlData = data;
    const matches = data.match(templateRegex);
    for (const match of matches) {
      const filePath = path.join(components, `${match.replace('{{', '').replace('}}', '')}.html`);
      const selectorData = await readComponentFile(filePath);

      htmlData = htmlData.replace(match, selectorData);
    }

    writableStream.write(htmlData);
  });
}

function readStyles() {
  const writableStream = fs.createWriteStream(path.join(result, 'style.css'));

  fs.readdir(styles, { withFileTypes: true }, async (err, files) => {
    if (err) {
      console.log(err);
    } else {
      for (const file of files) {
        const ext = path.extname(file.name);
        const filePath = path.join(styles, file.name);

        if (file.isFile() && ext === '.css') {
          await new Promise((res) => {
            fs.readFile(filePath, 'utf8', (error, data) => {
              if (error) {
                throw error;
              }
              writableStream.write(data);
              res();
            });
          });
        }
      }
    }
  });
}

function copyAssetDir(_dir = assets, _copyDir = path.join(result, 'assets')) {
  fs.readdir(_dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      fs.mkdir(_copyDir, { recursive: true }, async (err) => {
        if (err) {
          console.log(err);
          throw err;
        }

        for (const file of files) {
          const filePath = path.join(_dir, file.name);
          const copyFilePath = path.join(_copyDir, file.name);

          if (file.isFile()) {
            await copyFile(filePath, copyFilePath);
          } else {
            copyAssetDir(filePath, copyFilePath);
          }
        }
      });
    }
  });
}

async function copyFile(_dir, _copyDir) {
  try {
    await fs.promises.copyFile(_dir, _copyDir);
  } catch (err) {
    console.log(err);
  }
}
