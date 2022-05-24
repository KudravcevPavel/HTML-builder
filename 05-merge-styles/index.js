const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');

async function mergeStyles(stylesDirPath, projectDist) {
  try {
    const bundle = fs.createWriteStream(path.join(projectDist, 'bundle.css'));
    const stylesFiles = await fs.promises.readdir(stylesDir, { withFileTypes: true });
    stylesFiles.forEach((file) => {
      if (file.isFile() && path.extname(path.join(stylesDir, file.name)) === '.css') {
        const data = fs.createReadStream(path.join(stylesDir, file.name), 'utf-8');
        data.pipe(bundle);
        console.log(`${file.name} merged to bundle.css`);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

mergeStyles(stylesDir, projectDist);
