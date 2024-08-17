const ButtonPrimary = ({ eventHandler, label, icon }) => {
  return (
    <button
      onClick={eventHandler}
      className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      <p>{label}</p>
      {icon}
    </button>
  );
};

export default ButtonPrimary;
