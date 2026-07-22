const fs = require('fs');
const path = require('path');

// 定义一个函数来转换px为rem
function convertPxToRem (content) {
  return content.replace(/(\d*\.?\d+)em/g, (match, p1) => {
    // 处理 1px 的情况
    if (p1 === '1') {
      return match; // 不做修改，保留 1px
    }
    // 将 px 转换为 rem，假设根字体大小为 16px
    const remValue = parseFloat(p1);
    return `${remValue}rem`;
  });
}

// 读取指定目录下的所有文件
function processDirectory (directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('读取目录失败:', err);
      return;
    }

    // 遍历目录中的所有文件
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      // 获取文件的统计信息，判断是否是文件
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('获取文件信息失败:', err);
          return;
        }

        if (stats.isFile() && filePath.endsWith('.js')) { // 仅处理 .css 文件
          // 读取文件内容
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error('读取文件失败:', err);
              return;
            }

            // 转换 px 为 rem
            const updatedContent = convertPxToRem(data);

            // 将转换后的内容写回文件
            fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
              if (err) {
                console.error('写入文件失败:', err);
              } else {
                console.log(`文件已更新: ${filePath}`);
              }
            });
          });
        } else if (stats.isDirectory()) {
          // 如果是目录，则递归调用处理
          processDirectory(filePath);
        }
      });
    });
  });
}

// 调用函数来处理文件夹
const directoryPath = '/Users/colin/Desktop/reactnative/FTFontEnd/android/app/src/main/assets/components'; // 设置你的文件夹路径
processDirectory(directoryPath);
