export default function Banner(props){
    return(
        <div className="flex justify-center items-center mb-6">
                <img className="rounded-3xl w-full h-[400px] " src={props.background} alt={props.alt} />
                <h1 className=" text-white text-8xl font-bold absolute">{props.name}</h1>
            </div>
    )
}