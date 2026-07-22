const fs = require('fs');
const path = require('path');

// 设置目标文件夹路径
const folderPath = '/Users/colin/Desktop/reactnative/FTFontEnd/src/assets';  // 替换为你的文件夹路径

// 读取文件夹内容
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('读取文件夹失败:', err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(folderPath, file);

    // 检查文件是否是文件夹，如果是文件夹则跳过
    if (fs.statSync(filePath).isDirectory()) {
      return;
    }

    // 如果文件名包含@2x，则替换为普通文件名
    if (file.includes('@2x')) {
      const newFileName = file.replace('@2x', '');
      const newFilePath = path.join(folderPath, newFileName);

      // 重命名文件
      fs.rename(filePath, newFilePath, (err) => {
        if (err) {
          console.error(`重命名失败: ${file} -> ${newFileName}`, err);
        } else {
          console.log(`重命名成功: ${file} -> ${newFileName}`);
        }
      });
    }
  });
});
