import { useEffect, useRef } from "react"
import * as faceapi from 'face-api.js'

function App() {

  const videoRef = useRef(null)

  console.log(videoRef.current)

  useEffect(() =>{

    navigator.mediaDevices.getUserMedia({video: true}).then((stream) =>{
      const videoEl = videoRef.current
      if(videoEl){
        videoEl.srcObject = stream
      }
    })

  },[])

//Carregando os modelos
  useEffect(() =>{
    Promise.all([
      faceapi.loadTinyFaceDetectorModel('/models'),
      faceapi.loadFaceLandmarkModel('/models'),
      faceapi.loadFaceExpressionModel('/models'),
    ]).then(() =>{
      console.log('Models Loaded')
    })
  }, [])

//Detectando a face
  useEffect(() => {
    const videoEl = videoRef.current
    if(!videoEl) return

    async function detect() {
      const detection = await faceapi.detectSingleFace(
        videoEl, new faceapi.TinyFaceDetectorOptions()
        )
      console.log(detection)
    }

    detect()
  }, [])


  return (
    <section className="bg-gray-950 h-screen flex items-center justify-center">

      <div className="relative bg-slate-500 aspect-video">
        <video autoPlay ref={videoRef}></video>
      </div>

      <div className="w-1/2">
        <h1 className="text-white">Gráfico</h1>
      </div>

    </section>
  )
}

export default App
