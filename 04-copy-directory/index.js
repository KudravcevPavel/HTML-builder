const fs = require('fs');
const path = require('path');

const fsPromises = fs.promises;
const copyFolder = path.join(__dirname, 'files-copy');
const folderForTest = path.join(__dirname, 'files');

const error = (err) => {
  if (err) {
    console.log(err);
  }
};

const cloneFolder = async () => {
  await fsPromises.rmdir(copyFolder, { recursive: true });

  await fsPromises.mkdir(copyFolder, { recursive: true }).then(() => {
    fs.readdir(folderForTest, async (_, files) => {
      for (const file of files) {
        const fileTest = path.join(__dirname, 'files', file);
        const newFile = path.join(__dirname, 'files-copy', file);

        try {
          await fs.copyFile(fileTest, newFile, error);
        } catch {
          console.log('Не удалось скопировать файл');
        }
      }
    });
  });
};

cloneFolder().then(error);
