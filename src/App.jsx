import { useEffect, useRef } from "react"

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

  return (
    <section className="bg-gray-950 h-screen flex items-center justify-center">

      <div className="relative bg-slate-500 aspect-video">
        <video autoPlay ref={videoRef}></video>
      </div>

    </section>
  )
}

export default App
