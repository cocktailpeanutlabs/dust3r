const config = require("./config.js")
const pre = require("./pre.js")
module.exports = async (kernel) => {
  let torch = pre(config, kernel)
  let script = {
    run: [{
      method: "shell.run",
      params: {
        message: [
          //"git clone https://github.com/naver/dust3r --recursive app",
          "git clone https://github.com/cocktailpeanut/dust3r --recursive app",
        ]
      }
    }, {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "{{gpu === 'nvidia' ? 'conda install -y nvidia/label/cuda-12.1.0::cuda' : null}}",
          torch,
          "pip install -r requirements.txt"
        ],
      }
    }, {
      method: "fs.share",
      params: {
        venv: "app/env"
      }
    }, {
      method: "fs.share",
      params: {
        drive: {
          checkpoints: "app/checkpoints" 
        }
      }
    }, {
      method: "fs.download",
      params: {
        uri: "https://download.europe.naverlabs.com/ComputerVision/DUSt3R/DUSt3R_ViTLarge_BaseDecoder_512_dpt.pth ",
        dir: "app/checkpoints"
      }
    }, {
      method: "notify",
      params: {
        html: "Click the 'start' tab to get started!"
      }
    }]
  }
  return script
}
