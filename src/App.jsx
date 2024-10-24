import { useEffect, useRef } from "react"
import * as faceapi from 'face-api.js'

function App() {

  const interval = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  console.log(videoRef.current)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const videoEl = videoRef.current
      if (videoEl) {
        videoEl.srcObject = stream
      }
    })
  }, [])

  //Carregando os modelos
  useEffect(() => {
    Promise.all([
      faceapi.loadTinyFaceDetectorModel('/models'),
      faceapi.loadFaceLandmarkModel('/models'),
      faceapi.loadFaceExpressionModel('/models'),
    ]).then(() => {
      console.log('Models Loaded')
    })
  }, [])

  //Detectando a face
  function init() {
    interval.current = setInterval(() => {
      const videoEl = videoRef.current
      const canvasEl = canvasRef.current

      if (!videoEl || !canvasEl) return

      async function detect() {
        const detection = await faceapi.detectSingleFace(
          videoEl, new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions()

        console.log(detection.expressions.asSortedArray()[0].expression)

        //Desenhar no canvas
        if (detection) {
          const dimensions = {
            width: videoEl.offsetWidth,
            height: videoEl.offsetHeight,
          }

          faceapi.matchDimensions(canvasEl, dimensions);
          const resizeResults = faceapi.resizeResults(detection, dimensions);
          faceapi.draw.drawDetections(canvasEl, resizeResults);
          faceapi.draw.drawFaceLandmarks(canvasEl, resizeResults);
          faceapi.draw.drawFaceExpressions(canvasEl, resizeResults)
        }
      }
      detect()
    }, 2000);
  }

  function finish() {
    if (interval.current) {
      clearInterval(interval.current)
      interval.current = null

      console.log("Intervalo finalizado")
    }
  }
  return (
    <>
      <section className="flex items-center">

        <div className="relative bg-slate-500 aspect-video">
          <div className="relative">
            <video autoPlay ref={videoRef}></video>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
          </div>
        </div>

        <div className="w-1/2">
          <h1 className="text-white">Gráfico</h1>
        </div>
      </section>

      <div className="flex items-center justify-center mt-4 gap-4">
        <button className="bg-blue-600 w-48 h-7 rounded-lg text-white"
        onClick={init}>Iniciar</button> <br />
        <button className="bg-blue-600 w-48 h-7 rounded-lg text-white"
        onClick={finish}>Finalizar</button>
      </div>
    </>
  )
}

export default App