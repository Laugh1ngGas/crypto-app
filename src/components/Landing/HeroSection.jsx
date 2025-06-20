import video1 from "../../assets/videos/video1.mp4";
import video2 from "../../assets/videos/video2.mp4";

const HeroSection = () => {
    return (
        <div className="flex flex-col items-center mt-6 lg:mt-20">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
                <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">Crypto App</span> tracking and holding cryptos
            </h1>
            <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur neque, quaerat culpa consequuntur eaque distinctio adipisci quod esse dolorum architecto?</p>
            <div className="flex justify-center my-10">
                <a href="#" className="bg-gradient-to-r from-orange-500 to-orange-800 py-3 px-4 mx-3 rounded-md text-nowrap text-center">
                    Lorem, ipsum dolor.
                </a>
                <a href="#" className="py-3 px-4 mx-3 rounded-md border text-nowrap text-center">Documentation</a>
            </div>
            <div className="flex flex-col lg:flex-row mt-10 justify-center items-center">
            <video autoPlay loop muted className="rounded-lg w-full lg:w-1/2 border border-orange-700 shadow-orange-500 mx-2 my-4">
                <source src={video1} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <video autoPlay loop muted className="rounded-lg w-full lg:w-1/2 border border-orange-700 shadow-orange-500 mx-2 my-4">
                <source src={video2} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            </div>
        </div>
    );
};

export default HeroSection;

