import { useEffect, useRef, useState } from "react"
import * as faceapi from 'face-api.js'
import Chart from "react-apexcharts"

function App() {

  let surpreso, enojado, medo, triste, nervoso, feliz, neutro
  let arrayExpressions = []
  let arrayAmountExpressions = []
  
  const [arrayGraphic, setArrayGraphic] = useState([])

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
    const videoEl = videoRef.current
    const canvasEl = canvasRef.current

    surpreso = enojado = medo = triste = nervoso = feliz = neutro = 0
    arrayExpressions = []

    interval.current = setInterval(() => {

      if (!videoEl || !canvasEl) return

      async function detect() {
        const detection = await faceapi.detectSingleFace(
          videoEl, new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions()

        //console.log(detection.expressions)

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

          arrayExpressions.push(detection.expressions.asSortedArray()[0].expression)
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

      arrayExpressions.forEach(exp => {
        if (exp === "angry") {
          nervoso++
        }
        if (exp === "disgusted") {
          enojado++
        }
        if (exp === "fearful") {
          medo++
        }
        if (exp === "happy") {
          feliz++
        }
        if (exp === "neutral") {
          neutro++
        }
        if (exp === "sad") {
          triste++
        }
        if (exp === "surprised") {
          surpreso++
        }
      })

      arrayAmountExpressions.push(nervoso, enojado, medo, feliz, neutro, triste, surpreso)
      setArrayGraphic(arrayAmountExpressions)
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
        <Chart
          type='pie'
          width={630}
          height={398}

          series={arrayGraphic}

          options={{
            title: {
              text: 'Gráfico de expressões',
              style: { fontSize: '20px' }
            },
            labels: ['Nervoso', 'Enojado', 'Medo', 'Feliz', 'Neutro', 'Triste', 'Surpreso'],
            noData: {
              text: "Carregando...",
              align: 'center',
              verticalAlign: 'middle',
              offsetX: 0,
              offsetY: 0,
              style: {
                fontSize: '20px',
              }
            }
          }}
        >
        </Chart>
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