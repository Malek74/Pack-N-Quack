export default function Banner(props) {
    return (
      <div className="relative flex justify-center items-center mb-6">
        <img
          className="rounded-3xl w-full h-[420px] object-cover"
          src={props.background}
          alt={props.alt}
        />
        <div
          className={`absolute text-white ${
            props.textAlign === "left" ? "left-20 text-left" : "text-center"
          } ${props.textAlign === "left" ? "max-w-2xl" : "max-w-4xl"} `}
        >
          <h1 className="text-5xl md:text-7xl font-bold">{props.name}</h1>
          {props.textAlign === "left" && props.description && (
            <p className="text-lg mt-4 max-w-md">{props.description}</p>
          )}
        </div>
      </div>
    );
  }
  