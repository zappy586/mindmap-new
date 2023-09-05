import "./landgingPage.css"
import img1 from "./Asset/mind-mapping.png"
import img2 from "./Asset/innovation (1).png"
import img3 from "./Asset/brain.png"
import GoogleAuth from "./googleAuth"
const landingPage = () => {
  return (
    <>
    <div className="container">
        <div className="title">
            <h1>MindMagic</h1>
        </div>
        <div className="info_container">
            <div className="info_left">
                <h2>
                    Transform dense notes into vibrant, interactive mind maps effortlessly. Our user-friendly platform offers customizable templates, real-time collaboration, and versatile export options. Experience improved memory retention and a deeper understanding of your studies. Join us in making learning more engaging and effective
                </h2>
                <div className="img_container">
                    <img src={img2} />
                    <img src={img3} />   
                </div>
            </div>
            <div className="info_left">
                <img src={img1} /> 
                <div className="button_container">
                    <h3>Create Your Mind Map Now </h3>
                    <GoogleAuth/>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default landingPage
