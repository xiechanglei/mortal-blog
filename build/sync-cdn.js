/**
 * 使用cdn加速资源 - 七牛云同步工具
 * 目前来说，需要域名的支持，暂时没有打算，先放在这里备用
 */

const qiniu = require('qiniu');
const fs = require('fs');
const path = require('path');

/**
 * 从系统环境变量中获取七牛云的配置信息
 * @type {string}
 */
const getEnvVar = (varName, defaultValue = '') => {
    return process.env[varName] || defaultValue;
}

// 配置信息
const accessKey = getEnvVar("qiniu_ak");
const secretKey = getEnvVar("qiniu_sk");
const bucket = "mortal-blog";


// const needUploadDir = ['articles', 'data', 'covers']; // 更新文章之后需要上传的目录
const needUploadDir = ['articles', 'data', 'covers', 'public']; // 修改了页面代码之后想要上传的目录
// const needUploadDir = ['articles', 'data', 'covers', 'public', 'lib']; // 全站上传

// 配置七牛云认证
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// 创建上传策略
const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket
});

// 创建上传管理器
const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0; // 根据你的 bucket 区域选择合适的 zone
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

// 获取所有需要上传的文件路径
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, arrayOfFiles);
        } else {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
}

// 上传单个文件到七牛云
async function uploadFile(localFile, key) {
    return new Promise((resolve, reject) => {
        const uploadToken = putPolicy.uploadToken(mac);

        formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
            if (respErr) {
                reject(respErr);
                return;
            }

            if (respInfo.statusCode === 200) {
                console.log(`✅ 上传成功: ${key}`);
                resolve(respBody);
            } else {
                console.error(`❌ 上传失败: ${key}`, respBody);
                reject(new Error(`上传失败: ${respInfo.statusCode}`));
            }
        });
    });
}

// 同步目录到七牛云
async function syncDirToQiniu(dirName) {
    const dirPath = path.join(__dirname, '..', dirName);

    if (!fs.existsSync(dirPath)) {
        console.log(`⚠️  目录不存在: ${dirPath}`);
        return;
    }

    console.log(`\n📁 正在处理目录: ${dirName}`);

    const files = getAllFiles(dirPath);
    const uploadPromises = [];

    for (const filePath of files) {
        // 计算相对于项目根目录的路径作为上传到七牛云的 key
        const relativePath = path.relative(path.join(__dirname, '..'), filePath);
        uploadPromises.push(uploadFile(filePath, relativePath));
    }

    try {
        await Promise.all(uploadPromises);
        console.log(`✅ 目录 ${dirName} 同步完成`);
    } catch (error) {
        console.error(`❌ 目录 ${dirName} 同步出错:`, error.message);
    }
}

// 主函数
async function main() {
    console.log('🚀 开始同步文件到七牛云 CDN...');

    for (const dir of needUploadDir) {
        await syncDirToQiniu(dir);
    }

    console.log('\n🎉 所有文件同步完成！');
}

// 执行主函数
if (require.main === module) {
    main().catch(error => {
        console.error('❌ 同步过程中发生错误:', error);
        process.exit(1);
    });
}

module.exports = {
    syncDirToQiniu,
    uploadFile
};

