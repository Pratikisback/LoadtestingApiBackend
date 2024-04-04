import fs from 'fs';
import { Client as MinioClient } from 'minio';

const minioClient = new MinioClient({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'GVEOPZiNoxWgTWHeqaHW',
    secretKey: 'E4uCUhHmAZm15fCEw2EZbrBGg97W9rDV93IoXciK',
});

export const runLoadTest = async (req, res) => {  const {url, method, filename, token, authorizationType, dataFormat, payload, vus, duration, username, password, queryParams}=req.body;
    if (!url || !vus || !duration || !method || !filename) {
        throw new Error('Missing required parameters');
    }

    let Authorization;
    if (authorizationType === 'bearer') {
        Authorization = `Bearer ${token}`;
    } else if (authorizationType === 'basic') {
        const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');
        Authorization = `Basic ${encodedCredentials}`;
    } else {
        throw new Error('Invalid authorization type');
    }

    let headers;

    // Add dynamic Content-Type header based on dataFormat
    if (dataFormat === 'json') {
        headers = "'Content-Type' :'application/json'";
    } else if (dataFormat === 'html') {
        headers = "'Content-Type' : 'text/html'";
    } else if (dataFormat === 'xml') {
        headers = "'Content-Type' : 'application/xml'";
    } else if (dataFormat === 'js') {
        headers = "'Content-Type':'application/javascript'";
    } else {
        throw new Error('Invalid data format');
    }

    let script;

    if (method.toUpperCase() === 'GET' || method.toUpperCase() === 'DEL') {
        script = `
            import http from 'k6/http';
            import { sleep } from 'k6';

            export const options = {
                vus: ${vus},
                duration: '${duration}s',
            };

            export default function () {
                const url = '${url}'${queryParams ? " + '?' + '" + queryParams + "'" : ''};
                let headers = {
                    ${JSON.stringify(headers)}
                    'Authorization':'${Authorization}'
                };
                const response = http.${method.toLowerCase()}(url, { headers: headers });
                sleep(Math.random() * 3);
            }
        `;
    } else {
        script = `
            import http from 'k6/http';
            import { sleep } from 'k6';

            export const options = {
                vus: ${vus},
                duration: '${duration}s',
            };

            export default function () {
                const url = '${url}'${queryParams ? " + '?' + '" + queryParams + "'" : ''};
                const payload = ${JSON.stringify(payload)};
                let headers = {
                    ${headers},
                    'Authorization':'${Authorization}'
                };
                const response = http.${method.toLowerCase()}(url, payload, { headers: headers });
                sleep(Math.random() * 3);
            }
        `;
    }

    try {
      await fs.promises.writeFile(`${filename}.js`, script);
      console.log('Load test file generated successfully');
      const bucketName = 'madhandev';
      const objectName = `${filename}.js`;
      const FilePath = `./${filename}.js`;

      await uploadFileToMinio(bucketName, objectName, FilePath); 

      res.status(200).json({ message: 'Load test file generated successfully' });
  } catch (error) {
      console.error('Error generating load test file:', error);
      res.status(500).json({ error: 'Error generating load test file' });
  }
}
async function uploadFileToMinio(bucketName, objectName, filePath) {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName);
            console.log(`Bucket '${bucketName}' created successfully.`);
        }

        await minioClient.fPutObject(bucketName, objectName, filePath);
        console.log(`File '${objectName}' uploaded successfully to bucket '${bucketName}'.`);

        const objectUrl = minioClient.presignedGetObject(bucketName, objectName);
        console.log(`Object URL: ${objectUrl}`);

        return objectUrl;
    } catch (error) {
        console.error('Error uploading file to Minio:', error);
        throw new Error('Error uploading file to Minio');
    }
}

