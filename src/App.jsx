import { useEffect, useRef } from "react"
import * as faceapi from 'face-api.js'

function App() {

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
  //*Colocar em um set interval*/
  useEffect(() => {
    const videoEl = videoRef.current
    const canvasEl = canvasRef.current

    if (!videoEl || !canvasEl) return

    async function detect() {
      const detection = await faceapi.detectSingleFace(
        videoEl, new faceapi.TinyFaceDetectorOptions()
      )

      console.log(detection)

      //Desenhar no canvas
        if(detection){
          const dimensions = {
            width: videoEl.offsetWidth,
            height: videoEl.offsetHeight,
          }

          faceapi.matchDimensions(canvasEl, dimensions)
          const resizeResults = faceapi.resizeResults(detection, dimensions)
          faceapi.draw.drawDetections(canvasEl, resizeResults)
        }
    }

    detect()
  }, [])
 //*Colocar em um set interval*/



  return (
    <section className="bg-gray-950 h-screen flex items-center justify-center">

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
  )
}

export default App
