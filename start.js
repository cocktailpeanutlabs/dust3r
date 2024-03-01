module.exports = async (kernel) => {
  let device
  if (kernel.gpu === 'nvidia') {
    device = 'cuda'
  } else if (kernel.platform === 'darwin' && kernel.arch === 'arm64') {
    device = 'mps'
  } else {
    device = 'cpu'
  }
  let script = {
    daemon: true,
    run: [{
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        env: { "PYTORCH_ENABLE_MPS_FALLBACK": "1" },
        message: [
          "python demo.py --device " + device + " --weights checkpoints/DUSt3R_ViTLarge_BaseDecoder_512_dpt.pth"
        ],
        on: [{ "event": "/http:\/\/[0-9.:]+/", "done": true }]
      }
    }, {
      "method": "local.set",
      "params": {
        "url": "{{input.event[0]}}"
      }
    }, {
      "method": "proxy.start",
      "params": {
        "uri": "{{local.url}}",
        "name": "Local Sharing"
      }
    }]
  }
  return script
}
