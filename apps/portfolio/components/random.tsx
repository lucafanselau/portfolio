export const FullPageGradient = () => {
  return (
    <div
      className={"absolute left-0 top-0 -z-10 h-full w-full overflow-hidden"}
    >
      <span
        className={
          "absolute -right-[200px] top-16 h-[85vh] w-[400px] rotate-[6deg] rounded-full bg-gradient-to-b from-green-300 via-cyan-600 to-blue-500 opacity-80 blur-3xl filter"
        }
      />
    </div>
  );
};
