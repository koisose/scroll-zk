
const PAT = process.env.CLARIFAI_API_KEY;

const fs = require('fs').promises;
const USER_ID = 'openai';
const APP_ID = 'chat-completion';
// Change these to whatever model and text URL you want to use
const MODEL_ID = 'gpt-4-turbo';
const MODEL_VERSION_ID = '182136408b4b4002a920fd500839f2c8';

const showdown  = require('showdown');

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

async function copyFile(sourceFile, backupFile) {
  try {
      await fs.copyFile(sourceFile, backupFile);
      console.log('Source file was copied to destination file');
  } catch (err) {
      console.error('An error occurred:', err);
  }
}


function postModelOutputsPromise(input) {
    return new Promise((resolve, reject) => {
        stub.PostModelOutputs(
            {
                user_app_id: {
                    "user_id": USER_ID,
                    "app_id": APP_ID
                },
                model_id: MODEL_ID,
                version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version.
                inputs: [
                    {
                        "data": {
                            "text": {
                                "raw": input
                                
                            }
                        }
                    }
                ]
            },
            metadata,
            (err, response) => {
                if (err) {
                    reject(err);
                } else if (response.status.code !== 10000) {
                    reject(new Error("Post model outputs failed, status: " + response.status.description));
                } else {         
                    resolve(response);
                }
            }
        );
    });
}
async function writeFile(data, file) {
  try {
      await fs.writeFile(file, data);
      console.log('The file has been saved!');
  } catch (err) {
      console.error('An error occurred:', err);
  }
}
async function readFile(file) {
  try {
      const data = await fs.readFile(file, 'utf8');
      return data
  } catch (err) {
      console.error('An error occurred:', err);
  }
}



  async function run() {
    try {
      const sourceFile = '../../README.md';
const backupFile = '../../README.md.bak';
await copyFile(sourceFile, backupFile);
const source=await readFile(sourceFile);
const converter = new showdown.Converter();
const html = converter.makeHtml(source);

      const grammar=await postModelOutputsPromise(`without any explanation, and just return only the markdown, fix the grammar, and then convert the html to markdown, do not fix any grammatical error inside <pre></pre> of this html: ${html}`);
      let fixedGrammar=grammar.outputs[0].data.text.raw;
      

const markdown = fixedGrammar.replace(/^\`\`\`markdown\n/, '').replace(/\n\`\`\`$/, '');
      
       
      await writeFile(markdown, sourceFile);
      process.exit();
    } catch (e) {
      console.log(e.message);
      const backupFile = '../../README.md.bak';
      const backup=await readFile(backupFile);
      const sourceFile = '../../README.md';
      await writeFile(backup, sourceFile);
      process.exit();
    }
  }
  
  run();
  