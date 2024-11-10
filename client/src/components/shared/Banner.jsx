export default function Banner(props) {
  return (
    <div className="flex items-center text-center justify-center mb-36">
      <img
        className="rounded-3xl w-screen"
        src={props.background}
        alt={props.alt}
      />
      <h1 className=" text-white text-8xl font-bold absolute">{props.name}</h1>
    </div>
  );
}
