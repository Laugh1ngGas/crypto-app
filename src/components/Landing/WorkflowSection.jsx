import { CheckCircle2 } from "lucide-react";
import functionalityImg from "../../assets/functionality.jpg";
import { checklistItems } from "../../constants";

const Workflow = () => {
    return (
        <div className="mt-20">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide">
                Lorem ipsum {" "}
                <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">dolor sit.</span>   
            </h2>
            <div className="flex flex-wrap lg:flex-nowrap justify-center items-center mt-12">
                <div className="p-2 w-full lg:w-1/2 flex justify-center mb-12">
                <img src={functionalityImg} alt="Functionality Image" className="max-w-full h-auto" />
                </div>
                <div className="w-full lg:w-1/2">
                {checklistItems.map((item, index) => (
                    <div key={index} className="flex mb-12">
                    <div className="text-green-400 bg-neutral-900 mx-6 h-10 w-10 p-2 flex justify-center items-center rounded-full">
                        <CheckCircle2 />
                    </div>
                    <div>
                        <h5 className="mt-1 mb-2 text-xl">{item.title}</h5>
                        <p className="text-md text-neutral-500">{item.description}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default Workflow;