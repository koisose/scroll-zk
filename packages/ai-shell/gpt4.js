
const { confirm } = require('@clack/prompts');
const { execSync, spawn } = require("child_process");
const USER_ID = 'openai';
const APP_ID = 'chat-completion';
// Change these to whatever model and text URL you want to use
const MODEL_ID = 'gpt-4-turbo';
const MODEL_VERSION_ID = '182136408b4b4002a920fd500839f2c8';



const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);



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
                                "raw": `${systemMessage}
                                ${input}`
                                
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
                    // Since we have one input, one output will exist here.
                          

                    resolve(response);
                }
            }
        );
    });
}


  async function run() {
    try {
        const PAT = process.env.CLARIFAI_API_KEY;
      const text=await postModelOutputsPromise(diffString)
      console.log(text)
      process.exit();
    } catch (e) {
      console.log(e.message);
      
      process.exit();
    }
  }
  
  run();
  