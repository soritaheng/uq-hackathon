const CustomInput = ({
  defaultValue,
  placeholder,
  eventHandler,
  disabled,
  value,
  type = "text",
  isRequired = false,
}) => {
  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  return (
    <input
      type={type}
      value={value}
      onChange={eventHandler}
      placeholder={placeholder}
      className="placeholder:text-primary-400 placeholder:font-light px-4 py-2 border rounded-full border-primary  focus:outline-primary-700 w-full"
      onKeyDown={handlePressEnter}
      disabled={disabled}
      isRequired={isRequired}
    />
  );
};

export default CustomInput;
